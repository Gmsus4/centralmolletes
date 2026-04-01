import { z } from "zod"

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Color inválido (ej: #FFCC00)")

export const ThemeSchema = z.object({
  name:                z.string().min(1, "El nombre es obligatorio").max(100),
  bgBody:              hexColor,
  bgDark:              hexColor,
  textMain:            hexColor,
  textTitles:          hexColor,
  textMuted:           hexColor,
  textInvert:          hexColor,
  brandPrimary:        hexColor,
  brandPrimaryHover:   hexColor,
  brandContrast:       hexColor,
  brandContrastHover:  hexColor,
  borderColor:         hexColor,
  statusError:         hexColor,
  shadowColor:         hexColor,
  radius:              z.string().min(1, "El radio es obligatorio"),
  radiusFull:          z.string().min(1, "El radio full es obligatorio"),
  fontTitle:           z.string().min(1, "La fuente de título es obligatoria"),
  fontBody:            z.string().min(1, "La fuente de cuerpo es obligatoria"),
})

export type ThemeFormValues = z.infer<typeof ThemeSchema>