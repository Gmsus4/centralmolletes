import { z } from "zod"

const urlRegex = /^https?:\/\/.+/

export const ReviewSchema = z.object({
  author:   z.string().min(1, "El nombre es obligatorio").max(100),
  role:     z.string().min(1, "El rol es obligatorio").max(100),
  body:     z.string().min(1, "La reseña es obligatoria").max(500),
  photo:    z.string().regex(urlRegex, "URL de foto inválida").optional().or(z.literal("")),
  rating:   z.number().int().min(1, "Mínimo 1 estrella").max(5, "Máximo 5 estrellas"),
  status:   z.enum(["visible", "hidden"]),
  order:    z.number().int().min(0).optional(),
})

export type ReviewFormValues = z.infer<typeof ReviewSchema>
export type ReviewStatus     = "visible" | "hidden"