// Smoothly cycle text color (and a bit of opacity) for album titles
if (window.AFRAME && !AFRAME.components["color-cycle"]) {
  AFRAME.registerComponent("color-cycle", {
    schema: {
      speed: { type: "number", default: 1.2 },
      phase: { type: "number", default: 0 },
      minOpacity: { type: "number", default: 0.6 },
      maxOpacity: { type: "number", default: 1.0 },
    },
    tick: function (timeMs) {
      const t = (timeMs / 1000) * this.data.speed + this.data.phase;

      // RGB sine wave (phase-shifted) for smooth rainbow cycling
      const r = 0.5 + 0.5 * Math.sin(t);
      const g = 0.5 + 0.5 * Math.sin(t + 2.094); // +120°
      const b = 0.5 + 0.5 * Math.sin(t + 4.188); // +240°

      const toHex = (v) => {
        const n = Math.max(0, Math.min(255, Math.round(v * 255)));
        return n.toString(16).padStart(2, "0");
      };

      const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      this.el.setAttribute("text", "color", hex);

      // Soft fade/pulse
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.4);
      const opacity =
        this.data.minOpacity +
        (this.data.maxOpacity - this.data.minOpacity) * pulse;
      this.el.setAttribute("text", "opacity", opacity);
    },
  });
}

// Play songs 1–4 when their targets (0–3) are visible
document.addEventListener("DOMContentLoaded", () => {
  const target0 = document.querySelector("#album-target-0");
  const player1 = document.querySelector("#song1-player");
  const target1 = document.querySelector("#album-target-1");
  const player2 = document.querySelector("#song2-player");
  const target2 = document.querySelector("#album-target-2");
  const player3 = document.querySelector("#song3-player");
  const target3 = document.querySelector("#album-target-3");
  const player4 = document.querySelector("#song4-player");

  if (!target3 || !player4) return;

  const setupHandlers = (target, player) => {
    if (!target || !player) return;

    const setupSoundHandlers = () => {
      const sound = player.components && player.components.sound;
      if (!sound) return;

      target.addEventListener("targetFound", () => {
        sound.playSound();
      });

      target.addEventListener("targetLost", () => {
        sound.pauseSound();
      });
    };

    if (player.hasLoaded) {
      setupSoundHandlers();
    } else {
      player.addEventListener("loaded", setupSoundHandlers, { once: true });
    }
  };

  // Target 0 → song 1
  setupHandlers(target0, player1);

  // Target 1 → song 2
  setupHandlers(target1, player2);

  // Target 2 → song 3
  setupHandlers(target2, player3);

  // Target 3 → song 4
  setupHandlers(target3, player4);
});
