import { z } from "zod"

export const AvailabilitySchema = z.enum(["DAY", "NIGHT", "BOTH"])

export const ProductSchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  name: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  price: z
    .number({ error: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a 0"),
  category: z.string().min(1, "La categoría es obligatoria"),
  tag: z.string().optional().or(z.literal("")),
  img: z.string().min(1, "La imagen es obligatoria"),
  desc: z.string().min(1, "La descripción corta es obligatoria").max(200, "Máximo 200 caracteres"),
  descLong: z.string().max(1000, "Máximo 1000 caracteres").optional().or(z.literal("")),
  ingredients: z.string(),
  allergens: z.string(),
  weight: z.string().min(1, "El peso es obligatorio"),
  prepTime: z.string().min(1, "El tiempo de preparación es obligatorio"),
  availability: AvailabilitySchema,
})

export type ProductFormValues = z.infer<typeof ProductSchema>