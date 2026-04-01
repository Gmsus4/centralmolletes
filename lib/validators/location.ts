import { z } from "zod"

const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/
const urlRegex   = /^https?:\/\/.+/

export const LocationSchema = z.object({
  slug:       z.string().min(1, "El slug es obligatorio").max(100).regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Solo letras minúsculas, números y guiones"
              ),
  city:       z.string().min(1, "La ciudad es obligatoria").max(100),
  name:       z.string().min(1, "El nombre es obligatorio").max(150),
  address:    z.string().min(1, "La dirección completa es obligatoria").max(300),
  addressMin: z.string().min(1, "La dirección corta es obligatoria").max(150),
  phone:      z.string().regex(phoneRegex, "Teléfono inválido (ej: +52 386 105 4528)"),
  hours:      z.string().min(1, "El horario es obligatorio").max(200),
  image:      z.string().min(1, "La imagen principal es obligatoria"),
  gallery:    z.array(z.string().url("URL de galería inválida")).optional(),
  mapUrl:     z.string().regex(urlRegex, "URL de Google Maps inválida"),
  embedUrl:   z.string().regex(urlRegex, "Embed URL inválida"),
})

export type LocationFormValues = z.infer<typeof LocationSchema>