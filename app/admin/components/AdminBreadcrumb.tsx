// app/admin/components/AdminBreadcrumb.tsx
"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeLabels: Record<string, string> = {
  // Menú
  products:      "Productos",
  categories:    "Categorías",
  promotions:    "Promociones",
  // Información
  locations:     "Ubicación",
  schedule:      "Horarios",
  contact:       "Contacto",
  // Contenido
  blog:          "Blog",
  announcements: "Anuncios",
  reviews: "Reseñas",
  "site-images": "Galería del Sitio",
  // Avanzado
  theme: "Temas",
  "site-content": "Módulos de texto"
}

export function AdminBreadcrumb() {
  const pathname = usePathname()

  // Extrae el segmento después de /admin/
  const segment = pathname.split("/")[2]
  const label = routeLabels[segment] ?? segment

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
        </BreadcrumbItem>
        {label && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}