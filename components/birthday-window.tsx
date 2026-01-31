"use client"

import { useEffect, useRef } from "react"
import { Win98Window } from "@/components/win98-window"
import confetti from "canvas-confetti"
import { CakeIcon } from "@/components/desktop-icons"

// note: this component is not dinamic, desp se podria hacerlo para el resto de cumpleaños jajaja
interface BirthdayWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  zIndex: number
  isActive: boolean
  isMinimized: boolean
}

export function BirthdayWindow({
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  isActive,
  isMinimized,
}: BirthdayWindowProps) {
  const mounted = useRef(false)

  useEffect(() => {
    if (isOpen && !isMinimized && !mounted.current) {
        mounted.current = true
        const duration = 15 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }
    
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min
    
        const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now()
    
        if (timeLeft <= 0) {
            return clearInterval(interval)
        }
    
        const particleCount = 50 * (timeLeft / duration)
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
        }, 250)

        // Also fire a big burst immediately
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 9999,
        });
        
        return () => clearInterval(interval)
    }
  }, [isOpen, isMinimized])

  if (!isOpen) return null

  return (
    <Win98Window
      title="¡Feliz Cumpleaños!"
      icon={<CakeIcon />}
      defaultPosition={{ x: 300, y: 150 }}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      onFocus={onFocus}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="bg-white win98-inset p-4 flex flex-col items-center justify-center min-h-[250px] text-center gap-4">
        <h2 
            className="text-2xl font-bold text-[#ff00ff] animate-pulse" 
            style={{ fontFamily: "var(--font-pixel), 'Courier New', monospace" }}
        >
            ¡Feliz Cumpleaños Franco!
        </h2>
        <div className="text-6xl">🎂 🎉 🎈</div>
        <p 
            className="text-black text-lg"
            style={{ fontFamily: "var(--font-pixel), 'Courier New', monospace" }}
        >
            Franco es uno de los integrantes de SimpleDevs, 
            De parte de todo el equipo de SimpleDevs, <br/>
            ¡te deseamos un día increíble!
        </p>
        <button
          onClick={() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 9999,
            });
          }}
          className="px-4 py-2 bg-[#c0c0c0] win98-button active:win98-button-pressed text-black font-bold mt-2"
          style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}
        >
          ¡Festejar!
        </button>
      </div>
    </Win98Window>
  )
}
