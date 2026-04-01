import { z } from "zod"

export const DayOfWeekSchema = z.enum([
  "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"
])

export const ShiftSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  openTime: z.string().min(1, "La hora de apertura es obligatoria"),
  closeTime: z.string().min(1, "La hora de cierre es obligatoria"),
}).refine(
  (val) => val.openTime < val.closeTime,
  { message: "La apertura debe ser antes del cierre", path: ["closeTime"] }
)

export const ScheduleSchema = z.object({
  dayOfWeek: DayOfWeekSchema,
  isActive: z.boolean(),
  shifts: z.array(ShiftSchema).min(1, "Debe haber al menos un turno"),
})

export type ScheduleFormValues = z.infer<typeof ScheduleSchema>
export type ShiftValues = z.infer<typeof ShiftSchema>