class CodingBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.codeLines = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.animationId = null;

    // Coding symbols and keywords for the animation
    this.codeSymbols = [
      "function",
      "const",
      "let",
      "var",
      "if",
      "else",
      "for",
      "while",
      "class",
      "return",
      "import",
      "export",
      "async",
      "await",
      "try",
      "catch",
      "{",
      "}",
      "(",
      ")",
      "[",
      "]",
      ";",
      ":",
      "=",
      "+",
      "-",
      "*",
      "/",
      "==",
      "!=",
      "<=",
      ">=",
      "&&",
      "||",
      "=>",
      "...",
      "null",
      "undefined",
      "true",
      "false",
      "console.log",
      "document",
      "window",
      "this",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
    ];

    this.colors = [
      "rgba(239, 68, 68, 0.7)", // Red
      "rgba(239, 68, 68, 0.5)", // Light red
      "rgba(255, 255, 255, 0.8)", // White
      "rgba(255, 255, 255, 0.6)", // Light white
      "rgba(163, 163, 163, 0.7)", // Gray
      "rgba(163, 163, 163, 0.5)", // Light gray
    ];
  }

  init() {
    this.createCanvas();
    this.setupEventListeners();
    this.createParticles();
    this.updateTheme();
    this.startAnimation();
  }

  updateTheme() {
    // Adapt colors based on current theme
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      this.colors = [
        "rgba(239, 68, 68, 0.8)", // Red
        "rgba(239, 68, 68, 0.6)", // Light red
        "rgba(255, 255, 255, 0.9)", // White
        "rgba(255, 255, 255, 0.7)", // Light white
        "rgba(163, 163, 163, 0.8)", // Gray
        "rgba(163, 163, 163, 0.6)", // Light gray
      ];
      this.canvas.style.opacity = "0.6";
    } else {
      this.colors = [
        "rgba(239, 68, 68, 0.7)", // Red
        "rgba(239, 68, 68, 0.5)", // Light red
        "rgba(255, 255, 255, 0.8)", // White
        "rgba(255, 255, 255, 0.6)", // Light white
        "rgba(163, 163, 163, 0.7)", // Gray
        "rgba(163, 163, 163, 0.5)", // Light gray
      ];
      this.canvas.style.opacity = "0.4";
    }
  }

  createCanvas() {
    // Create canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.id = "coding-background";
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.4;
    `;

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.resizeCanvas());

    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          this.updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Performance optimization: pause when page is not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }
      } else {
        if (!this.animationId) {
          this.startAnimation();
        }
      }
    });
  }

  createParticles() {
    const numParticles = Math.floor(
      (window.innerWidth * window.innerHeight) / 15000,
    );

    for (let i = 0; i < numParticles; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 1 + 0.5,
        size: Math.random() * 12 + 8,
        opacity: Math.random() * 0.7 + 0.3,
        hoverOpacity: Math.random() * 0.7 + 0.3,
        symbol:
          this.codeSymbols[Math.floor(Math.random() * this.codeSymbols.length)],
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Create floating code lines
    for (let i = 0; i < 3; i++) {
      this.codeLines.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        text: this.generateCodeLine(),
        opacity: Math.random() * 0.4 + 0.1,
        size: Math.random() * 8 + 10,
        color: this.colors[Math.floor(Math.random() * 3)], // Use only first 3 colors
      });
    }
  }

  generateCodeLine() {
    const codeExamples = [
      "const magic = await createAwesome();",
      "function buildDreams() { return reality; }",
      "if (passionate) { keepCoding(); }",
      "export default creativity;",
      "while (learning) { grow(); }",
      "const success = hardWork + passion;",
      "async function achieve() { return promise; }",
      "let inspiration = true;",
    ];
    return codeExamples[Math.floor(Math.random() * codeExamples.length)];
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Enhanced mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Attraction and repulsion zones
      if (distance < 150) {
        const force = (150 - distance) / 150;

        // Close hover effect - particles move away
        if (distance < 80) {
          particle.x -= (dx / distance) * force * 1.2;
          particle.y -= (dy / distance) * force * 1.2;

          // Add extra opacity boost
          particle.hoverOpacity = Math.min(1, particle.opacity + force * 0.3);
        }
        // Medium distance - slight attraction
        else if (distance < 120) {
          particle.x += (dx / distance) * force * 0.3;
          particle.y += (dy / distance) * force * 0.3;
          particle.hoverOpacity = particle.opacity + force * 0.2;
        }
        // Far distance - gentle pull
        else {
          particle.x += (dx / distance) * force * 0.1;
          particle.y += (dy / distance) * force * 0.1;
          particle.hoverOpacity = particle.opacity + force * 0.1;
        }
      } else {
        // Reset to normal opacity when far from mouse
        particle.hoverOpacity = particle.opacity;
      }

      // Update rotation and pulse
      particle.rotation += particle.rotationSpeed;
      particle.pulsePhase += particle.pulseSpeed;

      // Wrap around screen
      if (particle.x < -50) particle.x = window.innerWidth + 50;
      if (particle.x > window.innerWidth + 50) particle.x = -50;
      if (particle.y < -50) particle.y = window.innerHeight + 50;
      if (particle.y > window.innerHeight + 50) particle.y = -50;
    });

    // Enhanced code lines interaction
    this.codeLines.forEach((line) => {
      // Mouse interaction for code lines
      const dx = this.mouseX - line.x;
      const dy = this.mouseY - line.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Code lines react to mouse proximity
      if (distance < 200) {
        const force = (200 - distance) / 200;
        line.vx += (dx / distance) * force * 0.002;
        line.vy += (dy / distance) * force * 0.002;
        line.hoverOpacity = Math.min(0.8, line.opacity + force * 0.3);
      } else {
        line.hoverOpacity = line.opacity;
      }

      line.x += line.vx;
      line.y += line.vy;

      // Damping for velocity
      line.vx *= 0.99;
      line.vy *= 0.99;

      // Wrap around screen
      if (line.x < -300) line.x = window.innerWidth + 300;
      if (line.x > window.innerWidth + 300) line.x = -300;
      if (line.y < -50) line.y = window.innerHeight + 50;
      if (line.y > window.innerHeight + 50) line.y = -50;
    });
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw particles
    this.particles.forEach((particle) => {
      this.ctx.save();

      // Use hover opacity if available, otherwise use pulsing opacity
      const baseOpacity = particle.hoverOpacity || particle.opacity;
      const pulseOpacity =
        baseOpacity * (0.8 + 0.2 * Math.sin(particle.pulsePhase));

      this.ctx.translate(particle.x, particle.y);
      this.ctx.rotate(particle.rotation);
      this.ctx.font = `${particle.size}px 'JetBrains Mono', monospace`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      // Enhanced glow effect based on mouse proximity
      const glowIntensity = particle.hoverOpacity > particle.opacity ? 12 : 8;
      this.ctx.shadowColor = particle.color;
      this.ctx.shadowBlur = glowIntensity;
      this.ctx.fillStyle = particle.color.replace(
        /[\d\.]+\)$/g,
        pulseOpacity + ")",
      );

      this.ctx.fillText(particle.symbol, 0, 0);

      this.ctx.restore();
    });

    // Draw floating code lines
    this.codeLines.forEach((line) => {
      this.ctx.save();

      this.ctx.font = `${line.size}px 'JetBrains Mono', monospace`;
      const lineOpacity = line.hoverOpacity || line.opacity;
      this.ctx.fillStyle = line.color.replace(/[\d\.]+\)$/g, lineOpacity + ")");
      this.ctx.shadowColor = line.color;
      this.ctx.shadowBlur = lineOpacity > line.opacity ? 8 : 4;

      this.ctx.fillText(line.text, line.x, line.y);

      this.ctx.restore();
    });
  }

  animate() {
    this.updateParticles();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  startAnimation() {
    this.animate();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Initialize the coding background when the page loads
let codingBackground;

function initCodingBackground() {
  // Only initialize on home and about pages
  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/") ||
    window.location.pathname.endsWith("index.html");
  const isAboutPage = window.location.pathname.endsWith("about.html");

  if (isHomePage || isAboutPage) {
    codingBackground = new CodingBackground();
    codingBackground.init();
  }
}

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  if (codingBackground) {
    codingBackground.destroy();
  }
});

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCodingBackground);
} else {
  initCodingBackground();
}
