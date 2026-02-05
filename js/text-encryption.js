class TextEncryption {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;
    this.isAnimating = false;
    this.iterations = 0;
    this.animationSpeed = 50; // milliseconds
    this.maxIterations = 20;

    // Characters for scrambling effect
    this.scrambleChars = "!<>-_\\/[]{}—=+*^?#________";

    this.init();
  }

  init() {
    this.element.addEventListener("mouseenter", () => this.startEncryption());
    this.element.addEventListener("mouseleave", () => this.stopEncryption());

    // Add CSS class for styling
    this.element.classList.add("text-encryption");
  }

  startEncryption() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.iterations = 0;
    this.animate();
  }

  stopEncryption() {
    this.isAnimating = false;
    this.iterations = 0;
    this.element.textContent = this.originalText;
  }

  animate() {
    if (!this.isAnimating) return;

    this.iterations += 1;

    const scrambledText = this.originalText
      .split("")
      .map((letter, index) => {
        // Keep spaces as spaces
        if (letter === " ") return " ";

        // Gradually reveal letters from left to right
        if (index < this.iterations) {
          return this.originalText[index];
        }

        // Scramble remaining letters
        return this.scrambleChars[
          Math.floor(Math.random() * this.scrambleChars.length)
        ];
      })
      .join("");

    this.element.textContent = scrambledText;

    // Continue animation until all letters are revealed
    if (this.iterations < this.originalText.length) {
      setTimeout(() => this.animate(), this.animationSpeed);
    } else {
      // Hold the final text briefly, then reset for continuous effect
      setTimeout(() => {
        if (this.isAnimating) {
          this.iterations = 0;
          this.animate();
        }
      }, 200);
    }
  }
}

// Advanced Matrix-style encryption effect
class MatrixEncryption {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;
    this.isAnimating = false;

    // Matrix-style characters
    this.matrixChars = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ1234567890";
    this.glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    this.init();
  }

  init() {
    this.element.addEventListener("mouseenter", () => this.startMatrixEffect());
    this.element.addEventListener("mouseleave", () => this.stopMatrixEffect());

    // Add CSS class for styling
    this.element.classList.add("matrix-encryption");
  }

  startMatrixEffect() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.runMatrixEffect();
  }

  stopMatrixEffect() {
    this.isAnimating = false;
    this.element.textContent = this.originalText;
  }

  runMatrixEffect() {
    let iteration = 0;
    const maxIterations = 30;

    const animate = () => {
      if (!this.isAnimating) return;

      const scrambledText = this.originalText
        .split("")
        .map((letter, index) => {
          if (letter === " ") return " ";

          // Use a wave effect to reveal letters
          const revealThreshold =
            Math.sin(iteration * 0.1 + index * 0.3) * 15 + 15;

          if (iteration > revealThreshold) {
            return this.originalText[index];
          }

          // Mix matrix and glitch characters
          const useMatrix = Math.random() > 0.3;
          const chars = useMatrix ? this.matrixChars : this.glitchChars;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      this.element.textContent = scrambledText;
      iteration++;

      if (iteration < maxIterations && this.isAnimating) {
        requestAnimationFrame(animate);
      } else if (this.isAnimating) {
        // Brief pause then restart
        setTimeout(() => {
          iteration = 0;
          animate();
        }, 300);
      }
    };

    animate();
  }
}

// Hacker-style typing effect
class HackerTypeEffect {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;
    this.isAnimating = false;

    this.hackerChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";

    this.init();
  }

  init() {
    this.element.addEventListener("mouseenter", () => this.startHackerEffect());
    this.element.addEventListener("mouseleave", () => this.stopHackerEffect());

    this.element.classList.add("hacker-encryption");
  }

  startHackerEffect() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.runHackerEffect();
  }

  stopHackerEffect() {
    this.isAnimating = false;
    this.element.textContent = this.originalText;
  }

  async runHackerEffect() {
    const letters = this.originalText.split("");

    // Phase 1: Scramble everything
    for (let i = 0; i < 5; i++) {
      if (!this.isAnimating) return;

      const scrambled = letters
        .map((letter) =>
          letter === " "
            ? " "
            : this.hackerChars[
                Math.floor(Math.random() * this.hackerChars.length)
              ],
        )
        .join("");

      this.element.textContent = scrambled;
      await this.delay(40);
    }

    // Phase 2: Resolve each letter one by one
    for (let i = 0; i < letters.length; i++) {
      if (!this.isAnimating) return;

      // Scramble remaining letters while keeping resolved ones
      for (let j = 0; j < 2; j++) {
        const resolved = letters.slice(0, i + 1);
        const scrambled = letters
          .slice(i + 1)
          .map((letter) =>
            letter === " "
              ? " "
              : this.hackerChars[
                  Math.floor(Math.random() * this.hackerChars.length)
                ],
          );

        this.element.textContent = [...resolved, ...scrambled].join("");
        await this.delay(25);
      }
    }

    // Hold the final result
    this.element.textContent = this.originalText;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Initialize the encryption effect when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  const heroName = document.getElementById("hero-name");

  if (heroName) {
    // You can switch between different effects:
    // new TextEncryption(heroName);     // Simple scramble
    // new MatrixEncryption(heroName);   // Matrix style
    new HackerTypeEffect(heroName); // Hacker typing style
  }
});
