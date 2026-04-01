"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import LogoutButton from "./LogoutButton"
import {
  IconHome, 
  IconMapPin, 
  IconX, 
  IconMenu,
  IconTag,
  IconBowlChopsticks,
  IconAddressBook,
  IconCalendarWeek,
  IconPaint,
  IconSpeakerphone,
  IconDiscount2,
  IconArticle,
} from "@tabler/icons-react"

const menu = [
  { label: "Productos", href: "/admin/products", icon: IconBowlChopsticks },
  { label: "Categorías", href: "/admin/categories", icon: IconTag },
  { label: "Promociones",     href: "/admin/promotions",   icon: IconDiscount2 },
]

const informacion = [
  { label: "Ubicación", href: "/admin/locations", icon: IconMapPin },
  { label: "Horarios", href: "/admin/schedule", icon: IconCalendarWeek },
  { label: "Contacto", href: "/admin/contact", icon: IconAddressBook },
]

const contenido = [
  { label: "Blog",     href: "/admin/blog",   icon: IconArticle },
  { label: "Anuncios",     href: "/admin/announcements",   icon: IconSpeakerphone },
]

const ajustes = [
  { label: "Tema",     href: "/admin/theme",   icon: IconPaint },
]

const siteLinks = [
  // { label: "Inicio",         href: "/",         icon: IconHome },
  // { label: "Menú",           href: "/menu",      icon: IconMenu2 },
  // { label: "Ubicaciones",    href: "/locations", icon: IconMapPin },
  // { label: "Contacto",       href: "/contact",   icon: IconPhone },
  // { label: "Sobre nosotros", href: "/about",     icon: IconInfoCircle },
  // { label: "Términos",       href: "/terms",     icon: IconFileText },
  // { label: "Privacidad",     href: "/privacy",   icon: IconShield },
  { label: "Tema",     href: "/admin/theme",   icon: IconPaint },
  { label: "Promociones",     href: "/admin/promotions",   icon: IconDiscount2 },
  { label: "Anuncios",     href: "/admin/announcements",   icon: IconSpeakerphone },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-screen">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-stone-100 flex items-start justify-between">
        <Link href="/admin" onClick={onClose} className="flex flex-col gap-0.5">
          <span className="font-titleText text-stone-900 tracking-[0.15em] text-xl leading-none">
            Central
          </span>
          <span className="font-titleText text-stone-900 tracking-[0.15em] text-2xl leading-none">
            molletes
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 mt-1">
            Admin
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors mt-1 cursor-pointer">
            <IconX size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Tienda / Menú nav */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        <span className="text-[9px] uppercase tracking-[0.3em] text-darkWarm px-3 mb-1">Tienda / Menú</span>
        {menu.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors duration-150
              ${pathname === href
                ? "text-stone-900 bg-stone-100"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
          >
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mx-6 h-px bg-stone-100" />

      {/* Información links */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        <span className="text-[9px] uppercase tracking-[0.3em] text-darkWarm px-3 mb-1">Información</span>
        {informacion.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-darkWarm/80 hover:text-stone-700 hover:bg-stone-50 transition-colors duration-150"
          >
            <Icon size={14} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mx-6 h-px bg-stone-100" />

      {/* Contenido links */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        <span className="text-[9px] uppercase tracking-[0.3em] text-darkWarm px-3 mb-1">Contenido</span>
        {contenido.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-darkWarm/80 hover:text-stone-700 hover:bg-stone-50 transition-colors duration-150"
          >
            <Icon size={14} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      
      <div className="mx-6 h-px bg-stone-100" />

      {/* Ajustes links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        <span className="text-[9px] uppercase tracking-[0.3em] text-darkWarm px-3 mb-1">Ajustes</span>
        {ajustes.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-darkWarm/80 hover:text-stone-700 hover:bg-stone-50 transition-colors duration-150"
          >
            <Icon size={14} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>
      

      {/* Logout */}
      <div className="px-6 py-5 border-t border-stone-100">
        <LogoutButton />
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Cierra el drawer al cambiar de ruta
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Bloquea el scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-stone-200 min-h-screen fixed top-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* ── MOBILE HEADER ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b border-stone-200 px-5 py-3.5 flex justify-between items-center bg-white">
        <button
          onClick={() => setOpen(true)}
          className="text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Abrir menú"
        >
          <IconMenu size={22} strokeWidth={1.5} />
        </button>

        <Link href="/admin" className="font-titleText text-stone-900 tracking-[0.15em] text-lg leading-none">
          Central <span className="text-stone-300">·</span> molletes
        </Link>

        <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400">Admin</span>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Panel */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent onClose={() => setOpen(false)} />
      </div>
    </>
  )
}