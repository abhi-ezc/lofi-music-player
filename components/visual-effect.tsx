"use client"

import { useEffect, useRef } from "react"

interface VisualEffectProps {
  mood: string
}

export default function VisualEffect({ mood }: VisualEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle settings based on mood
    let particleSettings = {
      count: 100,
      size: { min: 1, max: 3 },
      speed: { min: 0.2, max: 0.8 },
      opacity: { min: 0.3, max: 0.7 },
      color: "#ffffff",
    }

    switch (mood) {
      case "study":
        particleSettings = {
          count: 80,
          size: { min: 1, max: 3 },
          speed: { min: 0.1, max: 0.4 },
          opacity: { min: 0.2, max: 0.5 },
          color: "#ffb380",
        }
        break
      case "sleep":
        particleSettings = {
          count: 120,
          size: { min: 1, max: 4 },
          speed: { min: 0.05, max: 0.2 },
          opacity: { min: 0.1, max: 0.4 },
          color: "#a3b8ff",
        }
        break
      case "rain":
        particleSettings = {
          count: 200,
          size: { min: 1, max: 2 },
          speed: { min: 1, max: 3 },
          opacity: { min: 0.2, max: 0.6 },
          color: "#80d8ff",
        }
        break
      case "ocean":
        particleSettings = {
          count: 150,
          size: { min: 1, max: 3 },
          speed: { min: 0.1, max: 0.5 },
          opacity: { min: 0.2, max: 0.5 },
          color: "#80ffea",
        }
        break
    }

    // Create particles
    const particles: {
      x: number
      y: number
      size: number
      speed: number
      opacity: number
    }[] = []

    for (let i = 0; i < particleSettings.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (particleSettings.size.max - particleSettings.size.min) + particleSettings.size.min,
        speed: Math.random() * (particleSettings.speed.max - particleSettings.speed.min) + particleSettings.speed.min,
        opacity:
          Math.random() * (particleSettings.opacity.max - particleSettings.opacity.min) + particleSettings.opacity.min,
      })
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particleSettings.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Update position based on mood
        if (mood === "rain") {
          particle.y += particle.speed
          if (particle.y > canvas.height) {
            particle.y = 0
            particle.x = Math.random() * canvas.width
          }
        } else if (mood === "ocean") {
          particle.x += Math.sin(Date.now() * 0.001 + particle.y * 0.1) * 0.5
          particle.y += particle.speed
          if (particle.y > canvas.height) {
            particle.y = 0
            particle.x = Math.random() * canvas.width
          }
        } else {
          particle.y += particle.speed
          if (particle.y > canvas.height) {
            particle.y = 0
            particle.x = Math.random() * canvas.width
          }
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [mood])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}

