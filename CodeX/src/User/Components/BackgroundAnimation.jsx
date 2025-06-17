import { useEffect, useRef } from "react";

const BackgroundAnimation = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const particles = particlesRef.current;
    const ctx = particles.getContext("2d");
    let animationFrameId;

    particles.width = window.innerWidth;
    particles.height = window.innerHeight;

    const particlesArray = [];
    const numberOfParticles = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * particles.width;
        this.y = Math.random() * particles.height;
        this.size = Math.random() * 1.2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > particles.width)
          this.x = Math.random() * particles.width;
        if (this.y < 0 || this.y > particles.height)
          this.y = Math.random() * particles.height;
      }

      draw() {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, particles.width, particles.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    init();
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={particlesRef} className="particles"></canvas>;
};

export default BackgroundAnimation;
