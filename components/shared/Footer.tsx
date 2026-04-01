"use client"
import { navItems, otherLinks } from "@/data/navItems"
import Link from "next/link"
import { LogoBtn } from "../ui/LogoBtn"
import { SocialLinks } from "../ui/SocialLinks"

const currentYear = new Date().getFullYear()

interface CategoriesProps {
  categories: string[]
}

interface linksProps {
    id: string;
    order: number;
    url: string;
    createdAt: Date;
    platform: string;
    username: string | null;
    isActive: boolean;
    updatedAt: Date;
    contactInfoId: string;
}

interface Props {
  categories?: string[]
  links: linksProps[]
}

export const Footer = ({categories = [], links }: Props) => {
  return (
    <footer className="bg-brand-primary w-full pb-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-20 pt-12 pb-6">
        {/* Bloque superior: logo + tagline a ancho completo */}
        <div className="flex flex-col sm:flex-row  sm:items-center sm:justify-between gap-4 mb-10 pb-8 border-b border-border-color/20">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center rounded-radius">
              <LogoBtn />
            </div>
            <span className="text-text-main mt-1 font-bold text-xl tracking-tight">Central Molletes</span>
          </div>
          <p className="text-text-main text-sm max-w-xs sm:text-right leading-relaxed">
            Cafetería en Etzatlán desde 2020 <br className="hidden sm:block"/>Hecho con amor, entregado con dedicación.
          </p>
        </div>

        {/* Grid de columnas: se adapta por breakpoint */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {/* Col 1 — Inicio */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-text-titles/90 font-semibold">Inicio</h3>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                return (
                  <Link key={item.href} href={item.href} className="group flex items-center gap-2 text-sm text-text-main font-medium hover:text-text-main/90 transition-colors duration-150">
                    <span className="w-0 group-hover:w-2 h-px bg-text-main transition-all duration-200 rounded-radius" />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Col 2 — Categorías */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-text-titles/90 font-semibold">Especialidades</h3>
            <div className="flex flex-col gap-2">
              {
                categories.map((label) => (
                  <Link key={label} href={`/menu?category=${label}`} className="group flex items-center gap-2 text-sm text-text-main font-medium hover:text-text-main/90 transition-colors duration-150">
                    <span className="w-0 group-hover:w-2 h-px bg-bg-dark transition-all duration-200 rounded-radius" />
                    {label}
                  </Link>
                ))
              }
            </div>
          </div>

          {/* Col 3 — Empresa (visible solo sm+) */}
          <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-text-titles/90 font-semibold">Empresa</h3>
            <div className="flex flex-col gap-2">
              {
                otherLinks.map((link) => (
                <Link key={link.href} href={link.href} className="group flex items-center gap-2 text-sm text-text-main font-medium hover:text-text-main/90 transition-colors duration-150">
                  <span className="w-0 group-hover:w-2 h-px bg-text-main transition-all duration-200 rounded-radius" />
                  {link.title}
                </Link>
                ))
              }
            </div>
          </div>

          {/* Col 4 — Síguenos */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-text-main/90 font-semibold">Síguenos</h3>
            <SocialLinks links={links}/>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 pt-5 flex flex-col gap-2 text-[11px] text-text-main">
          <p className="font-title text-text-main font-bold text-center text-5xl xx:text-6xl md:text-8xl lg:text-[160px] xl:text-[180px] w-full leading-none whitespace-nowrap">
            Central molletes
          </p>
          <span className="text-center text-text-main">© {currentYear} TAGB Industries Ltd. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  )
}
