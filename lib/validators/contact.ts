import { z } from "zod"

const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/

export const SocialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, "La plataforma es obligatoria"),
  url: z.string().min(1, "La URL es obligatoria").url("La URL no es válida"),
  username: z.string().optional().nullable(),
  order: z.number().int().nonnegative(),
  isActive: z.boolean(),
})

export const ContactSchema = z.object({
  address: z.string().min(1, "La dirección es obligatoria").max(300, "Máximo 300 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(phoneRegex, "Teléfono inválido (ej: +52 333 000 0000)"),
  whatsapp: z
    .string()
    .regex(phoneRegex, "WhatsApp inválido")
    .optional()
    .nullable()
    .or(z.literal("")),
  extraInfo: z.string().max(1000, "Máximo 1000 caracteres").optional().nullable(),
  socialLinks: z.array(SocialLinkSchema),
})

export type ContactFormValues = z.infer<typeof ContactSchema>
export type SocialLinkValues = z.infer<typeof SocialLinkSchema>