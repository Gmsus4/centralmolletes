export const dynamic = "force-dynamic"

import Link from "next/link"
import prisma from "@/lib/prisma"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Pencil } from "lucide-react"
import { EmptyState } from "@/components/ui/EmptyState"
import { IconCalendarWeek } from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Admin | Horarios",
}

const DAY_LABELS: Record<string, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
}

export default async function SchedulePage() {
  const horarios = await prisma.schedule.findMany({
    include: { shifts: true },
    orderBy: { dayOfWeek: "asc" },
  })

  return (
    <LayoutAdminSection namePage="Horarios" maxWidth="max-w-4xl" link={{ label: "Nuevo horario", href: "/admin/schedule/new" }}>
      <Suspense>
        <Toast message="Nuevo horario asignado con éxito" type="success" triggerParam="add" />
        <Toast message="Horario guardado con éxito" type="success" triggerParam="edit" />
        <Toast message="Día eliminado del horario" type="success" triggerParam="deleted" />
        <Toast message="Hubo un error" type="error" triggerParam="error" />
      </Suspense>

      {horarios.length === 0 ? (
        <EmptyState
          icon={IconCalendarWeek}
          label="Horarios sin definir"
          description="No has establecido tus horas de atención. Configura tu disponibilidad para que tus clientes sepan cuándo visitarte."
          actionLabel="Nuevo horario"
          actionHref="/admin/schedule/new"
          className="min-h-[420px]"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {horarios.map((horario) => (
            <Link
              href={`/admin/schedule/${horario.id}`}
              key={horario.id}
              className="flex flex-col gap-4 p-5 border rounded-lg bg-card hover:shadow-sm active:shadow-none transition-shadow duration-200 cursor-pointer"
            >
              {/* className="flex flex-col gap-4 p-5 border rounded-lg bg-card hover:shadow-sm transition-shadow duration-200" */}
              {/* Card header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-foreground text-base">{DAY_LABELS[horario.dayOfWeek] ?? horario.dayOfWeek}</span>
                  <Badge variant={horario.isActive ? "default" : "secondary"} className="w-fit text-[10px]">
                    {horario.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Turnos */}
              <div className="flex flex-col gap-2">
                {horario.shifts.length === 0 ? (
                  <span className="text-xs text-muted-foreground">Sin turnos registrados</span>
                ) : (
                  horario.shifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                        {shift.name && <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{shift.name}</span>}
                      </div>
                      <span className="text-xs font-medium text-foreground tabular-nums">
                        {shift.openTime} — {shift.closeTime}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </LayoutAdminSection>
  )
}
