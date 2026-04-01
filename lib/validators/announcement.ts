import { z } from "zod"

export const AnnouncementSchema = z
  .object({
    type: z.enum(["PROMO", "INFO", "WARNING", "CLOSED"]),
    title: z.string().min(1, "El título es obligatorio"),
    message: z.string().optional().nullable(),
    startsAt: z.string().min(1, "La fecha de inicio es obligatoria"),
    endsAt: z.string().optional().nullable(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.startsAt || !data.endsAt) return true
      return new Date(data.endsAt) > new Date(data.startsAt)
    },
    { message: "La fecha de fin debe ser posterior a la de inicio", path: ["endsAt"] }
  )

export type AnnouncementFormValues = z.infer<typeof AnnouncementSchema>