"use client";

import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface StationCardProps {
  station: {
    id: string;
    name: string;
    description: string;
    url: string;
    color: string;
  };
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
}

export default function StationCard({
  station,
  isActive,
  isPlaying,
  onClick,
}: StationCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true when component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Skip effect execution during SSR
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Get base color from station
    let baseColor = "#ffb380"; // default
    switch (station.color) {
      case "bg-amber-500":
        baseColor = "#f59e0b";
        break;
      case "bg-purple-500":
        baseColor = "#a855f7";
        break;
      case "bg-blue-500":
        baseColor = "#3b82f6";
        break;
      case "bg-indigo-500":
        baseColor = "#6366f1";
        break;
      case "bg-emerald-500":
        baseColor = "#10b981";
        break;
      case "bg-rose-500":
        baseColor = "#f43f5e";
        break;
    }

    // Create effect based on station id
    let animationId: number;

    const drawChillhopEffect = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sound waves
      const time = Date.now() * 0.001;
      const waveCount = 3;
      const waveHeight = 5;

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            Math.sin(x * 0.01 + time + i) * waveHeight + canvas.height / 2;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `${baseColor}${Math.floor(40 + i * 20).toString(16)}`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(drawChillhopEffect);
    };

    const drawLofiGirlEffect = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vinyl record circles
      const time = Date.now() * 0.0005;
      const centerX = canvas.width * 0.8;
      const centerY = canvas.height * 0.5;

      for (let i = 5; i > 0; i--) {
        const radius = 15 + i * 3;
        const rotation = time + i * 0.2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${baseColor}${Math.floor(30 + i * 15).toString(16)}`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw groove line
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          radius,
          rotation % (Math.PI * 2),
          (rotation + Math.PI) % (Math.PI * 2)
        );
        ctx.strokeStyle = `${baseColor}aa`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(drawLofiGirlEffect);
    };

    const drawJazzVibesEffect = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw jazz notes pattern
      const time = Date.now() * 0.001;
      const noteCount = 8;

      for (let i = 0; i < noteCount; i++) {
        const x = (Math.sin(time + i) * 0.3 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.7 + i) * 0.3 + 0.5) * canvas.height;
        const size = 3 + Math.sin(time + i) * 1;

        // Draw note
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}${Math.floor(
          50 + Math.sin(time + i) * 30
        ).toString(16)}`;
        ctx.fill();

        // Draw stem for some notes
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y - 10 - Math.sin(time + i) * 3);
          ctx.strokeStyle = `${baseColor}aa`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(drawJazzVibesEffect);
    };

    const drawSleepEffect = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars/particles
      const time = Date.now() * 0.0005;
      const starCount = 15;

      for (let i = 0; i < starCount; i++) {
        const x = (Math.sin(time * 0.5 + i * 0.7) * 0.4 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.3 + i) * 0.4 + 0.5) * canvas.height;
        const size = 1 + Math.sin(time + i) * 0.5;
        const opacity = 0.3 + Math.sin(time * 0.5 + i) * 0.2;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();
      }

      // Draw moon
      ctx.beginPath();
      ctx.arc(canvas.width * 0.8, canvas.height * 0.3, 8, 0, Math.PI * 2);
      ctx.fillStyle = `${baseColor}80`;
      ctx.fill();

      animationId = requestAnimationFrame(drawSleepEffect);
    };

    const drawNatureEffect = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw leaf-like patterns
      const time = Date.now() * 0.001;
      const leafCount = 6;

      for (let i = 0; i < leafCount; i++) {
        const x = (Math.sin(time * 0.3 + i * 0.5) * 0.4 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.2 + i * 0.7) * 0.4 + 0.5) * canvas.height;
        const size = 5 + Math.sin(time + i) * 2;

        ctx.beginPath();
        ctx.ellipse(
          x,
          y,
          size,
          size * 2,
          Math.PI * 0.25 * Math.sin(time * 0.5 + i),
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `${baseColor}${Math.floor(
          40 + Math.sin(time + i) * 20
        ).toString(16)}`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(drawNatureEffect);
    };

    const drawFocusEffect = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw concentric circles
      const time = Date.now() * 0.001;
      const circleCount = 4;

      for (let i = 0; i < circleCount; i++) {
        const radius = 10 + i * 8 + Math.sin(time + i) * 3;

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${baseColor}${Math.floor(30 + i * 15).toString(16)}`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw pulsing dot in center
      const pulseSize = 3 + Math.sin(time * 2) * 1;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = `${baseColor}`;
      ctx.fill();

      animationId = requestAnimationFrame(drawFocusEffect);
    };

    // Determine which effect to use based on station id
    let drawEffect: () => void;

    switch (station.id) {
      case "chillhop":
        drawEffect = drawChillhopEffect;
        break;
      case "lofi-girl":
        drawEffect = drawLofiGirlEffect;
        break;
      case "jazz-vibes":
        drawEffect = drawJazzVibesEffect;
        break;
      case "sleep":
        drawEffect = drawSleepEffect;
        break;
      case "nature":
        drawEffect = drawNatureEffect;
        break;
      case "focus":
        drawEffect = drawFocusEffect;
        break;
      default:
        drawEffect = drawChillhopEffect;
    }

    // Start animation
    drawEffect();

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        cancelAnimationFrame(animationId);
      }
    };
  }, [station.id, station.color, isActive, isPlaying, isMounted]);

  return (
    <div
      className={cn(
        "relative group cursor-pointer rounded-lg p-4 transition-all duration-300 overflow-hidden",
        isActive
          ? "bg-black/40 border-2 border-white/20 shadow-lg"
          : "bg-black/30 border border-white/10 hover:bg-black/40"
      )}
      onClick={onClick}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      />

      <div
        className={cn(
          "absolute top-0 left-0 w-1 h-full rounded-l-lg transition-all",
          station.color,
          isActive ? "opacity-100" : "opacity-50 group-hover:opacity-75"
        )}
      />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center">
            <h3 className="text-white font-medium">{station.name}</h3>
            {isPlaying && isActive && (
              <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                Playing
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300">{station.description}</p>
        </div>

        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110",
            isActive && isPlaying
              ? "bg-green-500/30 hover:bg-green-500/40"
              : isActive
              ? "bg-white/20 hover:bg-white/30"
              : "bg-black/40 group-hover:bg-black/60 hover:bg-white/10"
          )}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent onClick
            onClick();
          }}
        >
          {isPlaying && isActive ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <Play className="h-5 w-5 text-white" />
          )}
        </div>
      </div>
    </div>
  );
}
