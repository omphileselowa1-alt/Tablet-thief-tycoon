
import React, { useRef, useEffect } from 'react';
import { PlayerState } from '../types';

interface GameCanvasProps {
  player: PlayerState;
  isStealing: boolean;
  eventActive: boolean;
  activeEventName: string | null;
  isMoving: boolean;
  chaosMode: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ player, isStealing, eventActive, activeEventName, isMoving, chaosMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const walkAnimRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = () => {
      if (!canvas || !ctx) return;

      // --- BLACKOUT EVENT LOGIC ---
      const isBlackout = activeEventName === "Blackout";
      
      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isBlackout) {
          gradient.addColorStop(0, '#000000');
          gradient.addColorStop(1, '#020617');
      } else {
          gradient.addColorStop(0, '#0f172a');
          gradient.addColorStop(1, '#1e1b4b');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Simple Top-Down/Pseudo-3D Projection
      const project = (x: number, y: number) => {
        const screenX = centerX + (x - player.x);
        const screenY = centerY + (y - player.y);
        return { x: screenX, y: screenY };
      };

      // Draw Red Carpet
      const carpetWidth = 200;
      const carpetLength = 10000;
      const carpetX = -100;
      const carpetY = -5000; // Long strip

      const p1 = project(carpetX, carpetY);
      
      ctx.fillStyle = isBlackout ? '#450a0a' : '#991b1b';
      // Draw a long rectangle relative to player
      ctx.fillRect(p1.x, p1.y, carpetWidth, carpetLength);

      // Carpet Borders (Gold)
      ctx.lineWidth = 4;
      ctx.strokeStyle = isBlackout ? '#78350f' : '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p1.x, p1.y + carpetLength);
      ctx.moveTo(p1.x + carpetWidth, p1.y);
      ctx.lineTo(p1.x + carpetWidth, p1.y + carpetLength);
      ctx.stroke();

      // --- EVENT VISUALS (FLOOR) ---
      if (activeEventName === "Headless Event") {
          // Draw Pumpkin Patch on carpet near current location relative to scroll
          // We anchor it to the world, e.g., at (0, 200)
          const pumpkinPos = project(0, 200);
          ctx.font = "100px Arial";
          ctx.textAlign = "center";
          ctx.fillText("🎃", pumpkinPos.x, pumpkinPos.y);
          ctx.fillText("🐎", pumpkinPos.x + 50, pumpkinPos.y - 20);
      }
      if (activeEventName === "Strawberry Event") {
          const berryPos = project(0, 200);
          ctx.font = "120px Arial";
          ctx.textAlign = "center";
          ctx.fillText("🐘", berryPos.x, berryPos.y);
          ctx.font = "40px Arial";
          ctx.fillText("🍓", berryPos.x - 20, berryPos.y + 20);
      }

      // --- DRAW PLAYER ---
      if (isMoving) walkAnimRef.current += 0.2;
      else walkAnimRef.current = 0;
      
      // Simple bounce effect
      const bounce = Math.abs(Math.sin(walkAnimRef.current)) * 5;
      
      // Player is always centered on screen
      const px = centerX;
      const py = centerY - bounce;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 25, 15, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      const w = 30; 
      const h = 50; 
      ctx.fillStyle = player.color || '#3b82f6'; 
      ctx.fillRect(px - w/2, py - h/2, w, h);
      
      // Head
      ctx.fillStyle = '#fca5a5'; // Skin tone
      ctx.beginPath(); 
      ctx.arc(px, py - h/2 - 5, 12, 0, Math.PI * 2); 
      ctx.fill();
      
      // Name
      ctx.fillStyle = "white"; 
      ctx.font = "bold 14px monospace"; 
      ctx.textAlign = "center";
      ctx.fillText(player.name || "Thief", px, py - h/2 - 25);
      
      animationFrameId.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [player, eventActive, isMoving, chaosMode, activeEventName]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default GameCanvas;
