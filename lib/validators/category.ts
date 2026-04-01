import { z } from "zod"

export const CategorySchema = z.object({
  name:  z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  emoji: z.string().min(1, "El emoji es obligatorio").max(10, "Máximo 10 caracteres"),
  order: z.number().int().nonnegative(),
})

export type CategoryFormValues = z.infer<typeof CategorySchema>