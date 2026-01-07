import React, { useEffect, useRef } from 'react';

interface StarryBackgroundProps {
  children: React.ReactNode;
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // --- Star Generation Logic ---
    interface Star {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speed: number; // Twinkle speed
      direction: number; // 1 for getting brighter, -1 for getting dimmer
    }

    const stars: Star[] = [];
    const numStars = Math.floor((width * height) / 4000); // Density based on screen area

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5, // 0.5 to 2.0 size
        opacity: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // --- Shooting Star Logic ---
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      angle: number;
    }

    const shootingStars: ShootingStar[] = [];

    // --- Animation Loop ---
    let animationFrameId: number;

    const render = () => {
      // Clear canvas with the dark background color
      ctx.fillStyle = '#0B0C10'; // Deep Dark Blue/Black
      ctx.fillRect(0, 0, width, height);

      // Draw Stars
      stars.forEach(star => {
        // Update opacity for twinkle effect
        star.opacity += star.speed * star.direction;

        // Reverse direction if limits reached
        if (star.opacity > 1) {
          star.opacity = 1;
          star.direction = -1;
        } else if (star.opacity < 0.2) {
          star.opacity = 0.2;
          star.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = star.radius * 2;
        ctx.shadowColor = "white";
        ctx.fill();
      });

      // Spawn Shooting Stars
      if (Math.random() < 0.02) { // 2% chance per frame
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height / 2), // Start from top half
          length: Math.random() * 80 + 20,
          speed: Math.random() * 10 + 5,
          opacity: 1,
          angle: Math.PI / 4, // 45 degrees
        });
      }

      // Update and Draw Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];

        // Move
        star.x += star.speed * Math.cos(star.angle);
        star.y += star.speed * Math.sin(star.angle);
        
        // Fade out
        star.opacity -= 0.02;

        if (star.opacity <= 0 || star.x > width || star.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Draw Trail
        const endX = star.x - star.length * Math.cos(star.angle);
        const endY = star.y - star.length * Math.sin(star.angle);

        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw Head
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0B0C10] text-gray-100 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default StarryBackground;
