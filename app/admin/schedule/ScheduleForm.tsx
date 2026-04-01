"use client"

import { Suspense, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ScheduleSchema, ScheduleFormValues } from "@/lib/validators/schedule"
import { IconPlus, IconX } from "@tabler/icons-react"
import Toast from "@/components/ui/Toast"

// ─── Types ────────────────────────────────────────────────────────────────────

type Schedule = {
  id: string
  dayOfWeek: string
  isActive: boolean
  shifts: {
    id?: string
    name: string | null
    openTime: string
    closeTime: string
  }[]
}

type Props = {
  horario?: Schedule
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputClass = `
  w-full bg-white
  border border-stone-300 focus:border-stone-700
  px-4 py-2.5
  text-stone-900 text-sm placeholder:text-stone-400
  outline-none transition-colors duration-200
`
const labelClass = "text-[10px] uppercase tracking-[0.25em] text-stone-600 font-medium"

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">{children}</span>
    <span className="flex-1 h-px bg-stone-100" />
  </div>
)

function Field({ label, error, children }: { label: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      {children}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirm, setConfirm] = useState(false)

  if (confirm) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">¿Confirmar?</span>
        <button
          type="button"
          onClick={onConfirm}
          className="text-[10px] uppercase tracking-[0.2em] text-red-500 hover:text-red-700 border-b border-red-400 hover:border-red-700 pb-px transition-colors duration-200 cursor-pointer"
        >
          Sí, eliminar
        </button>
        <button
          type="button"
          onClick={() => setConfirm(false)}
          className="text-[10px] uppercase tracking-[0.2em] text-stone-500 border-b border-stone-400 pb-px transition-colors duration-200 cursor-pointer"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirm(true)}
      className="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-red-500 border-b border-stone-300 hover:border-red-500 pb-px transition-colors duration-200 cursor-pointer"
    >
      Eliminar
    </button>
  )
}

const DAY_OPTIONS = [
  { value: "LUNES", label: "Lunes" },
  { value: "MARTES", label: "Martes" },
  { value: "MIERCOLES", label: "Miércoles" },
  { value: "JUEVES", label: "Jueves" },
  { value: "VIERNES", label: "Viernes" },
  { value: "SABADO", label: "Sábado" },
  { value: "DOMINGO", label: "Domingo" },
]

const emptyShift = () => ({ name: "", openTime: "", closeTime: "" })

// ─── Main component ───────────────────────────────────────────────────────────

export default function HorarioForm({ horario }: Props) {
  const router = useRouter()
  const isEditing = !!horario?.id
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      dayOfWeek: (horario?.dayOfWeek as ScheduleFormValues["dayOfWeek"]) ?? "LUNES",
      isActive: horario?.isActive ?? true,
      shifts: horario?.shifts.length ? horario.shifts.map((s) => ({ ...s, name: s.name ?? "" })) : [emptyShift()],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shifts",
  })

  const onSubmit = async (data: ScheduleFormValues) => {
    setSubmitError("")

    try {
      const url = isEditing ? `/api/schedule/${horario!.id}` : "/api/schedule"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const message = json.error ?? "Hubo un error al guardar el horario"

        if (json.error?.toLowerCase().includes("día") || json.error?.toLowerCase().includes("horario")) {
          setError("dayOfWeek", { message })
        } else {
          setSubmitError(message)
        }
        return
      }

      router.push(isEditing ? "/admin/schedule?edit=true" : "/admin/schedule?add=true")
      router.refresh()
    } catch {
      setSubmitError("Error de conexión. Intenta de nuevo.")
    }
  }

  const handleDelete = useCallback(async () => {
    await fetch(`/api/schedule/${horario!.id}`, { method: "DELETE" })
    router.push("/admin/schedule?deleted=true")
    router.refresh()
  }, [horario, router])

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Horarios</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">{isEditing ? "Editar" : "Nuevo"}</h1>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/schedule")}
            className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          {isEditing && <DeleteButton onConfirm={handleDelete} />}
          <button
            type="submit"
            form="horario-form"
            disabled={isSubmitting}
            className="bg-stone-900 text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 active:opacity-75 disabled:opacity-50 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" />
                Guardando…
              </span>
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      <form id="horario-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <SectionTitle>Día y estado</SectionTitle>

        {/* Día de la semana */}
        <Field label="Día de la semana" error={errors.dayOfWeek?.message}>
          <select {...register("dayOfWeek")} className={inputClass}>
            {DAY_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Activo */}
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer ${field.value ? "bg-green-400" : "bg-stone-400"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${field.value ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className={labelClass}>{field.value ? "Activo" : "Inactivo"}</span>
            </div>
          )}
        />

        {/* Turnos */}
        <div className="flex flex-col gap-4 mt-2">
          <SectionTitle>Turnos</SectionTitle>

          {/* Error global del array */}
          {errors.shifts?.root?.message && <span className="text-red-500 text-xs">{errors.shifts.root.message}</span>}

          {fields.map((field, idx) => (
            <div key={field.id} className="flex flex-col gap-3 p-4 border border-stone-200 bg-stone-50 relative">
              {/* Quitar turno */}
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(idx)} className="absolute top-3 right-3 text-stone-300 hover:text-red-500 transition-colors cursor-pointer" aria-label="Quitar turno">
                  <IconX size={14} />
                </button>
              )}

              <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400">Turno {idx + 1}</span>

              <Field
                label={
                  <>
                    Nombre del turno <span className="ml-1 normal-case tracking-normal text-stone-400">(opcional)</span>
                  </>
                }
              >
                <input {...register(`shifts.${idx}.name`)} placeholder="Matutino, Vespertino…" className={inputClass} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Apertura" error={errors.shifts?.[idx]?.openTime?.message}>
                  <input {...register(`shifts.${idx}.openTime`)} type="time" className={inputClass} />
                </Field>
                <Field label="Cierre" error={errors.shifts?.[idx]?.closeTime?.message}>
                  <input {...register(`shifts.${idx}.closeTime`)} type="time" className={inputClass} />
                </Field>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append(emptyShift())}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-stone-400 hover:text-stone-900 border border-dashed border-stone-300 hover:border-stone-600 px-4 py-3 transition-colors duration-200 cursor-pointer"
          >
            <IconPlus size={12} />
            Agregar turno
          </button>
        </div>

        {/* Mobile actions */}
        <div className="sm:hidden flex flex-col gap-4 mt-4 pt-6 border-t border-stone-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stone-900 text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando…" : "Guardar"}
          </button>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/admin/schedule")}
              className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 pb-px transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            {isEditing && <DeleteButton onConfirm={handleDelete} />}
          </div>
        </div>
      </form>
    </div>
  )
}
