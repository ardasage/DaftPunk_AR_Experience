// Smoothly cycle text color (and a bit of opacity) for "neon" effect
if (window.AFRAME && !AFRAME.components["color-cycle"]) {
  AFRAME.registerComponent("color-cycle", {
    schema: {
      speed: { type: "number", default: 1.2 },
      phase: { type: "number", default: 0 },
      minOpacity: { type: "number", default: 0.55 },
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

// Toggle between Manuel and Thomas helmets on the face anchor
document.addEventListener("DOMContentLoaded", () => {
  const manuelHelmet = document.querySelector("#manuel-helmet");
  const thomasHelmet = document.querySelector("#thomas-helmet");
  const toggleButton = document.querySelector("#helmet-toggle");

  if (!manuelHelmet || !thomasHelmet || !toggleButton) return;

  let isManuelActive = false;

  const updateView = () => {
    manuelHelmet.setAttribute("visible", isManuelActive);
    thomasHelmet.setAttribute("visible", !isManuelActive);
    toggleButton.textContent = "Switch helmet";

    toggleButton.classList.toggle("face-toggle--manuel", isManuelActive);
    toggleButton.classList.toggle("face-toggle--thomas", !isManuelActive);
  };

  toggleButton.addEventListener("click", () => {
    isManuelActive = !isManuelActive;
    updateView();
  });

  // Initial state
  updateView();
});

