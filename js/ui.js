function getMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function buildConfig() {
  const panel = document.getElementById("config-panel");
  panel.innerHTML = "";

  state.slots.forEach((slot, i) => {
    const row = document.createElement("div");
    row.className = "config-row";

    const num = document.createElement("span");
    num.className = "slot-num";
    num.textContent = i + 1;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "name-input";
    input.maxLength = 20;
    input.value = slot.name;
    input.placeholder = DEFAULT_NAMES[i] ?? `Participante ${i + 1}`;
    input.disabled = state.eliminationRunning;
    input.oninput = () => {
      state.slots[i].name = input.value;
      drawWheel(state.currentAngle);
    };

    row.append(num, input);

    if (state.slots.length > 2 && !state.eliminationRunning) {
      const del = document.createElement("button");
      del.className = "remove-slot";
      del.textContent = "×";
      del.title = "Eliminar";
      del.onclick = () => {
        state.slots.splice(i, 1);
        buildConfig();
        drawWheel(state.currentAngle);
      };
      row.appendChild(del);
    }

    panel.appendChild(row);
  });
}

function addSlot() {
  if (state.slots.length >= 12 || state.eliminationRunning) return;
  state.slots.push({ name: "" });
  buildConfig();
  drawWheel(state.currentAngle);
  const inputs = document.querySelectorAll(".name-input");
  inputs[inputs.length - 1].focus();
}

function bulkLoad(str) {
  if (state.eliminationRunning) return;
  const names = str.split(";").map(s => s.trim()).filter(Boolean);
  if (!names.length) return;
  state.slots = names.slice(0, 12).map(n => ({ name: n }));
  buildConfig();
  drawWheel(state.currentAngle);
  setStatus(`${state.slots.length} participantes cargados.`);
  document.getElementById("result-banner").style.display = "none";
}

function setStatus(msg) {
  document.getElementById("status-msg").textContent = msg;
}

function showResult(name, type) {
  const banner = document.getElementById("result-banner");
  if (type === "loser") {
    setStatus(`¡${name} es el finalista!`);
    banner.innerHTML = `
      <div>🏆 El finalista</div>
      <div class="chosen">${name}</div>
    `;
  } else {
    setStatus(`¡${name} es el seleccionado!`);
    banner.innerHTML = `
      <div>🎯 Seleccionado</div>
      <div class="chosen">${name}</div>
    `;
  }
  banner.style.display = "";
  document.getElementById("spin-btn").disabled = false;
  playDing();
}

function showEliminated(name, onContinue) {
  const banner = document.getElementById("result-banner");
  banner.innerHTML = `
    <div>❌ Eliminado</div>
    <div class="chosen elimination">${name}</div>
  `;
  banner.style.display = "";
  setTimeout(() => {
    banner.style.display = "none";
    onContinue();
  }, ELIMINATION_PAUSE_MS);
}
