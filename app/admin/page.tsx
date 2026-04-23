import Link from "next/link"
import prisma from "@/lib/prisma"
import { IconAddressBook, IconArrowRight, IconArticle, IconBowlChopsticks, IconCalendarWeek, IconDiscount2, IconMapPin, IconPaint, IconSpeakerphone, IconTag } from "@tabler/icons-react"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { category: { order: "asc" } },
    include: { category: true },
  })

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  })

  const [blogCount, promotionCount, announcementCount, themeCount, locationCount] = await Promise.all([
    prisma.blog.count().catch(() => 0),
    prisma.promotion.count().catch(() => 0),
    prisma.announcement.count().catch(() => 0),
    prisma.theme.count().catch(() => 0),
    prisma.location.count().catch(() => 0),
  ])

  const STATS = [
    { label: "Productos", value: products.length, gold: false },
    { label: "Categorías", value: categories.length, gold: false },
    { label: "Artículos", value: blogCount, gold: false },
    { label: "Promociones", value: promotionCount, gold: true },
  ]

  const SECTIONS = [
    {
      icon: IconBowlChopsticks,
      title: "Productos",
      href: "/admin/products",
      desc: "Platillos, precios e ingredientes",
      count: products.length,
    },
    {
      icon: IconTag,
      title: "Categorías",
      href: "/admin/categories",
      desc: "Organización del menú",
      count: categories.length,
    },
    {
      icon: IconDiscount2,
      title: "Promociones",
      href: "/admin/promotions",
      desc: "Ofertas y descuentos activos",
      count: promotionCount,
    },
    {
      icon: IconArticle,
      title: "Blog",
      href: "/admin/blog",
      desc: "Artículos y novedades",
      count: blogCount,
    },
    {
      icon: IconSpeakerphone,
      title: "Anuncios",
      href: "/admin/announcements",
      desc: "Avisos destacados en el sitio",
      count: announcementCount,
    },
    {
      icon: IconAddressBook,
      title: "Contacto",
      href: "/admin/contact",
      desc: "Teléfono, email y redes sociales",
      count: null,
    },
    {
      icon: IconMapPin,
      title: "Ubicación",
      href: "/admin/locations",
      desc: "Dirección, mapa y horarios",
      count: locationCount,
    },
    {
      icon: IconCalendarWeek,
      title: "Horarios",
      href: "/admin/schedule",
      desc: "Días y horarios de atención",
      count: null,
    },
    {
      icon: IconPaint,
      title: "Tema",
      href: "/admin/theme",
      desc: "Colores y apariencia visual",
      count: themeCount,
    },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <p className="text-sm text-text-muted mb-0.5">Panel de control</p>
      <h1 className="text-2xl font-medium text-text-titles mb-7">Administración</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-muted rounded-radius p-4">
            <p className="text-xs text-text-muted mb-1">{s.label}</p>
            <p className={`text-3xl font-medium leading-none ${s.gold ? "shimmer-price" : "text-text-titles"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <p className="text-xs font-medium text-text-muted tracking-widest uppercase mb-3">Secciones</p>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5">
        {SECTIONS.map((sec) => (
          <Link key={sec.href} href={sec.href} className="group bg-white border border-border rounded-radius-lg p-4 flex flex-col gap-3 hover:border-border-color transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-radius bg-muted flex items-center justify-center">
                <sec.icon size={17} className="text-text-muted" />
              </div>
              {sec.count !== null && <span className="text-xs font-medium bg-muted text-text-muted rounded-full px-2 py-0.5">{sec.count}</span>}
            </div>
            <div>
              <p className="text-sm font-medium text-text-titles">{sec.title}</p>
              <p className="text-xs text-text-muted">{sec.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
