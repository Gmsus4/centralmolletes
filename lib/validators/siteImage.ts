import { z } from "zod"

export const SITE_IMAGE_SECTIONS = [
  { value: "testimonials", label: "Testimonios", description: "Imágenes decorativas que aparecen junto a las reseñas de clientes en la página de inicio." },
  { value: "about",        label: "Nuestra Forma de Trabajar", description: "Imágenes del apartado que describe la filosofía y el ambiente del café." },
  { value: "stats",        label: "Estadísticas", description: "Imágenes decorativas dentro del grid de métricas (clientes, años, productos)." },
  { value: "features",     label: "Lo Que Nos Hace Únicos", description: "Imagen panorámica grande que aparece bajo las tarjetas de valores del café." },
  { value: "hero",         label: "Fondo del Hero", description: "Imagen de fondo para la sección principal de bienvenida." },
  { value: "locations",    label: "Imagen de la Sucursal", description: "Fotografía de la fachada o del interior del establecimiento que ayuda a los clientes a identificar el lugar." },
  { value: "inner_header", label: "Cabecera de Páginas Internas", description: "Fondo de las secciones que no son el Home. Se recomienda una imagen con texturas oscuras para legibilidad." },
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