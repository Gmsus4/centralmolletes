export const dynamic = "force-dynamic"

import Link from "next/link"
import prisma from "@/lib/prisma"
import { IconPlus } from "@tabler/icons-react"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | Horarios",
}

const DAY_LABELS: Record<string, string> = {
  LUNES:     "Lunes",
  MARTES:    "Martes",
  MIERCOLES: "Miércoles",
  JUEVES:    "Jueves",
  VIERNES:   "Viernes",
  SABADO:    "Sábado",
  DOMINGO:   "Domingo",
}

export default async function ScheduleForm() {
  const horarios = await prisma.schedule.findMany({
    include: { shifts: true },
    orderBy: { dayOfWeek: "asc" },
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Suspense>
        <Toast message="Nuevo horario asignado con éxito" type="success" triggerParam="add"/>
        <Toast message="Horario gurdado con éxito" type="success" triggerParam="edit"/> 
        <Toast message="Día eliminado del horario" type="success" triggerParam="deleted"/>
        <Toast message="Hubo un error" type="error" triggerParam="error"/>
      </Suspense>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Admin</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
            Horarios
          </h1>
        </div>

        <Link
          href="/admin/schedule/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-5 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 transition-opacity"
        >
          <IconPlus size={14} />
          Nuevo horario
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      {/* Lista */}
      {horarios.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-400 text-sm tracking-wide">No hay horarios registrados.</p>
          <Link
            href="/admin/schedule/new"
            className="mt-4 inline-block text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900 pb-px transition-colors"
          >
            Agregar el primero
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-stone-100">
          {horarios.map((horario) => (
            <div
              key={horario.id}
              className="flex items-start justify-between gap-4 py-5"
            >
              {/* Día + estado */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-stone-900 text-sm">
                    {DAY_LABELS[horario.dayOfWeek] ?? horario.dayOfWeek}
                  </span>
                  {!horario.isActive && (
                    <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 border border-stone-200 px-1.5 py-0.5">
                      Inactivo
                    </span>
                  )}
                </div>

                {/* Turnos */}
                <div className="flex flex-col gap-0.5">
                  {horario.shifts.length === 0 ? (
                    <span className="text-xs text-stone-400">Sin turnos</span>
                  ) : (
                    horario.shifts.map((shift) => (
                      <span key={shift.id} className="text-xs text-stone-500">
                        {shift.name && (
                          <span className="text-stone-400 mr-1">{shift.name} —</span>
                        )}
                        {shift.openTime} a {shift.closeTime}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Acción editar */}
              <Link
                href={`/admin/schedule/${horario.id}`}
                className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-stone-400 hover:text-stone-900 border-b border-stone-200 hover:border-stone-900 pb-px transition-colors"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}