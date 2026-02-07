"use client"

import React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface Win98WindowProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  defaultPosition?: { x: number; y: number }
  zIndex?: number
  onFocus?: () => void
  onClose?: () => void
  onMinimize?: () => void
  isActive?: boolean
  isMinimized?: boolean
}

export function Win98Window({
  title,
  icon,
  children,
  defaultPosition = { x: 50, y: 50 },
  zIndex = 1,
  onFocus,
  onClose,
  onMinimize,
  isActive = false,
  isMinimized = false,
}: Win98WindowProps) {
  const [position, setPosition] = useState(defaultPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isDragging || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, isMobile])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return
    onFocus?.()
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  if (isMinimized) return null

  return (
    <div
      ref={windowRef}
      onMouseDown={onFocus}
      className={`
        win98-outset bg-[#c0c0c0] flex flex-col
        ${isMobile ? "fixed inset-0 bottom-8 m-0" : "absolute"}
      `}
      style={
        isMobile
          ? { zIndex: zIndex + 50 }
          : {
              left: position.x,
              top: position.y,
              zIndex: zIndex,
              minWidth: 300,
              maxWidth: "calc(100vw - 40px)",
            }
      }
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          flex items-center justify-between px-1 py-0.5 select-none
          ${isActive ? "win98-title-bar" : "bg-[#808080]"}
          ${!isMobile ? "cursor-move" : ""}
        `}
      >
        <div className="flex items-center gap-1">
          {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
          <span className="text-white text-sm font-bold tracking-wide" style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', Tahoma, sans-serif" }}>
            {title}
          </span>
        </div>
        <div className="flex gap-0.5">
          {/* Minimize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMinimize?.()
            }}
            className="w-4 h-4 bg-[#c0c0c0] win98-button flex items-center justify-center text-black text-xs leading-none hover:bg-[#dfdfdf] active:win98-button-pressed"
            aria-label="Minimize"
          >
            <span className="mb-1">_</span>
          </button>
          {/* Maximize Button */}
          <button
            className="w-4 h-4 bg-[#c0c0c0] win98-button flex items-center justify-center text-black text-xs leading-none hover:bg-[#dfdfdf] active:win98-button-pressed"
            aria-label="Maximize"
          >
            <span className="border border-black w-2 h-2" />
          </button>
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
            className="w-4 h-4 bg-[#c0c0c0] win98-button flex items-center justify-center text-black text-xs font-bold leading-none hover:bg-[#dfdfdf] active:win98-button-pressed"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-2 flex-1 overflow-auto win98-scrollbar">
        {children}
      </div>
    </div>
  )
}
