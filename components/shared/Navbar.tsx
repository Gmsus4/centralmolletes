"use client"

import { navItems } from "@/data/navItems"
import { IconMenu2, IconX, IconPhoneCall, IconHome } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface NavbarProps {
  phone?: string | null
  whatsapp?: string | null
}

export const revalidate = 3600

export const Navbar = ({ phone }: NavbarProps) => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const phoneCall = phone?.replace(/[^0-9]/g, "") ?? ""

  const isActive = (href: string) => pathname === href
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      <nav aria-label="Navegación principal" className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ease-out ${scrolled ? "lg:pt-2" : "lg:pt-4"}`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-3 sm:px-5 lg:px-6">
          <div
            className={`hidden lg:flex items-center gap-1 rounded-full border border-brand-primary/20 bg-brand-primary/95 backdrop-blur-md px-2.5 h-[56px] transition-all duration-500 ${
              scrolled ? "shadow-[0_10px_40px_rgba(0,0,0,0.18)]" : "shadow-[0_6px_24px_rgba(0,0,0,0.10)]"
            }`}
          >
            {navItems.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex h-10 items-center rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-200 ${
                    active ? "bg-brand-contrast text-brand-primary shadow-[0_2px_10px_rgba(0,0,0,0.08)]" : "text-brand-contrast/85 hover:bg-brand-contrast/12 hover:text-brand-contrast"
                  }`}
                >
                  {item.title}
                </Link>
              )
            })}

            <span className="mx-1 h-5 w-px bg-brand-contrast/15" />

            <Link
              href="/"
              title="Inicio"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                isHome ? "bg-brand-contrast/18 text-brand-contrast" : "text-brand-contrast/70 hover:bg-brand-contrast/12 hover:text-brand-contrast"
              }`}
            >
              <IconHome size={17} />
            </Link>
          </div>

          <div className="flex h-[52px] w-full items-center rounded-b-[20px] border-x border-b border-brand-primary/15 bg-brand-primary/95 px-2.5 backdrop-blur-md lg:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-brand-contrast transition-colors duration-200 hover:bg-brand-contrast/12"
              aria-label="Abrir menú"
            >
              <IconMenu2 size={20} />
            </button>

            <div className="flex-1 text-center">
              <span className="font-title text-lg leading-none text-brand-contrast">Central Molletes</span>
            </div>

            <Link
              href="/"
              title="Inicio"
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
                isHome ? "bg-brand-contrast/18 text-brand-contrast" : "text-brand-contrast/75 hover:bg-brand-contrast/12 hover:text-brand-contrast"
              }`}
            >
              <IconHome size={18} />
            </Link>
          </div>
        </div>
      </nav>

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[1001] bg-bg-dark/45 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-3 left-3 z-[1002] flex w-[calc(100vw-1.5rem)] max-w-[340px] flex-col overflow-hidden rounded-[2rem] border border-brand-primary/12 bg-brand-primary shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-[105%]"
        }`}
      >
        <div className="relative px-5 pt-6 pb-5">
          <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-brand-contrast/8 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-brand-contrast/6 blur-xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-contrast/55">Cafetería</span>
              <span className="font-title text-3xl leading-none text-brand-contrast">
                Central
                <br />
                Molletes
              </span>
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-contrast/10 text-brand-contrast/70 transition-all duration-200 hover:bg-brand-contrast/18 hover:text-brand-contrast"
              aria-label="Cerrar menú"
            >
              <IconX size={17} />
            </button>
          </div>
        </div>

        <div className="mx-5 h-px bg-brand-contrast/12" />

        <nav className="flex flex-1 flex-col gap-2 px-4 py-4">
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`group flex items-center gap-4 rounded-[1.25rem] px-4 py-3.5 transition-all duration-150 ${
                  active ? "bg-brand-contrast text-brand-primary" : "text-brand-contrast/78 hover:bg-brand-contrast/10 hover:text-brand-contrast"
                }`}
              >
                <span className={`w-5 shrink-0 text-[10px] font-mono ${active ? "text-brand-primary/55" : "text-brand-contrast/30 group-hover:text-brand-contrast/50"}`}>
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <span className="flex-1 text-[13px] font-bold uppercase tracking-[0.12em]">{item.title}</span>

                <Icon width={18} height={18} className={active ? "text-brand-primary" : "text-brand-contrast/35 group-hover:text-brand-contrast/65"} />
              </Link>
            )
          })}
        </nav>

        {phone && (
          <div className="px-4 pb-4 pt-1">
            <div className="rounded-[1.5rem] bg-brand-contrast/8 p-3">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-contrast/45">Contacto</p>

              <Link
                href={`tel:${phoneCall}`}
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2.5 rounded-[1.15rem] bg-brand-contrast px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-primary transition-all duration-150 hover:opacity-92 active:scale-[0.98]"
              >
                <IconPhoneCall size={15} />
                <span>{phone}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
