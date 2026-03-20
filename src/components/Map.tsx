import React, { useEffect, useRef } from 'react';
import { Nation, Village } from '../types';

interface MapProps {
  worldData: {
    nations: Nation[];
    villages: Village[];
  } | null;
  onHover: (text: string) => void;
}

const Map: React.FC<MapProps> = ({ worldData, onHover }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!worldData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const hexToRgb = (h: string) => {
      const n = parseInt(h.replace('#', ''), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const img = ctx.createImageData(W, H);
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        let md = Infinity;
        let nn = worldData.nations[0];
        for (const n of worldData.nations) {
          const d = (px - n.x * W) ** 2 + (py - n.y * H) ** 2;
          if (d < md) {
            md = d;
            nn = n;
          }
        }
        const [r, g, b] = hexToRgb(nn.color);
        const i = (py * W + px) * 4;
        img.data[i] = r;
        img.data[i + 1] = g;
        img.data[i + 2] = b;
        img.data[i + 3] = 200;
      }
    }
    ctx.putImageData(img, 0, 0);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const n of worldData.nations) {
      const nx = n.x * W;
      const ny = n.y * H;
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillText(n.name, nx + 1, ny + 1);
      ctx.fillStyle = '#fff';
      ctx.fillText(n.name, nx, ny);
    }

    for (const v of worldData.villages) {
      const vx = v.x * W;
      const vy = v.y * H;
      ctx.beginPath();
      if (v.isPlayer) {
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? 6 : 3;
          const a = (Math.PI / 5) * i - Math.PI / 2;
          if (i === 0) ctx.moveTo(vx + r * Math.cos(a), vy + r * Math.sin(a));
          else ctx.lineTo(vx + r * Math.cos(a), vy + r * Math.sin(a));
        }
        ctx.closePath();
        ctx.fillStyle = '#FFD700';
        ctx.fill();
      } else {
        ctx.arc(vx, vy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = v.isPlayer ? '#FFD700' : '#eee';
      ctx.fillText(v.name, vx + 4, vy);
    }
  }, [worldData]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!worldData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    for (const v of worldData.villages) {
      const dx = mx - v.x * canvas.width;
      const dy = my - v.y * canvas.height;
      if (Math.sqrt(dx * dx + dy * dy) < 8) {
        const n = worldData.nations.find(n => n.id === v.nationId);
        onHover(`${v.isPlayer ? '★' : '●'} ${v.name}（${n?.name ?? '—'}）— ${v.description}`);
        return;
      }
    }

    let md = Infinity;
    let nn = null;
    for (const n of worldData.nations) {
      const d = (mx - n.x * canvas.width) ** 2 + (my - n.y * canvas.height) ** 2;
      if (d < md) {
        md = d;
        nn = n;
      }
    }
    if (nn) {
      onHover(`${nn.name} — ${nn.description}`);
    } else {
      onHover('—');
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={270}
      height={190}
      className="w-full block rounded"
      onMouseMove={handleMouseMove}
    />
  );
};

export default Map;
