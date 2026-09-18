function spin() {
  if (state.spinning || state.eliminationRunning || state.slots.length < 2) return;

  if (getMode() === "elimination") {
    runElimination();
    return;
  }

  spinOnce(state.slots, (winnerIndex) => {
    showResult(state.slots[winnerIndex].name || `#${winnerIndex + 1}`, "simple");
  });
}

function runElimination() {
  state.eliminationRunning = true;
  state.eliminationAborted = false;
  document.getElementById("spin-btn").disabled = true;
  document.getElementById("result-banner").style.display = "none";
  setStatus("¡Y arranca la eliminación!");
  buildConfig();

  const remaining = state.slots.map(s => ({ ...s }));
  state.currentAngle = 0;

  function nextSpin() {
    if (state.eliminationAborted) {
      endElimination();
      return;
    }

    if (remaining.length === 1) {
      drawWheel(state.currentAngle, remaining);
      showResult(remaining[0].name || "#1", "loser");
      endElimination();
      return;
    }

    setStatus(`Quedan ${remaining.length} participantes…`);

    spinOnce(remaining, (winnerIndex) => {
      if (state.eliminationAborted) { endElimination(); return; }

      const eliminated = remaining[winnerIndex].name || `#${winnerIndex + 1}`;
      setStatus(`❌ ${eliminated} eliminado`);

      showEliminated(eliminated, () => {
        if (state.eliminationAborted) { endElimination(); return; }
        remaining.splice(winnerIndex, 1);
        state.currentAngle = 0;
        drawWheel(0, remaining);
        nextSpin();
      });
    });
  }

  nextSpin();
}

function endElimination() {
  state.eliminationRunning = false;
  state.eliminationAborted = false;
  document.getElementById("spin-btn").disabled = false;
  buildConfig();
}

function resetWheel() {
  if (state.animFrame) cancelAnimationFrame(state.animFrame);
  state.eliminationAborted = true;
  state.spinning = false;
  state.eliminationRunning = false;
  document.getElementById("spin-btn").disabled = false;
  document.getElementById("result-banner").style.display = "none";
  setStatus("Configura y presiona Girar para arrancar la ruleta.");
  drawWheel(state.currentAngle);
  buildConfig();
}
