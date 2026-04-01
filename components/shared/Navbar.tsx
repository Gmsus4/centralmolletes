"use client"

import { navItems } from "@/data/navItems"
import { IconMenu2, IconX, IconPhoneCall, IconHome } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface NavbarProps {
  phone?: string | null;
  whatsapp?: string | null;
}

export const revalidate = 3600 

export const Navbar = ({phone, whatsapp}: NavbarProps) => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const phoneCall = phone!.replace(/[^0-9]/g, '') ?? ""

  const isActive = (href: string) => pathname === href
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className={`
          fixed top-0 left-0 right-0 z-[1000]
          transition-all duration-500 ease-out
          ${scrolled ? "lg:pt-0" : "lg:pt-3"}
        `}
      >
        <div className="max-w-7xl mx-auto sm:px-6 w-full flex items-center justify-center">

          {/* ── DESKTOP NAV ── */}
          <div
            className={`
              hidden lg:flex items-center
              bg-brand-primary
              rounded-full px-2 h-[52px] gap-1
              transition-all duration-500
              ${scrolled
                ? "shadow-[0_4px_32px_rgba(0,0,0,0.25)] scale-[0.98]"
                : "shadow-[0_2px_16px_rgba(0,0,0,0.12)]"
              }
            `}
          >
            {/* All nav items */}
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-4 h-9 flex items-center
                    text-[11px] font-bold uppercase tracking-[0.12em]
                    rounded-full transition-all duration-200
                    ${active
                      ? "bg-brand-contrast text-brand-primary"
                      : "text-brand-contrast hover:bg-brand-contrast/15 hover:text-brand-contrast"
                    }
                  `}
                >
                  {item.title}
                </Link>
              )
            })}

            {/* Separator */}
            <span className="w-px h-5 bg-brand-contrast/20 mx-1" />

            {/* Home — último a la derecha */}
            <Link
              href="/"
              className={`
                w-9 h-9 flex items-center justify-center rounded-full
                transition-colors duration-200
                ${isHome
                  ? "bg-brand-contrast/20 text-brand-contrast"
                  : "text-brand-contrast/70 hover:bg-brand-contrast/15 hover:text-brand-contrast"
                }
              `}
              title="Inicio"
            >
              { }
              <IconHome size={16} />
            </Link>
          </div>

          {/* ── MOBILE NAV ── */}
          <div
            className={`
              lg:hidden flex items-center flex-1
              bg-brand-primary
              px-2 h-[48px]
            `}
          >
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-brand-contrast hover:bg-brand-contrast/15 transition-colors duration-200 cursor-pointer flex-shrink-0"
              aria-label="Abrir menú"
            >
              <IconMenu2 size={20} />
            </button>

            {/* Spacer */}
            <span className="flex-1" />

            {/* Home — siempre visible a la derecha */}
            <Link
              href="/"
              className={`
                w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0
                transition-colors duration-200
                ${isHome
                  ? "bg-brand-contrast/20 text-brand-contrast"
                  : "text-brand-contrast/70 hover:bg-brand-contrast/15 hover:text-brand-contrast"
                }
              `}
              title="Inicio"
            >
              <IconHome size={18} />
            </Link>
          </div>

        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`
          lg:hidden fixed inset-0 z-[1001] bg-bg-dark/70
          transition-opacity duration-300
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`
          lg:hidden fixed top-0 left-0 bottom-0 z-[1002]
          w-72 bg-bg-dark
          flex flex-col overflow-hidden
          transition-transform duration-300 ease-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* ── Header con identidad ── */}
        <div className="relative flex items-center justify-between px-6 pt-8 pb-7 overflow-hidden">
          {/* Anillos decorativos (igual que el Hero) */}
          <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full border border-brand-primary/8 pointer-events-none" />
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full border border-brand-primary/[0.05] pointer-events-none" />

          <div className="relative flex flex-col gap-1">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="w-5 h-px bg-brand-primary/40" />
              <span className="text-[9px] uppercase tracking-[0.3em] text-brand-primary/50">Cafetería</span>
            </div>
            {/* Title */}
            <span
              className="font-title text-brand-primary leading-none"
              style={{
                fontSize: "1.6rem",
                textShadow: "2px 3px 0 rgba(0,0,0,0.5)",
                letterSpacing: "0.04em",
              }}
            >
              Central<br />molletes
            </span>
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            className="relative w-8 h-8 flex items-center justify-center text-brand-primary/40 hover:text-brand-primary border border-brand-primary/15 hover:border-brand-primary/40 rounded-full transition-all duration-200 cursor-pointer self-start mt-1"
            aria-label="Cerrar menú"
          >
            <IconX size={15} />
          </button>
        </div>

        {/* Separador con punto central */}
        <div className="flex items-center gap-2 px-6 mb-2">
          <span className="flex-1 h-px bg-brand-primary/10" />
          <span className="w-1 h-1 rounded-full bg-brand-primary/20" />
          <span className="flex-1 h-px bg-brand-primary/10" />
        </div>

        {/* ── Nav links ── */}
        <nav className="flex-1 flex flex-col px-4 pt-3 gap-0.5">
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`
                  group relative flex items-center gap-4 px-4 py-3.5
                  transition-all duration-150 rounded-radius overflow-hidden
                  ${active
                    ? "bg-brand-primary/10"
                    : "hover:bg-brand-primary/[0.06]"
                  }
                `}
              >
                {/* Línea activa izquierda */}
                <span className={`
                  absolute left-0 top-2 bottom-2 w-[2px] rounded-full
                  transition-all duration-200
                  ${active ? "bg-brand-primary" : "bg-transparent group-hover:bg-brand-primary/30"}
                `} />

                {/* Número de orden */}
                <span className={`
                  text-[10px] font-mono w-4 text-right flex-shrink-0
                  transition-colors duration-150
                  ${active ? "text-brand-primary/60" : "text-brand-primary/20 group-hover:text-brand-primary/40"}
                `}>
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Título */}
                <span className={`
                  flex-1 text-[13px] font-bold uppercase tracking-[0.1em]
                  transition-colors duration-150
                  ${active ? "text-brand-primary" : "text-brand-primary/50 group-hover:text-brand-primary/80"}
                `}>
                  {item.title}
                </span>

                {/* Ícono */}
                <Icon
                  width={18} height={18}
                  className={`flex-shrink-0 transition-colors duration-150
                    ${active ? "text-brand-primary" : "text-brand-primary/20 group-hover:text-brand-primary/50"}
                  `}
                />
              </Link>
            )
          })}
        </nav>

        {/* ── CTA ── */}
        <div className="px-4 pb-12 pt-5">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="flex-1 h-px bg-brand-primary/10" />
            <span className="text-[8px] uppercase tracking-[0.25em] text-brand-primary/25">contacto</span>
            <span className="flex-1 h-px bg-brand-primary/10" />
          </div>
          <Link
            href={`tel:${phoneCall}`}
            onClick={() => setMenuOpen(false)}
            className="
              flex items-center justify-center gap-2.5
              w-full py-3.5 rounded-radius
              bg-brand-primary text-brand-contrast
              text-[10px] font-bold uppercase tracking-[0.2em]
              hover:opacity-90 active:scale-[0.98] active:opacity-75
              transition-all duration-150
            "
          >
            <IconPhoneCall size={15} />
            <p className="text-text-main">
              { phone } 
            </p>
          </Link>
        </div>

      </div>
    </>
  )
}