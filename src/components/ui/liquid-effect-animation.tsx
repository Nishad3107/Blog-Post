"use client"

import { useEffect, useRef } from "react"

export function LiquidEffectAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (document.getElementById("liquid-script")) return

    const script = document.createElement("script")
    script.type = "module"
    script.id = "liquid-script"

    script.textContent = `
import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';

const canvas = document.getElementById('liquid-canvas');

if (canvas) {
  const app = LiquidBackground(canvas)

  app.loadImage('/images/liquid-solid.png')

  app.liquidPlane.material.metalness = 0.75
  app.liquidPlane.material.roughness = 0.25
  app.liquidPlane.uniforms.displacementScale.value = 5

  app.setRain(false)

  window.__liquidApp = app
}
`

    document.body.appendChild(script)

    return () => {
      if (window.__liquidApp && window.__liquidApp.dispose) {
        window.__liquidApp.dispose()
      }

      const existing = document.getElementById("liquid-script")
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing)
      }
    }

  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-20">
      <canvas
        ref={canvasRef}
        id="liquid-canvas"
        className="fixed inset-0 w-full h-full opacity-35 mix-blend-soft-light"
      />
    </div>
  )
}

declare global {
  interface Window {
    __liquidApp?: any
  }
}
