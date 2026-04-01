import Link from "next/link"
import prisma from "@/lib/prisma"
import {
  IconAddressBook, IconArrowRight, IconArticle, IconBowlChopsticks,
  IconCalendarWeek, IconDiscount2, IconMapPin, IconPaint,
  IconSpeakerphone, IconTag,
} from "@tabler/icons-react"
import Toast from "@/components/ui/Toast"

export const dynamic = "force-dynamic"

export default async function AdminPage({ searchParams }: { searchParams: { login?: string } }) {
  const products = await prisma.product.findMany({
    orderBy: { category: { order: "asc" } },
    include: { category: true },
  })

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  })

  const [blogCount, promotionCount, announcementCount] = await Promise.all([
    prisma.blog.count().catch(() => 0),
    prisma.promotion.count().catch(() => 0),
    prisma.announcement.count().catch(() => 0),
  ])

  const SECTIONS = [
    {
      icon: IconBowlChopsticks,
      title: "Productos",
      href: "/admin/products",
      desc: "Administra el catálogo completo: agrega, edita o elimina platillos con sus precios, imágenes e ingredientes.",
      count: products.length,
    },
    {
      icon: IconTag,
      title: "Categorías",
      href: "/admin/categories",
      desc: "Organiza tus productos en grupos lógicos para mejorar la navegación del cliente.",
      count: categories.length,
    },
    {
      icon: IconAddressBook,
      title: "Contacto",
      href: "/admin/contact",
      desc: "Actualiza los datos de contacto: teléfono, email, WhatsApp y redes sociales.",
      count: null,
    },
    {
      icon: IconMapPin,
      title: "Ubicación",
      href: "/admin/locations",
      desc: "Gestiona la dirección, mapa y horarios de atención del negocio.",
      count: null,
    },
    {
      icon: IconCalendarWeek,
      title: "Horarios",
      href: "/admin/schedule",
      desc: "Configura los días y horarios de atención del negocio para que los clientes sepan cuándo estás abierto.",
      count: null,
    },
    {
      icon: IconArticle,
      title: "Blog",
      href: "/admin/blog",
      desc: "Crea y gestiona artículos, noticias o novedades para mantener informada a tu audiencia.",
      count: blogCount,
    },
    {
      icon: IconDiscount2,
      title: "Promociones",
      href: "/admin/promotions",
      desc: "Crea ofertas especiales y descuentos temporales para incentivar las ventas.",
      count: promotionCount,
    },
    {
      icon: IconSpeakerphone,
      title: "Anuncios",
      href: "/admin/announcements",
      desc: "Publica avisos importantes o alertas que aparecerán de forma destacada en el sitio.",
      count: announcementCount,
    },
    {
      icon: IconPaint,
      title: "Tema",
      href: "/admin/theme",
      desc: "Personaliza la apariencia visual, colores y estilos de tu plataforma para reflejar tu marca.",
      count: null,
    },
  ]

  return (
    // En desktop: ocupa exactamente el viewport sin scroll; en mobile: scroll libre
    <div className="
      w-full
      min-h-screen lg:h-screen lg:overflow-hidden
      flex flex-col
      px-6 py-6 lg:py-4
      max-w-6xl mx-auto
    ">

      {/* ── Header (comprimido en desktop) ── */}
      <div className="flex flex-col items-center text-center py-6 lg:py-3 shrink-0">
        <div className="flex items-center gap-4 mb-3">
          <span className="w-10 h-px bg-stone-300" />
          <span className="text-[9px] uppercase tracking-[0.5em] text-darkMid/80">
            Panel de control
          </span>
          <span className="w-10 h-px bg-stone-300" />
        </div>

        <h1
          className="font-titleText text-stone-900 uppercase leading-none mb-3 text-4xl lg:text-5xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          Bienvenido
        </h1>

        <Toast message="Bienvenido de vuelta 👋" type="success" triggerParam="success" />

        {/* <div className="flex items-center gap-3 mb-3">
          <span className="w-14 h-px bg-stone-200" />
          <span className="w-1.5 h-1.5 rotate-45 bg-stone-300 inline-block" />
          <span className="w-14 h-px bg-stone-200" />
        </div> */}

        {/* <p className="text-[10px] uppercase tracking-[0.3em] text-darkMid/80 max-w-xs leading-relaxed">
          Selecciona una sección para gestionar el contenido
        </p> */}
      </div>

      {/* ── Métricas ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-200 mb-4 shrink-0">
        {[
          { icon: IconBowlChopsticks, value: products.length,  label: "Productos"   },
          { icon: IconTag,            value: categories.length, label: "Categorías"  },
          { icon: IconArticle,        value: blogCount,         label: "Artículos"   },
          { icon: IconDiscount2,      value: promotionCount,    label: "Promociones" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="bg-white flex flex-col items-center justify-center gap-1 py-4 px-4">
            <Icon size={14} strokeWidth={1.5} className="text-stone-400" />
            <p className="text-2xl font-light text-stone-900 tabular-nums">{value}</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-darkMid/60">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      {/* ── Section label ── */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.3em] text-darkMid/80">
          Secciones ({SECTIONS.length})
        </span>
        <span className="flex-1 h-px bg-stone-100" />
      </div>

      {/* ── Grid: en desktop crece para llenar el espacio restante ── */}
      <div className="
        grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
        gap-px bg-stone-200
        flex-1 lg:overflow-auto
        min-h-0
      ">
        {SECTIONS.map(({ icon: Icon, title, href, desc, count }) => (
          <Link
            key={href}
            href={href}
            className="
              group relative bg-white
              flex flex-col gap-3 p-5
              hover:bg-stone-900
              transition-colors duration-200
            "
          >
            <div className="flex items-start justify-between">
              <div className="
                w-9 h-9 border border-stone-200
                group-hover:border-white/20
                flex items-center justify-center
                transition-colors duration-200
              ">
                <Icon
                  size={14}
                  strokeWidth={1.5}
                  className="text-stone-500 group-hover:text-white transition-colors duration-200"
                />
              </div>

              <div className="flex items-center gap-2 mt-1">
                {count !== null && (
                  <span className="
                    text-[10px] font-mono tabular-nums
                    text-stone-400 group-hover:text-white/40
                    transition-colors duration-200
                  ">
                    {count}
                  </span>
                )}
                <IconArrowRight
                  size={13}
                  className="
                    text-stone-300 group-hover:text-white/40
                    translate-x-0 group-hover:translate-x-1
                    transition-all duration-200
                  "
                />
              </div>
            </div>

            <div>
              <h2 className="
                text-[11px] uppercase tracking-[0.3em] font-semibold
                text-darkWarm group-hover:text-white
                transition-colors duration-200 mb-1.5
              ">
                {title}
              </h2>
              <div className="
                w-2/5 h-px bg-stone-200
                group-hover:bg-white/20
                transition-colors duration-200
              " />
            </div>

            <p className="
              text-[11px] leading-relaxed
              text-darkMid/80 group-hover:text-white/60
              transition-colors duration-200
              flex-1
            ">
              {desc}
            </p>

            <div className="
              self-start
              text-[9px] uppercase tracking-[0.3em]
              text-darkMid/95 group-hover:text-white/50
              border-b border-stone-200 group-hover:border-white/20
              pb-px transition-colors duration-200
            ">
              Gestionar
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}