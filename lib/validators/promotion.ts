import { z } from "zod"

export const PromotionSchema = z
  .object({
    type:        z.enum(["DISCOUNT", "ANNOUNCE", "WARNING"]),
    title:       z.string().min(1, "El título es obligatorio"),
    description: z.string().optional().nullable(),
    discount:    z.number().min(0).max(100).optional().nullable(),
    startsAt:    z.string().min(1, "La fecha de inicio es obligatoria"),
    endsAt:      z.string().min(1, "La fecha de fin es obligatoria"),
    isActive:    z.boolean(),
    productIds:  z.array(z.string()),
  })
  .refine(
    (data) => new Date(data.endsAt) > new Date(data.startsAt),
    { message: "La fecha de fin debe ser posterior a la de inicio", path: ["endsAt"] }
  )
  .refine(
    (data) => {
      if (data.type === "DISCOUNT" && (data.discount == null || isNaN(data.discount))) return false
      return true
    },
    { message: "El descuento es obligatorio para tipo Descuento", path: ["discount"] }
  )

export type PromotionFormValues = z.infer<typeof PromotionSchema>