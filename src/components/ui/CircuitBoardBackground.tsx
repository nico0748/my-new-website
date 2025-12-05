import React, { useEffect, useRef } from 'react';

interface CircuitBoardBackgroundProps {
  children: React.ReactNode;
}

const CircuitBoardBackground: React.FC<CircuitBoardBackgroundProps> = ({ children }) => {
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

    // --- Circuit Generation Logic ---
    // We want vertical lines that occasionally branch/turn at 45 degrees.
    // Grid system:
    const gridSize = 40; // Distance between potential vertical lines
    const cols = Math.ceil(width / gridSize);
    
    interface Point { x: number; y: number }
    interface Path {
      points: Point[];
      color: string;
      width: number;
    }

    const paths: Path[] = [];
    const colors = ['#2a3b55', '#1f4068', '#162447']; // Dark blue/purple tones for lines
    const highlightColors = ['#00ffcc', '#00aaff', '#64ffda', '#7df9ff']; // Cyan/Blue for particles

    // Generate paths
    const numPaths = Math.floor(width / 20); // Density
    
    for (let i = 0; i < numPaths; i++) {
      const startCol = Math.floor(Math.random() * cols);
      let x = startCol * gridSize;
      let y = -Math.random() * 500; // Start above screen
      
      const points: Point[] = [{ x, y }];
      let currentX = x;
      let currentY = y;

      while (currentY < height + 100) {
        // Determine segment length
        const segmentLength = Math.random() * 100 + 50;
        
        // 1. Go Vertical
        currentY += segmentLength;
        points.push({ x: currentX, y: currentY });

        // 2. Maybe turn 45 degrees
        if (Math.random() < 0.3) {
          const turnDirection = Math.random() > 0.5 ? 1 : -1; // Right or Left
          const turnSize = gridSize * Math.floor(Math.random() * 2 + 1); // 1 or 2 grid units
          
          const nextX = currentX + (turnSize * turnDirection);
          const nextY = currentY + turnSize; // 45 degrees means dx = dy

          currentX = nextX;
          currentY = nextY;
          points.push({ x: currentX, y: currentY });
        }
      }

      paths.push({
        points,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() > 0.8 ? 2 : 1,
      });
    }

    // --- Particles ---
    interface Particle {
      pathIndex: number;
      progress: number; // 0 to totalLength
      speed: number;
      length: number; // Length of the trail
      color: string;
    }

    const particles: Particle[] = [];
    const numParticles = 15; // Number of active particles

    // Helper to calculate total path length
    const getPathLength = (points: Point[]) => {
      let len = 0;
      for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i+1].x - points[i].x;
        const dy = points[i+1].y - points[i].y;
        len += Math.sqrt(dx*dx + dy*dy);
      }
      return len;
    };

    // Pre-calculate path lengths
    const pathLengths = paths.map(p => getPathLength(p.points));

    const spawnParticle = () => {
      const pathIndex = Math.floor(Math.random() * paths.length);
      particles.push({
        pathIndex,
        progress: 0,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 100 + 50, // Trail length
        color: highlightColors[Math.floor(Math.random() * highlightColors.length)],
      });
    };

    // Initial spawn
    for (let i = 0; i < numParticles; i++) {
      spawnParticle();
      // Randomize initial progress
      particles[i].progress = Math.random() * pathLengths[particles[i].pathIndex];
    }

    // --- Animation Loop ---
    let scrollY = window.scrollY;
    let animationFrameId: number;

    const render = () => {
      // Clear with trail effect for "glow" feel, or just solid clear
      // ctx.fillStyle = 'rgba(5, 5, 10, 0.2)'; // Subtle trail?
      // ctx.fillRect(0, 0, width, height);
      ctx.clearRect(0, 0, width, height); // Clear completely for crisp lines

      // Draw Background Lines
      paths.forEach(path => {
        ctx.beginPath();
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (path.points.length > 0) {
          ctx.moveTo(path.points[0].x, path.points[0].y);
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i].x, path.points[i].y);
          }
        }
        ctx.stroke();

        // Draw nodes at vertices
        ctx.fillStyle = path.color;
        path.points.forEach(p => {
          if (p.y > 0 && p.y < height) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, path.width * 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      // Update and Draw Particles
      const scrollSpeed = (window.scrollY - scrollY);
      scrollY = window.scrollY;

      // Manage particle count
      if (particles.length < numParticles) {
        if (Math.random() < 0.05) spawnParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const path = paths[p.pathIndex];
        const totalLen = pathLengths[p.pathIndex];

        // Move particle
        // Add scroll influence: scrolling down makes particles faster
        p.progress += p.speed + (scrollSpeed * 0.5);

        if (p.progress > totalLen + p.length) {
          particles.splice(i, 1);
          continue;
        }

        // Draw Particle Trail
        // We need to find the segment(s) corresponding to [progress - length, progress]
        
        const drawTrail = () => {
          let currentDist = 0;
          const headPos = p.progress;
          const tailPos = p.progress - p.length;

          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;

          let started = false;

          for (let j = 0; j < path.points.length - 1; j++) {
            const p1 = path.points[j];
            const p2 = path.points[j+1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const segLen = Math.sqrt(dx*dx + dy*dy);

            const segStart = currentDist;
            const segEnd = currentDist + segLen;

            // Check if this segment overlaps with the particle's position
            if (segEnd >= tailPos && segStart <= headPos) {
              // Calculate start and end points of the trail on this segment
              const startRatio = Math.max(0, (tailPos - segStart) / segLen);
              const endRatio = Math.min(1, (headPos - segStart) / segLen);

              const tx1 = p1.x + dx * startRatio;
              const ty1 = p1.y + dy * startRatio;
              const tx2 = p1.x + dx * endRatio;
              const ty2 = p1.y + dy * endRatio;

              if (!started) {
                ctx.moveTo(tx1, ty1);
                started = true;
              } else {
                ctx.lineTo(tx1, ty1);
              }
              ctx.lineTo(tx2, ty2);
            }

            currentDist += segLen;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
          
          // Draw head
          // (Simplified: finding exact head position again is redundant but cleaner to separate logic if needed)
          // For now, the trail end is the head.
        };
        
        drawTrail();
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
    <div ref={containerRef} className="relative min-h-screen bg-[#0a0a12] text-white overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 1 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CircuitBoardBackground;
