"use client"

import { IconSparkles, IconPhone, IconMapPin, IconMail } from "@tabler/icons-react"
import Link from "next/link"
import { SocialLinks } from "../ui/SocialLinks"
import { Button } from "../ui/button"
import { ButtonCustom } from "../ui/ButtonCustom"

// ── Tipos ──
type Shift = {
  id: string
  name: string | null
  openTime: string
  closeTime: string
}

type Schedule = {
  id: string
  dayOfWeek: string
  isActive: boolean
  shifts: Shift[]
}

const DAY_NUMBER: Record<string, number> = {
  DOMINGO: 0, LUNES: 1, MARTES: 2, MIERCOLES: 3,
  JUEVES: 4, VIERNES: 5, SABADO: 6,
}

const DAY_LABEL: Record<string, string> = {
  LUNES: "Lunes", MARTES: "Martes", MIERCOLES: "Miércoles",
  JUEVES: "Jueves", VIERNES: "Viernes", SABADO: "Sábado", DOMINGO: "Domingo",
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function to12h(time: string) {
  const [h, m] = time.split(":").map(Number)
  const suffix = h >= 12 ? "pm" : "am"
  const h12 = h % 12 || 12
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`
}

function getStatus(horarios: Schedule[]) {
  const now = new Date()
  const day = now.getDay()
  const current = now.getHours() * 60 + now.getMinutes()

  const today = horarios.find((h) => DAY_NUMBER[h.dayOfWeek] === day)
  if (!today || today.shifts.length === 0) return { isOpen: false, label: "Cerrado hoy" }

  const activeShift = today.shifts.find(
    (s) => current >= toMinutes(s.openTime) && current < toMinutes(s.closeTime)
  )
  if (activeShift) {
    return { isOpen: true, label: `Abierto · cierra a las ${to12h(activeShift.closeTime)}` }
  }

  const nextShift = today.shifts
    .filter((s) => toMinutes(s.openTime) > current)
    .sort((a, b) => toMinutes(a.openTime) - toMinutes(b.openTime))[0]

  return {
    isOpen: false,
    label: nextShift ? `Cerrado · abre a las ${to12h(nextShift.openTime)}` : "Cerrado por hoy",
  }
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  username: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  contactInfoId: string
}

interface Contact {
  id: string
  address: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  extraInfo: string | null
  schedule: any
  isOpenOverride: boolean | null
  updatedAt: Date
  socialLinks: SocialLink[]
}

// ── Componente ──
export const ContactPage = ({
  contact,
  horarios = [],
}: {
  contact: Contact | null
  horarios: Schedule[]
}) => {
  const phone = contact?.phone?.replace(/[^0-9]/g, '') ?? ""
  const status = getStatus(horarios)

  return (
    <div className="w-full bg-bg-body px-0 lg:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden lg:rounded-radius">

        {/* ── Lado izquierdo ── */}
        <div className="relative bg-brand-primary p-10 lg:p-12 flex flex-col justify-between gap-10 overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-radius bg-bg-body/5" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-radius bg-bg-body/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-radius bg-bg-body/[0.03]" />

          {/* Header */}
          <div className="relative z-10 flex flex-col gap-4">
            <IconSparkles size={28} className="text-text-main" />
            <h2 className="font-title text-5xl xl:text-6xl text-text-titles leading-tight">
              Ven a<br />visitarnos
            </h2>
            <p className="text-text-main text-sm leading-relaxed max-w-xs">
              Trabajamos cada día para ofrecerte productos de calidad, un ambiente agradable y la mejor atención posible.
            </p>
          </div>

          {/* Info de contacto — ocupa el espacio sobrante */}
          <div className="relative z-10 flex flex-col gap-5">

            {/* Dirección */}
            {contact?.address && (
              <div className="flex items-start gap-3">
                <IconMapPin size={15} className="text-text-main mt-0.5 shrink-0" />
                <span className="text-text-main text-sm leading-relaxed">{contact.address}</span>
              </div>
            )}

            <div className="h-px bg-bg-dark/25" />

            {/* Teléfono */}
            {contact?.phone && (
              <div className="flex items-center gap-3">
                <IconPhone size={15} className="text-text-main shrink-0" />
                <Link
                  href={`tel:${phone}`}
                  className="text-text-main hover:text-text-main/90 text-sm transition-colors"
                >
                  {contact.phone}
                </Link>
              </div>
            )}

            {/* Email */}
            {contact?.email && (
              <div className="flex items-center gap-3">
                <IconMail size={15} className="text-text-main shrink-0" />
                <Link
                  href={`mailto:${contact.email}`}
                  className="text-text-main hover:text-text-main/90 text-sm transition-colors"
                >
                  {contact.email}
                </Link>
              </div>
            )}

            {/* Info extra */}
            {contact?.extraInfo && (
              <p className="text-text-main text-xs leading-relaxed border-l-2 border-border-color/30 pl-3">
                {contact.extraInfo}
              </p>
            )}

            <div className="h-px bg-bg-dark/25" />

            {/* Redes sociales */}
            <div className="flex gap-2">
              <SocialLinks links={contact?.socialLinks ?? []} />
            </div>
          </div>
        </div>

        {/* ── Lado derecho ── */}
        <div className="bg-bg-dark p-10 lg:p-12 flex flex-col justify-between gap-8">

          {/* Header de horarios */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[.22em] text-brand-primary/50 font-bold mb-3">
                Horarios de atención
              </p>
              <h3 className="font-title text-4xl xl:text-5xl text-brand-primary leading-tight">
                ¿Cuándo<br />puedes venir?
              </h3>
            </div>

            {/* Badge dinámico */}
            <div
              className={`inline-flex items-center gap-2 rounded-roundedSize px-4 py-1.5 w-fit border text-xs font-semibold tracking-wide transition-colors ${
                status.isOpen
                  ? "bg-brand-primary/10 border-brand-primary/25 text-brand-primary"
                  : "bg-bg-body/5 border-bg-body/10 text-bg-body/50"
              }`}
            >
              <span
                className={`w-[6px] h-[6px] rounded-full ${
                  status.isOpen ? "bg-brand-primary animate-pulse" : "bg-bg-body/30"
                }`}
              />
              {status.label}
            </div>
          </div>

          {/* Tabla de horarios */}
          <div className="flex flex-col flex-1">
            {horarios.map((horario) => {
              const isToday = DAY_NUMBER[horario.dayOfWeek] === new Date().getDay()
              return (
                <div
                  key={horario.id}
                  className={`flex flex-col border-b border-brand-primary/10 py-3 text-sm transition-opacity ${
                    isToday ? "opacity-100" : "opacity-45"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1 h-1 rounded-full shrink-0 ${
                          isToday ? "bg-brand-primary" : "bg-transparent"
                        }`}
                      />
                      <span className="text-text-invert/60 text-sm">
                        {DAY_LABEL[horario.dayOfWeek]}
                      </span>
                    </div>

                    {horario.shifts.length === 0 ? (
                      <span className="text-text-invert/30 text-xs">Cerrado</span>
                    ) : horario.shifts.length === 1 ? (
                      <span className={`font-semibold text-sm ${isToday ? "text-brand-primary" : "text-text-invert/40"}`}>
                        {to12h(horario.shifts[0].openTime)} – {to12h(horario.shifts[0].closeTime)}
                      </span>
                    ) : (
                      <div className="flex flex-col items-end gap-0.5">
                        {horario.shifts.map((shift) => (
                          <span
                            key={shift.id}
                            className={`font-semibold text-xs ${isToday ? "text-brand-primary" : "text-text-invert/40"}`}
                          >
                            {shift.name && (
                              <span className="font-normal opacity-50 mr-1">{shift.name}</span>
                            )}
                            {to12h(shift.openTime)} – {to12h(shift.closeTime)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <ButtonCustom url={`tel:${phone}`} className="flex gap-2 items-center" isFilled={false}>
            <IconPhone />
            <p className="font-bold text-base">Llamar ahora</p>
          </ButtonCustom>
        </div>
      </div>
    </div>
  )
}