import type { Metadata }        from "next"
import { unstable_cache }       from "next/cache"
import prisma                   from "@/lib/prisma"
import { notFound }             from "next/navigation"
import Link                     from "next/link"
import Image                    from "next/image"
import { BackButton }           from "@/components/ui/BackButton"
import { ShareButton }          from "@/components/ui/ShareButton"
import { EditButton }           from "@/components/ui/EditButton"
import { FooterServer }         from "@/components/shared/FooterServer"
import { NavbarServer }         from "@/components/shared/NavbarServer"
import { Locations }            from "@/components/locations/Locations"
import { tagColors }            from "@/lib/tagColors"
import { getCategoryExtras }    from "@/data/menuCategoryExtra"
import { IconArrowNarrowRight } from "@tabler/icons-react"
import ExtrasBadge from "@/components/ui/ExtrasBadge"

export const revalidate = 3600

// ── Helpers ──

function parseList(value: string): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : value.split(",").map((s) => s.trim()).filter(Boolean)
  } catch {
    return value.split(",").map((s) => s.trim()).filter(Boolean)
  }
}

function parseProduct(p: {
  id: string
  slug: string
  name: string
  price: number
  categoryId: string
  category: { name: string }
  tag: string | null
  img: string
  desc: string
  descLong: string
  ingredients: string
  allergens: string
  weight: string
  prepTime: string
}) {
  return {
    ...p,
    category:    p.category.name,
    tag:         p.tag ?? undefined,
    ingredients: parseList(p.ingredients),
    allergens:   parseList(p.allergens),
  }
}

// ── Caché del producto ──
const getProduct = unstable_cache(
  async (slug: string) =>
    prisma.product.findUnique({
      where:   { slug },
      include: { category: true },
    }),
  ["menu-product"],
  { revalidate: 3600, tags: ["products"] }
)

// ── Caché de locaciones ──
const getLocations = unstable_cache(
  async () => prisma.location.findMany({ orderBy: [{ createdAt: "desc" }] }),
  ["locations-list"],
  { revalidate: 3600, tags: ["locations"] }
)

// ── Caché de promoción activa para un producto ──
const getActivePromotion = unstable_cache(
  async (productId: string) =>
    prisma.promotion.findFirst({
      where: {
        isActive: true,
        type:     "DISCOUNT",
        startsAt: { lte: new Date() },
        endsAt:   { gte: new Date() },
        products: { some: { id: productId } },
      },
      orderBy: { discount: "desc" },
    }),
  ["product-promotion"],
  { revalidate: 300, tags: ["promotions"] } // 5 min — cambian más seguido
)

// ── Caché de productos relacionados ──
const getRelatedProducts = unstable_cache(
  async (categoryId: string, excludeSlug: string) =>
    prisma.product.findMany({
      where:   { categoryId, slug: { not: excludeSlug } },
      include: { category: true },
      take:    3,
    }),
  ["related-products"],
  { revalidate: 3600, tags: ["products"] }
)

// ── generateStaticParams ──
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}

// ── Metadata ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const raw      = await getProduct(slug) // ← usa caché, no query directa
  if (!raw) return {}

  const product = parseProduct(raw)

  return {
    title:        product.name,
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://centralmolletes.netlify.app/"),
    description:  product.desc,
    openGraph: {
      title:       product.name,
      description: product.desc,
      images: [{ url: product.img, width: 1200, height: 630, alt: product.name }],
      type:   "website",
      locale: "es_MX",
    },
    twitter: {
      card:        "summary_large_image",
      title:       product.name,
      description: product.desc,
      images:      [product.img],
    },
  }
}

// ── Página ──
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [raw, locations] = await Promise.all([
    getProduct(slug),
    getLocations(),
  ])

  if (!raw) notFound()

  const [activePromotion, relatedRaw] = await Promise.all([
    getActivePromotion(raw.id),
    getRelatedProducts(raw.categoryId, slug),
  ])

  // Precios del producto principal
  const discount      = activePromotion?.discount ?? null
  const finalPrice    = discount ? Math.round(raw.price * (1 - discount / 100)) : raw.price
  const originalPrice = discount ? raw.price : null
  const product       = { ...parseProduct(raw), price: finalPrice }

  // Precios de productos relacionados — en paralelo
  const relatedWithPrices = await Promise.all(
    relatedRaw.map(async (rel) => {
      const promo      = await getActivePromotion(rel.id)
      const relDiscount = promo?.discount ?? null
      return {
        ...parseProduct(rel),
        originalPrice: relDiscount ? rel.price : null,
        price: relDiscount ? Math.round(rel.price * (1 - relDiscount / 100)) : rel.price,
      }
    })
  )

  return (
    <>
      <NavbarServer />
      <main className="relative bg-bg-body min-h-screen w-full overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 mt-16 py-2 lg:py-12">
          <div className="flex flex-col lg:flex-row relative gap-12 lg:gap-20 items-stretch">
            <BackButton label="Volver a productos" />

            <div className="w-full flex-1 relative lg:w-2/5">
              <ShareButton title={product.name} description={product.desc} />
              <EditButton productId={raw.id} />
              <div className="relative w-full h-72 lg:h-full min-h-[400px] rounded-3xl overflow-hidden drop-shadow-2xl z-10">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill priority quality={100}
                  sizes="100vw"
                  className="object-cover"
                />
                {discount && (
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 bg-bg-dark text-text-invert absolute right-4 top-4 rounded-full">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <div className="anim-tag flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-[0.25em] text-text-main/90 font-semibold">
                  {product.category}
                </span>
                {product.tag && (
                  <>
                    <span className="text-text-main">·</span>
                    <span className={`text-[9px] font-bold text-text-main pt-1.5 uppercase tracking-widest px-2.5 py-1 rounded-full ${tagColors[product.tag]}`}>
                      {product.tag}
                    </span>
                  </>
                )}
              </div>

              <h1 className="anim-title font-title text-5xl sm:text-6xl lg:text-7xl text-text-titles leading-tight">
                {product.name}
              </h1>

              <div className="anim-price flex items-baseline gap-3 flex-wrap">
                {originalPrice && (
                  <span className="font-title text-2xl text-text-main/40 line-through">
                    ${originalPrice}
                  </span>
                )}
                <span className="shimmer-price font-title text-4xl font-bold">${product.price}</span>
                <span className="text-text-main/80 text-sm">MXN</span>
              </div>

              <div className="h-px w-full bg-bg-dark/15" />

              <p className="anim-desc text-text-main/90 text-sm sm:text-base leading-relaxed">
                {product.descLong}
              </p>

              <div className="anim-meta grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Presentación",     value: product.weight },
                  { label: "Tiempo de pedido", value: product.prepTime },
                  { label: "Alérgenos",        value: product.allergens.join(", ") || "Ninguno" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-1 p-3 rounded-primarySize border border-border-color/20 bg-transparent"
                  >
                    <span className="text-[9px] uppercase tracking-widest text-text-main/70 font-semibold">
                      {item.label}
                    </span>
                    <span className="text-text-main text-xs font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="anim-meta flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-[10px] text-text-main border border-border-color/25 rounded-radius px-3 py-1"
                  >
                    {ing}
                  </span>
                ))}
              </div>

              {getCategoryExtras(product.category)?.map((block) => (
                <ExtrasBadge key={block.title} title={block.title} extras={block.extras} note={block.note} />
              ))}
            </div>
          </div>

          {relatedWithPrices.length > 0 && (
            <div className="pt-10">
              <div className="flex items-center gap-3 mb-8 anim-section-title">
                <span className="h-px w-8 bg-darkWarm/50" />
                <h2 className="font-title text-3xl text-darkWarm">También te puede gustar</h2>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
                {relatedWithPrices.map((rel) => (
                  <Link key={rel.slug} href={`/menu/${rel.slug}`} className="rel-card group relative flex flex-col">
                    <div className="relative overflow-hidden rounded-radius w-full bg-brand-primary h-56 flex items-center justify-center">
                      <Image
                        fill
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                        src={rel.img}
                        alt={rel.name}
                        className="group-hover:scale-105 h-full transition-transform duration-500 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/95 via-bg-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-radius" />
                      {rel.tag && (
                        <span className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full ${tagColors[rel.tag]}`}>
                          {rel.tag}
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-bg-body/90 text-xs leading-relaxed line-clamp-2">{rel.descLong}</p>
                      </div>
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-bg-dark/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
                        <IconArrowNarrowRight className="text-brand-primary w-4 h-4" />
                      </div>
                    </div>
                    <div className="pt-3 px-1">
                      <span className="text-[9px] uppercase tracking-[0.18em] text-text-main/50 font-semibold">
                        {rel.category}
                      </span>
                      <div className="flex items-baseline justify-between gap-2 mt-0.5">
                        <h3 className="text-xl text-text-titles leading-snug transition-colors duration-200">
                          {rel.name}
                        </h3>
                        <div className="flex items-baseline gap-3 flex-wrap">
                          {rel.originalPrice && (
                            <span className="font-title text-sm text-text-main/60 line-through">
                              ${rel.originalPrice}
                            </span>
                          )}
                          <span className="shimmer-price font-title text-lg font-bold">${rel.price}</span>
                          <span className="text-text-main/80 text-sm">MXN</span>
                        </div>
                      </div>
                      <div className="mt-2 h-px bg-bg-dark/10 relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-brand-contrast/50 transition-all duration-500 ease-out" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
          <div className="flex items-center gap-3 mb-8 anim-section-title">
            <span className="h-px w-8 bg-text-main/50" />
            <h2 className="font-title text-3xl text-text-titles">Nuestras sucursales</h2>
          </div>
          <Locations className="bg-bg-body pb-20" locations={locations} />
        </div>
      </main>
      <FooterServer />
    </>
  )
}