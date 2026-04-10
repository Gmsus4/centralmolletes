import { z } from "zod"

export const SITE_CONTENT_SECTIONS = [
  { value: "hero",      label: "Hero",             description: "Título, descripción y botones de la sección principal." },
  { value: "about",  label: "Nuestra Forma de Trabajar", description: "Título, descripción y los 4 features con ícono." },
  { value: "benefits",  label: "Lo Que Nos Hace Únicos",    description: "Título y las 3 tarjetas de valores con ícono y descripción." },
  { value: "stats",     label: "Estadísticas",     description: "Números y etiquetas del grid de métricas." },
  { value: "site",      label: "Sitio / Ticker",   description: "Nombre del negocio, tagline del navbar y los items del ticker." },
] as const

export type SiteContentSection = (typeof SITE_CONTENT_SECTIONS)[number]["value"]

export const SITE_CONTENT_TYPES = ["text", "textarea", "icon"] as const
export type SiteContentType = (typeof SITE_CONTENT_TYPES)[number]

export const SiteContentSchema = z.object({
  key: z
    .string()
    .min(1, "La key es requerida")
    .max(100, "Máximo 100 caracteres")
    .regex(/^[a-z0-9._-]+$/, "Solo letras minúsculas, números, puntos, guiones"),
  value: z.string().min(1, "El valor es requerido").max(1000, "Máximo 1000 caracteres"),
  section: z.enum(
    SITE_CONTENT_SECTIONS.map((s) => s.value) as [SiteContentSection, ...SiteContentSection[]],
    { error: "Selecciona una sección" }
  ),
  label: z.string().min(1, "La etiqueta es requerida").max(100, "Máximo 100 caracteres"),
  type: z.enum(SITE_CONTENT_TYPES, { error: "Tipo inválido" }),
})

export type SiteContentFormValues = z.infer<typeof SiteContentSchema>