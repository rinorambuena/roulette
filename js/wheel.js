function drawWheel(angle, wheelSlots) {
  const draw = wheelSlots ?? state.slots;
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = cx - 4;
  const n = draw.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (n === 0) return;

  const arc = (2 * Math.PI) / n;

  draw.forEach((slot, i) => {
    const start = angle + i * arc;
    const end = start + arc;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    const midAngle = start + arc / 2;
    const textR = r * 0.62;
    const tx = cx + Math.cos(midAngle) * textR;
    const ty = cy + Math.sin(midAngle) * textR;

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(midAngle + Math.PI / 2);
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${arc > 0.6 ? 14 : 11}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const label = slot.name || `#${i + 1}`;
    ctx.fillText(truncate(label, 12), 0, 0);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#d3d1c7";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

function spinOnce(wheelSlots, onDone) {
  if (state.spinning) return;
  state.spinning = true;
  document.getElementById("spin-btn").disabled = true;
  document.getElementById("result-banner").style.display = "none";
  setStatus("Girando…");

  const n = wheelSlots.length;
  const arc = (2 * Math.PI) / n;
  const winnerIndex = Math.floor(Math.random() * n);

  const extraSpins = (5 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
  const pointerAngle = -Math.PI / 2;
  const slotCenter = winnerIndex * arc + arc / 2;
  const rawTarget = pointerAngle - slotCenter;
  const targetAngle = rawTarget - Math.floor(rawTarget / (2 * Math.PI)) * (2 * Math.PI);
  const totalRotation =
    extraSpins +
    (targetAngle - ((state.currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  const startAngle = state.currentAngle;
  const endAngle = startAngle + totalRotation;

  const duration = 4000 + Math.random() * 1000;
  const startTime = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

  function frame(now) {
    if (state.eliminationAborted) {
      state.spinning = false;
      return;
    }
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    state.currentAngle = startAngle + (endAngle - startAngle) * easeOut(t);
    drawWheel(state.currentAngle, wheelSlots);

    if (t < 1) {
      state.animFrame = requestAnimationFrame(frame);
    } else {
      state.currentAngle = endAngle;
      drawWheel(state.currentAngle, wheelSlots);
      state.spinning = false;
      onDone(winnerIndex);
    }
  }

  state.animFrame = requestAnimationFrame(frame);
}
