"use client"
import { useRef } from "react"
import { terms } from "@/data/terms"
import { IconLock, IconShieldCheck, IconMail, IconArrowRight } from "@tabler/icons-react"
import { BannerFooter } from "../ui/BannerFooter"
import Link from "next/link"

export const TermsAndConditions = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const scrollTo = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="w-full bg-bg-body pt-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Contenido principal */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Header */}
            <div className="relative mb-4 p-10 rounded-3xl bg-brand-primary overflow-hidden">
              <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-bg-dark/5" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-bg-dark/5" />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-bg-dark rounded-full w-10 h-10 grid place-items-center shrink-0">
                    <IconLock size={18} className="text-primary" />
                  </div>
                  <span className="text-xs tracking-widest uppercase text-text-main/80 font-semibold">Última actualización: Febrero 2026</span>
                </div>
                <h1 className="font-titleText text-4xl sm:text-7xl text-text-titles leading-none">Términos y condiciones</h1>
                <p className="text-text-main/90 text-sm leading-relaxed max-w-xl">
                  Al realizar un pedido con nosotros, aceptas los siguientes términos. Te pedimos leerlos con atención para garantizar la mejor experiencia.
                </p>
              </div>
            </div>

            {/* Secciones */}
            <div className="flex flex-col gap-4">
              {terms.map((section, idx) => (
                <div
                  key={section.title}
                  ref={(el) => {
                    sectionRefs.current[idx] = el
                  }}
                  className="rounded-2xl border-1 border-border-color/10 bg-bg-body overflow-hidden scroll-mt-22"
                >
                  <div className="flex items-center gap-4 px-7 py-5 bg-brand-primary">
                    <div className="bg-bg-dark rounded-full w-8 h-8 grid place-items-center shrink-0">
                      <span className="font-title text-brand-primary text-sm font-bold leading-none">{idx + 1}</span>
                    </div>
                    <h2 className="font-title text-2xl sm:text-3xl text-text-titles">{section.title}</h2>
                  </div>
                  <ul className="flex flex-col divide-y divide-bg-dark/20 px-7">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 py-4 text-sm text-text-main leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-bg-dark shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Aside — solo desktop */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0 sticky top-24 self-start">
            {/* Índice de secciones */}
            <div className="rounded-2xl border-1 border-border-color/10 overflow-hidden">
              <div className="px-5 py-4 bg-brand-primary">
                <p className="text-xs tracking-widest uppercase text-text-main font-semibold">Contenido</p>
              </div>
              <nav className="flex flex-col divide-y divide-bg-dark/20 bg-bg-body/20">
                {terms.map((section, idx) => (
                  <button
                    key={section.title}
                    onClick={() => scrollTo(idx)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-bg-dark/10 transition-colors duration-200 group text-left cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-text-main w-4 shrink-0">{idx + 1}</span>
                    <span className="text-xs text-text-main group-hover:text-text-main/95 transition-colors leading-snug flex-1">{section.title}</span>
                    <IconArrowRight size={12} className="text-text-main/80 group-hover:text-text-main transition-colors shrink-0" />
                  </button>
                ))}
              </nav>
            </div>

            {/* Lo más importante */}
            <div className="rounded-2xl bg-brand-primary overflow-hidden p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <IconShieldCheck size={18} className="text-text-main" />
                <p className="text-xs tracking-widest uppercase text-text-main font-semibold">Lo más importante</p>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Anticipo requerido", value: "50%" },
                  { label: "Anticipación mínima", value: "48 hrs" },
                  { label: "Pedidos personalizados", value: "5 días" },
                  { label: "Reembolso -24hrs", value: "Sin reembolso" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-brand-primary-hover px-3 py-2.5">
                    <p className="text-[11px] text-text-main leading-none">{item.label}</p>
                    <p className="font-title text-text-main text-base leading-none font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA contacto */}
            <div className="rounded-2xl border-1 border-border-color/10 bg-bg-body p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <IconMail size={16} className="text-text-main" />
                <p className="text-xs tracking-widest uppercase text-text-main font-semibold">¿Tienes dudas?</p>
              </div>
              <p className="text-xs text-text-main leading-relaxed">Si deseas ejercer tus derechos o tienes preguntas sobre este aviso, escríbenos.</p>
              <Link href="/contact" className="w-full text-center rounded-xl bg-brand-contrast text-text-invert font-title text-lg py-1 hover:opacity-90 transition-opacity">
                Contáctanos
              </Link>
              <Link href="/privacy" className="w-full text-center rounded-xl border-1 border-border-color text-text-main font-title text-lg py-1 hover:bg-bg-dark/5 transition-colors">
                Aviso de Privacidad
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <BannerFooter />
        </div>
      </div>
    </div>
  )
}
