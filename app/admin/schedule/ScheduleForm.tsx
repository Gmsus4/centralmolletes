"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ScheduleSchema, ScheduleFormValues } from "@/lib/validators/schedule"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { AdminFormLayout } from "../components/AdminFormLayout"

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

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_OPTIONS = [
  { value: "LUNES",     label: "Lunes"     },
  { value: "MARTES",    label: "Martes"    },
  { value: "MIERCOLES", label: "Miércoles" },
  { value: "JUEVES",    label: "Jueves"    },
  { value: "VIERNES",   label: "Viernes"   },
  { value: "SABADO",    label: "Sábado"    },
  { value: "DOMINGO",   label: "Domingo"   },
]

const emptyShift = () => ({ name: "", openTime: "", closeTime: "" })

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{children}</span>
    <Separator className="flex-1" />
  </div>
)

// ─── Main component ───────────────────────────────────────────────────────────

export default function HorarioForm({ horario }: Props) {
  const router    = useRouter()
  const isEditing = !!horario?.id
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      dayOfWeek: (horario?.dayOfWeek as ScheduleFormValues["dayOfWeek"]) ?? "LUNES",
      isActive:  horario?.isActive ?? true,
      shifts:    horario?.shifts.length
        ? horario.shifts.map((s) => ({ ...s, name: s.name ?? "" }))
        : [emptyShift()],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "shifts" })
  const isActive = watch("isActive")

  const onSubmit = async (data: ScheduleFormValues) => {
    setSubmitError("")
    try {
      const url    = isEditing ? `/api/schedule/${horario!.id}` : "/api/schedule"
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
      <AdminFormLayout
        section="Horarios"
        title={isEditing ? "Editar" : "Nuevo"}
        backHref="/admin/schedule"
        formId="horario-form"
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onDelete={isEditing ? handleDelete : undefined}
        deleteTitle="¿Eliminar horario?"
        deleteDescription="Esta acción no se puede deshacer. El horario será eliminado permanentemente."
      >
        
        <form id="horario-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <SectionTitle>Día y estado</SectionTitle>

          {/* Día de la semana */}
          <Field data-invalid={!!errors.dayOfWeek}>
            <FieldLabel htmlFor="dayOfWeek">Día de la semana</FieldLabel>
            <FieldError>{errors.dayOfWeek?.message}</FieldError>
            <Select
              defaultValue={horario?.dayOfWeek ?? "LUNES"}
              onValueChange={(val) => setValue("dayOfWeek", val as ScheduleFormValues["dayOfWeek"])}
            >
              <SelectTrigger id="dayOfWeek" aria-invalid={!!errors.dayOfWeek} className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_OPTIONS.map((d) => (
                  <SelectItem className="cursor-pointer" key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Activo */}
          <div className="flex items-center gap-3">
            <Switch
              className="cursor-pointer"
              id="isActive"
              checked={isActive}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
            <FieldLabel htmlFor="isActive" className="cursor-pointer">
              {isActive ? "Activo" : "Inactivo"}
            </FieldLabel>
          </div>

          {/* Turnos */}
          <div className="flex flex-col gap-4 mt-2">
            <SectionTitle>Turnos</SectionTitle>

            {errors.shifts?.root?.message && (
              <FieldError>{errors.shifts.root.message}</FieldError>
            )}

            {fields.map((field, idx) => (
              <div key={field.id} className="flex flex-col gap-3 p-4 border rounded-md bg-muted/30 relative">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(idx)}
                    className="absolute cursor-pointer top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                    aria-label="Quitar turno"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}

                <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                  Turno {idx + 1}
                </span>

                <Field>
                  <FieldLabel htmlFor={`shifts.${idx}.name`}>
                    Nombre del turno{" "}
                    <span className="normal-case tracking-normal text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={`shifts.${idx}.name`}
                    {...register(`shifts.${idx}.name`)}
                    placeholder="Matutino, Vespertino…"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field data-invalid={!!errors.shifts?.[idx]?.openTime}>
                    <FieldLabel htmlFor={`shifts.${idx}.openTime`}>Apertura</FieldLabel>
                    <FieldError>{errors.shifts?.[idx]?.openTime?.message}</FieldError>
                    <Input
                      id={`shifts.${idx}.openTime`}
                      aria-invalid={!!errors.shifts?.[idx]?.openTime}
                      {...register(`shifts.${idx}.openTime`)}
                      type="time" className="[color-scheme:light]"
                    />
                  </Field>
                  <Field data-invalid={!!errors.shifts?.[idx]?.closeTime}>
                    <FieldLabel htmlFor={`shifts.${idx}.closeTime`}>Cierre</FieldLabel>
                    <FieldError>{errors.shifts?.[idx]?.closeTime?.message}</FieldError>
                    <Input
                      id={`shifts.${idx}.closeTime`}
                      aria-invalid={!!errors.shifts?.[idx]?.closeTime}
                      {...register(`shifts.${idx}.closeTime`)}
                      type="time" className="[color-scheme:light]"
                    />
                  </Field>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append(emptyShift())}
              className="border-dashed text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar turno
            </Button>
          </div>
        </form>
      </AdminFormLayout>
  )
}