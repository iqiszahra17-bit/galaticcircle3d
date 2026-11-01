import React, { useEffect, useRef } from 'react';

export const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Star particles
    const starCount = Math.min(180, Math.floor((width * height) / 8500));
    const stars: { x: number; y: number; z: number; size: number; alpha: number; speed: number; colorType: number }[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * width,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.5 + 0.2,
        colorType: i % 10,
      });
    }

    const render = () => {
      // Background utama: #170D24
      ctx.fillStyle = '#170D24';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle glowing cosmic nebulae with Cosmic Plum & Magenta
      // Nebula 1: Ungu utama (#8D3CC7)
      const grad1 = ctx.createRadialGradient(width * 0.25, height * 0.25, 30, width * 0.25, height * 0.25, width * 0.55);
      grad1.addColorStop(0, 'rgba(141, 60, 199, 0.16)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Nebula 2: Magenta neon (#FF55C8)
      const grad2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 40, width * 0.8, height * 0.7, width * 0.5);
      grad2.addColorStop(0, 'rgba(255, 85, 200, 0.14)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Nebula 3: Background sekunder / Plum (#24102F) & Pink lembut (#FFB5E8)
      const grad3 = ctx.createRadialGradient(width * 0.5, height * 0.85, 20, width * 0.5, height * 0.85, width * 0.45);
      grad3.addColorStop(0, 'rgba(255, 181, 232, 0.07)');
      grad3.addColorStop(1, 'transparent');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Render 3D drift stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= star.speed;

        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 1.5;
          star.y = (Math.random() - 0.5) * height * 1.5;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthAlpha = Math.min(1, Math.max(0.12, (1 - star.z / width) * star.alpha));
          const currentSize = Math.max(0.5, star.size * k);

          ctx.beginPath();
          ctx.arc(px, py, currentSize, 0, Math.PI * 2);

          // Star colors: Gold #FFD76A, Magenta #FF55C8, Pink #FFB5E8, White #FFF5FF
          if (star.colorType === 0 || star.colorType === 5) {
            ctx.fillStyle = `rgba(255, 215, 106, ${depthAlpha})`; // Emas
          } else if (star.colorType === 1 || star.colorType === 6) {
            ctx.fillStyle = `rgba(255, 85, 200, ${depthAlpha})`; // Magenta neon
          } else if (star.colorType === 2) {
            ctx.fillStyle = `rgba(255, 181, 232, ${depthAlpha})`; // Pink lembut
          } else {
            ctx.fillStyle = `rgba(255, 245, 255, ${depthAlpha})`; // Teks utama putih cosmic
          }

          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-space-deep">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle tech scanline texture with Cosmic Plum/Magenta tint */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 85, 200, 0.4) 1px, transparent 1px)',
          backgroundSize: '100% 4px',
        }} 
      />
    </div>
  );
};

