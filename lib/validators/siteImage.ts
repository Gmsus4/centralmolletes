import { z } from "zod"

export const SITE_IMAGE_SECTIONS = [
  { value: "testimonials", label: "Testimonios", description: "Imágenes decorativas que aparecen junto a las reseñas de clientes en la página de inicio." },
  { value: "about",        label: "Nuestra Forma de Trabajar", description: "Imágenes del apartado que describe la filosofía y el ambiente del café." },
  { value: "stats",        label: "Estadísticas", description: "Imágenes decorativas dentro del grid de métricas (clientes, años, productos)." },
  { value: "features",     label: "Lo Que Nos Hace Únicos", description: "Imagen panorámica grande que aparece bajo las tarjetas de valores del café." },
] as const

export type SiteImageSection = (typeof SITE_IMAGE_SECTIONS)[number]["value"]

// lib/validators/siteImage.ts
export const SiteImageSchema = z.object({
  section: z.enum(
    SITE_IMAGE_SECTIONS.map((s) => s.value) as [SiteImageSection, ...SiteImageSection[]],
    { error: "Selecciona una sección" }
  ),
  src:   z.string().min(1, "La imagen es requerida"),
  alt:   z.string().max(200, "Máximo 200 caracteres"),
  order: z.number().int().min(1, "El valor mínimo debe ser 1"),
})

export type SiteImageFormValues = z.infer<typeof SiteImageSchema>