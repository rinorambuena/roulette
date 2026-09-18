function init() {
  DEFAULT_NAMES.slice(0, 4).forEach(n => state.slots.push({ name: n }));
  buildConfig();
  drawWheel(state.currentAngle);
}

init();
