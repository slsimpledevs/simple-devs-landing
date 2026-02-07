"use client"

import { useState, useEffect } from "react"
import { Win98Window } from "@/components/win98-window"
import { Win98Taskbar } from "@/components/win98-taskbar"
import { DesktopIcon, FolderIcon, TextFileIcon, ComputerIcon, MailIcon, CodeIcon, CakeIcon } from "@/components/desktop-icons"
import { useIsMobile } from "@/hooks/use-mobile"
import { Win98Shutdown } from "@/components/win98-shutdown"
import { BirthdayWindow } from "@/components/birthday-window"
import confetti from "canvas-confetti"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isShuttingDown, setIsShuttingDown] = useState(false)
  const [isShutdown, setIsShutdown] = useState(false)
  const isMobile = useIsMobile()

  const initialWindows = {
    readme: { id: 'readme', title: 'Leeme.txt - Bloc de notas', isOpen: true, isMinimized: false, zIndex: 1, icon: <TextFileIcon /> },
    projects: { id: 'projects', title: 'A:\\Proyectos', isOpen: true, isMinimized: false, zIndex: 2, icon: <FolderIcon /> },
    connect: { id: 'connect', title: 'Contacto.exe - Outlook Express', isOpen: true, isMinimized: false, zIndex: 3, icon: <MailIcon /> },
    birthday: { id: 'birthday', title: '¡Feliz Cumpleaños!', isOpen: false, isMinimized: false, zIndex: 4, icon: <CakeIcon /> },
  }

  const [windows, setWindows] = useState<Record<string, typeof initialWindows.readme>>(initialWindows)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)

    // Check for birthday
    const today = new Date()
    // Month is 0-indexed (0 = January)
    if (today.getMonth() === 0 && today.getDate() === 31) {
      setWindows(prev => ({
        ...prev,
        birthday: { ...prev.birthday, isOpen: true }
      }))
      // Initial confetti burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999,
        });
      }, 1000)
    }

    return () => clearTimeout(timer)
  }, [])

  const bringToFront = (id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map(w => w.zIndex))
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: maxZ + 1, isMinimized: false }
      }
    })
  }

  const handleOpen = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false }
    }))
    bringToFront(id)
  }

  const handleClose = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }))
  }

  const handleMinimize = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }))
  }

  const handleTaskbarClick = (id: string) => {
    const win = windows[id]
    if (win.isMinimized || !win.isOpen) {
      handleOpen(id)
    } else {
      const currentMaxZ = Math.max(...Object.values(windows).filter(w => !w.isMinimized && w.isOpen).map(w => w.zIndex))
      if (win.zIndex === currentMaxZ) {
        handleMinimize(id)
      } else {
        bringToFront(id)
      }
    }
  }

  const projects = [
    {
      name: "InTheZone",
      description: "App de productividad & habit tracker",
      liveUrl: "https://in-the-zone-app.vercel.app/",
      repoUrl: "https://github.com/lautaro1910/InTheZone"
    },
    {
      name: "Guía Puntana",
      description: "Guía comercial de San Luis, encontrá proveedores de servicios y productos",
      liveUrl: "https://guia-puntana.vercel.app/",
      repoUrl: "https://github.com/SimpleDevsSL/guia-puntana"
    },
  ]

  const openWindowsList = Object.values(windows)
    .filter(w => w.isOpen)
    .sort((a, b) => a.zIndex - b.zIndex)
    .map(w => ({
      id: w.id,
      title: w.title,
      icon: w.icon,
      isActive: w.zIndex === Math.max(...Object.values(windows).filter(w => !w.isMinimized && w.isOpen).map(w => w.zIndex)),
      isMinimized: w.isMinimized
    }))


  const handleShutdown = () => {
    setIsShuttingDown(true)
    setTimeout(() => {
      setIsShutdown(true)
      setIsShuttingDown(false)
    }, 700)
  }

  if (isShutdown) {
    return <Win98Shutdown onRestart={() => setIsShutdown(false)} />
  }

  return (
    <div className={`
      min-h-screen bg-[#008080] relative overflow-hidden 
      ${isLoaded && !isShuttingDown ? "crt-turn-on" : ""} 
      ${isShuttingDown ? "crt-turn-off" : ""} 
      ${!isLoaded ? "opacity-0" : ""}
    `}>
      <div className="crt-overlay" />

      <main className="pb-10 min-h-screen">
        <div className={`
            ${isMobile
            ? "grid grid-cols-3 gap-4 p-4 pt-8 justify-items-center content-start z-0"
            : "absolute top-4 left-4 flex flex-col gap-2 z-0"}
          `}>
          <DesktopIcon
            icon={<ComputerIcon />}
            label="Mi PC"
            onClick={() => handleOpen("readme")}
          />
          <DesktopIcon
            icon={<FolderIcon />}
            label="Proyectos"
            onClick={() => handleOpen("projects")}
          />
          <DesktopIcon
            icon={<MailIcon />}
            label="Contacto"
            onClick={() => handleOpen("connect")}
          />
          <DesktopIcon
            icon={<TextFileIcon />}
            label="Leeme.txt"
            onClick={() => handleOpen("readme")}
          />
        </div>

        <div className="contents">
          {windows.readme.isOpen && (
            <Win98Window
              title={windows.readme.title}
              icon={windows.readme.icon}
              defaultPosition={{ x: 150, y: 40 }}
              zIndex={windows.readme.zIndex}
              isActive={windows.readme.zIndex === Math.max(...Object.values(windows).filter(w => !w.isMinimized && w.isOpen).map(w => w.zIndex))}
              isMinimized={windows.readme.isMinimized}
              onFocus={() => bringToFront('readme')}
              onClose={() => handleClose('readme')}
              onMinimize={() => handleMinimize('readme')}
            >
              <div className="bg-white win98-inset p-2 min-h-[200px]" style={{ fontFamily: "var(--font-pixel), 'Courier New', monospace" }}>
                <pre className="text-sm text-black whitespace-pre-wrap leading-relaxed">
                  {`========================================
          SIMPLEDEVS v1.0
  ========================================

  ¡Bienvenido a simpleDevs!

  Somos un grupo de estudiantes de la
  Universidad Nacional de San Luis
  dedicados a crear software útil 
  para la comunidad.

  Nuestra Misión:
  ----------------------------
  Nuestra misión es desarrollar y 
  distribuir soluciones de código 
  abierto accesibles para todos. 
  
  Creemos en la tecnología como un 
  bien común, por lo que entregamos 
  nuestro trabajo completamente 
  gratis y sin esperar nada a cambio, 
  con el único objetivo de aportar 
  valor real y beneficio a la 
  comunidad.

  [Presione cualquier tecla...]`}
                </pre>
              </div>
            </Win98Window>
          )}

          {windows.projects.isOpen && (
            <Win98Window
              title={windows.projects.title}
              icon={windows.projects.icon}
              defaultPosition={{ x: 560, y: 40 }}
              zIndex={windows.projects.zIndex}
              isActive={windows.projects.zIndex === Math.max(...Object.values(windows).filter(w => !w.isMinimized && w.isOpen).map(w => w.zIndex))}
              isMinimized={windows.projects.isMinimized}
              onFocus={() => bringToFront('projects')}
              onClose={() => handleClose('projects')}
              onMinimize={() => handleMinimize('projects')}
            >
              <div className="bg-white win98-inset p-1 min-h-[180px]">
                <div className="flex gap-1 p-1 border-b border-[#808080] mb-2">
                  <button className="px-2 py-0.5 text-xs bg-[#c0c0c0] win98-button text-black" style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}>
                    Archivo
                  </button>
                  <button className="px-2 py-0.5 text-xs bg-[#c0c0c0] win98-button text-black" style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}>
                    Edición
                  </button>
                  <button className="px-2 py-0.5 text-xs bg-[#c0c0c0] win98-button text-black" style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}>
                    Ver
                  </button>
                </div>

                <div className="space-y-1">
                  {projects.map((project, index) => (
                    <div
                      key={project.name}
                      className={`flex items-start gap-2 p-1 hover:bg-[#000080] hover:text-white group ${index === 0 ? "bg-[#000080] text-white" : "text-black"}`}
                      style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}
                    >
                      <CodeIcon />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${index === 0 ? "text-white" : "text-black group-hover:text-white"}`}>
                          {project.name}
                        </div>
                        <div className={`text-xs truncate ${index === 0 ? "text-[#c0c0c0]" : "text-[#808080] group-hover:text-[#c0c0c0]"}`}>
                          {project.description}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs px-1 border border-current hover:bg-white hover:text-black ${index === 0 ? "text-white" : "text-black group-hover:text-white"}`}
                          >
                            Demo
                          </a>
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs px-1 border border-current hover:bg-white hover:text-black ${index === 0 ? "text-white" : "text-black group-hover:text-white"}`}
                          >
                            Código
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-1 border-t border-[#808080] text-xs text-[#808080]" style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}>
                  {projects.length} objeto(s) | 2.4 KB
                </div>
              </div>
            </Win98Window>
          )}

          {windows.connect.isOpen && (
            <Win98Window
              title={windows.connect.title}
              icon={windows.connect.icon}
              defaultPosition={{ x: 970, y: 40 }}
              zIndex={windows.connect.zIndex}
              isActive={windows.connect.zIndex === Math.max(...Object.values(windows).filter(w => !w.isMinimized && w.isOpen).map(w => w.zIndex))}
              isMinimized={windows.connect.isMinimized}
              onFocus={() => bringToFront('connect')}
              onClose={() => handleClose('connect')}
              onMinimize={() => handleMinimize('connect')}
            >
              <div className="bg-[#c0c0c0] p-2 min-h-[150px]">
                <div className="bg-white win98-inset p-2 mb-3">
                  <div className="text-sm text-black" style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}>
                    <span className="font-bold">Para:</span> Usted
                  </div>
                  <div className="text-sm text-black" style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}>
                    <span className="font-bold">De:</span> Equipo simpleDevs
                  </div>
                  <div className="text-sm text-black" style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}>
                    <span className="font-bold">Asunto:</span> {"¡Conectemos!"}
                  </div>
                </div>

                <div className="bg-white win98-inset p-2 mb-3">
                  <p className="text-sm text-black mb-3" style={{ fontFamily: "var(--font-pixel), 'Courier New', monospace" }}>
                    {"¡Nos encantaría saber de ti! Contáctanos a través de cualquiera de estos canales:"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href="mailto:simpledevs.sl@gmail.com"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#c0c0c0] win98-button hover:bg-[#dfdfdf] active:win98-button-pressed"
                    style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}
                  >
                    <span>📧</span>
                    <span className="text-sm text-black">Email</span>
                  </a>
                  <a
                    href="https://www.instagram.com/simpledevs_sl?igsh=MXUwanducGY2dGxlcQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#c0c0c0] win98-button hover:bg-[#dfdfdf] active:win98-button-pressed"
                    style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}
                  >
                    <span>📷</span>
                    <span className="text-sm text-black">Instagram</span>
                  </a>
                  <a
                    href="https://github.com/SimpleDevsSL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#c0c0c0] win98-button hover:bg-[#dfdfdf] active:win98-button-pressed"
                    style={{ fontFamily: "var(--font-pixel), 'MS Sans Serif', sans-serif" }}
                  >
                    <span>💻</span>
                    <span className="text-sm text-black">GitHub</span>
                  </a>
                </div>
              </div>
            </Win98Window>
          )}

          {windows.birthday.isOpen && (
            <BirthdayWindow
              isOpen={windows.birthday.isOpen}
              zIndex={windows.birthday.zIndex}
              isActive={windows.birthday.zIndex === Math.max(...Object.values(windows).filter(w => !w.isMinimized && w.isOpen).map(w => w.zIndex))}
              isMinimized={windows.birthday.isMinimized}
              onFocus={() => bringToFront('birthday')}
              onClose={() => handleClose('birthday')}
              onMinimize={() => handleMinimize('birthday')}
            />
          )}
        </div>
      </main>

      <Win98Taskbar
        openWindows={openWindowsList}
        onWindowClick={handleTaskbarClick}
        onShutdown={handleShutdown}
      />
    </div>
  )
}
