
import { useEffect, useRef } from "react";

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(100, Math.floor(window.innerWidth / 20));
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 0.2;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          color: i % 5 === 0 ? "rgb(0, 255, 81)" : "rgb(255, 255, 255)",
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          maxConnections: 5,
          connections: []
        });
      }
    };

    const drawParticle = (particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    };

    const updateParticle = (particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }
      
      // Reset particle connections
      particle.connections = [];
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
          const particleB = particles[j];
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;
          
          if (distance < maxDistance && 
              particleA.connections.length < particleA.maxConnections && 
              particleB.connections.length < particleB.maxConnections) {
            
            particleA.connections.push(j);
            particleB.connections.push(i);
            
            const opacity = 1 - (distance / maxDistance);
            const isGreen = particleA.color.includes("16, 185, 129") || 
                           particleB.color.includes("16, 185, 129");
            
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.strokeStyle = isGreen 
              ? `rgba(16, 185, 129, ${opacity * 0.5})` 
              : `rgba(255, 255, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw mouse trail if needed
      if (mousePosition.x && mousePosition.y) {
        const radius = 100;
        const gradient = ctx.createRadialGradient(
          mousePosition.x, mousePosition.y, 0,
          mousePosition.x, mousePosition.y, radius
        );
        gradient.addColorStop(0, "rgba(0, 255, 170, 0.1)");
        gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
        
        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
      });
      
      // Connect particles
      connectParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Track mouse position
    const mousePosition = { x: null, y: null };
    
    const handleMouseMove = (event) => {
      mousePosition.x = event.clientX;
      mousePosition.y = event.clientY;
    };
    
    const handleMouseLeave = () => {
      mousePosition.x = null;
      mousePosition.y = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: "linear-gradient(to bottom, #0f0f0f, #000000)" }}
    />
  );
};

export default BackgroundAnimation;
