"use client"

import { useState, useEffect, useRef } from "react"

interface Win98TaskbarProps {
  openWindows?: Array<{
    id: string
    title: string
    icon: React.ReactNode
    isActive: boolean
    isMinimized: boolean
  }>
  onWindowClick?: (id: string) => void
  onShutdown?: () => void
}

export function Win98Taskbar({ openWindows = [], onWindowClick, onShutdown }: Win98TaskbarProps) {
  const [time, setTime] = useState<string>("")
  const [isStartOpen, setIsStartOpen] = useState(false)
  const taskbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (taskbarRef.current && !taskbarRef.current.contains(event.target as Node)) {
        setIsStartOpen(false)
      }
    }

    if (isStartOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isStartOpen])

  return (
    <div ref={taskbarRef} className="fixed bottom-0 left-0 right-0 h-8 bg-[#c0c0c0] win98-outset flex items-center justify-between px-1 z-[5000]">
      {isStartOpen && (
        <div className="absolute bottom-8 left-0 w-48 bg-[#c0c0c0] win98-outset flex flex-col p-1 gap-1 shadow-xl">
          <div className="flex bg-[#000080] p-1 mb-1">
            <span className="text-white font-bold text-lg -rotate-90 origin-bottom-left translate-y-full absolute bottom-2 left-1 hidden">Win98</span>
            <div className="w-6 bg-gradient-to-b from-[#000080] to-[#1084d0] absolute left-0 top-0 bottom-0 w-8 flex items-end justify-center pb-2">
              <span className="text-white font-bold -rotate-90 whitespace-nowrap text-lg tracking-widest origin-center translate-y-[-20px]">SimpleDevs</span>
            </div>
            <div className="ml-8 w-full flex flex-col gap-1">
              <button className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white group">
                <span className="text-xl">📂</span>
                <span className="text-sm">Proyectos</span>
              </button>
              <button className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white group">
                <span className="text-xl">📧</span>
                <span className="text-sm">Contacto</span>
              </button>
              <div className="h-[1px] bg-[#808080] border-b border-white my-1" />
              <button
                onClick={() => {
                  setIsStartOpen(false)
                  onShutdown?.()
                }}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white group"
              >
                <span className="text-xl">❌</span>
                <span className="text-sm">Apagar...</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsStartOpen(!isStartOpen)}
        className={`h-6 px-2 bg-[#c0c0c0] win98-button flex items-center gap-1 hover:bg-[#dfdfdf] active:win98-button-pressed ${isStartOpen ? 'win98-button-pressed font-bold' : ''}`}
        style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', Tahoma, sans-serif" }}
      >
        <span className="text-base">🪟</span>
        <span className="text-sm font-bold text-black">Inicio</span>
      </button>

      <div className="flex items-center gap-1 ml-2 border-r border-[#808080] pr-2 mr-2">

        <div className="h-6 border-l border-[#808080] border-r border-r-white mx-1" />
        <button className="w-6 h-6 bg-[#c0c0c0] win98-button flex items-center justify-center text-xs hover:bg-[#dfdfdf] active:win98-button-pressed" title="simpleDevs">
          💻
        </button>
      </div>

      <div className="flex-1 flex gap-1 overflow-x-auto win98-scrollbar-none px-1">
        {openWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => onWindowClick?.(window.id)}
            className={`
              h-6 px-2 min-w-[120px] max-w-[160px] flex items-center gap-2
              text-xs text-black whitespace-nowrap overflow-hidden
              ${window.isActive && !window.isMinimized
                ? "win98-button-pressed bg-[#e0e0e0] font-bold"
                : "bg-[#c0c0c0] win98-button hover:bg-[#dfdfdf]"}
            `}
            style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', Tahoma, sans-serif" }}
          >
            <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
              {window.icon}
            </span>
            <span className="truncate">{window.title}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 h-6 px-2 win98-inset bg-[#c0c0c0] ml-2">
        <span className="text-xs">🔊</span>
        <span
          className="text-xs text-black ml-1 whitespace-nowrap"
          style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', Tahoma, sans-serif" }}
        >
          {time}
        </span>
      </div>
    </div>
  )
}
