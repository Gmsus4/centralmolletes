import type { Metadata } from "next"
import { unstable_cache } from "next/cache"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ShareButton } from "@/components/ui/ShareButton"
import { EditButton } from "@/components/ui/EditButton"
import { FooterServer } from "@/components/shared/FooterServer"
import { NavbarServer } from "@/components/shared/NavbarServer"
import { Locations } from "@/components/locations/Locations"
import { tagColors } from "@/lib/tagColors"
import { getCategoryExtras } from "@/data/menuCategoryExtra"
import { IconArrowLeft, IconArrowNarrowRight } from "@tabler/icons-react"

export const revalidate = 3600

function parseList(value: string): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed
      : value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
  } catch {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
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
    category: p.category.name,
    tag: p.tag ?? undefined,
    ingredients: parseList(p.ingredients),
    allergens: parseList(p.allergens),
  }
}

const getProduct = unstable_cache(async (slug: string) => prisma.product.findUnique({ where: { slug }, include: { category: true } }), ["menu-product"], { revalidate: 3600, tags: ["products"] })

const getLocations = unstable_cache(async () => prisma.location.findMany({ orderBy: [{ createdAt: "desc" }] }), ["locations-list"], { revalidate: 3600, tags: ["locations"] })

const getActivePromotion = unstable_cache(
  async (productId: string) =>
    prisma.promotion.findFirst({
      where: {
        isActive: true,
        type: "DISCOUNT",
        startsAt: { lte: new Date() },
        endsAt: { gte: new Date() },
        products: { some: { id: productId } },
      },
      orderBy: { discount: "desc" },
    }),
  ["product-promotion"],
  { revalidate: 300, tags: ["promotions"] },
)

const getRelatedProducts = unstable_cache(
  async (categoryId: string, excludeSlug: string) =>
    prisma.product.findMany({
      where: { categoryId, slug: { not: excludeSlug } },
      include: { category: true },
      take: 3,
    }),
  ["related-products"],
  { revalidate: 3600, tags: ["products"] },
)

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } })
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const raw = await getProduct(slug)
  if (!raw) return {}

  const product = parseProduct(raw)

  return {
    title: product.name,
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://centralmolletes.netlify.app/"),
    description: product.desc,
    openGraph: {
      title: product.name,
      description: product.desc,
      images: [{ url: product.img, width: 1200, height: 630, alt: product.name }],
      type: "website",
      locale: "es_MX",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.desc,
      images: [product.img],
    },
  }
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <span className="h-px w-10 bg-white/18" />
      <h2 className="font-title text-2xl text-white sm:text-3xl">{title}</h2>
    </div>
  )
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [raw, locations] = await Promise.all([getProduct(slug), getLocations()])
  if (!raw) notFound()

  const [activePromotion, relatedRaw] = await Promise.all([getActivePromotion(raw.id), getRelatedProducts(raw.categoryId, slug)])

  const discount = activePromotion?.discount ?? null
  const finalPrice = discount ? Math.round(raw.price * (1 - discount / 100)) : raw.price
  const originalPrice = discount ? raw.price : null
  const product = { ...parseProduct(raw), price: finalPrice }

  const relatedWithPrices = await Promise.all(
    relatedRaw.map(async (rel) => {
      const promo = await getActivePromotion(rel.id)
      const d = promo?.discount ?? null

      return {
        ...parseProduct(rel),
        originalPrice: d ? rel.price : null,
        price: d ? Math.round(rel.price * (1 - d / 100)) : rel.price,
      }
    }),
  )

  const metaItems = [
    { label: "Presentacion", value: product.weight, icon: "📦" },
    { label: "Tiempo", value: product.prepTime, icon: "⏱" },
    { label: "Alergenos", value: product.allergens.join(", ") || "Ninguno", icon: "⚠️" },
  ]

  const extras = getCategoryExtras(product.category) ?? []

  return (
    <>
      <NavbarServer />

      <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
        <section className="relative isolate min-h-screen overflow-hidden">
          <Image src={product.img} alt={product.name} fill priority sizes="100vw" className="object-cover" />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.48)_26%,rgba(0,0,0,0.78)_58%,rgba(0,0,0,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />

          {/* <ShareButton title={product.name} description={product.desc} /> */}

          <div className="relative z-10 mx-auto flex min-h-dvh max-w-7xl items-end px-5 pb-8 pt-28 sm:px-8 lg:px-16 lg:pb-14">
            <div className="w-full">
              <div className="max-w-3xl">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md">
                    {product.category}
                  </span>

                  {product.tag && <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${tagColors[product.tag]}`}>{product.tag}</span>}

                  {discount && (
                    <span className="rounded-full border border-white/25 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_28px_rgba(255,255,255,0.22)]">
                      -{discount}% off
                    </span>
                  )}
                </div>

                <h1 className="font-title text-5xl leading-[0.9] tracking-tight text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.12)] sm:text-6xl lg:text-7xl xl:text-8xl">{product.name}</h1>

                <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
                  {originalPrice && <span className="font-title text-2xl text-white/35 line-through sm:text-3xl">${originalPrice}</span>}
                  <span className="font-title text-5xl font-bold text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.18)] sm:text-6xl">${product.price}</span>
                  <span className="pb-2 text-sm uppercase tracking-[0.18em] text-white/55">MXN</span>
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-[15px]">{product.descLong}</p>
              </div>

              {/* Desktop: panel integrado sobre la foto */}
              <div className="mt-6 hidden rounded-[26px] border  border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.22)] lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-4">
                  <EditButton productId={raw.id} />
                <div className="grid gap-3">
                  {metaItems.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-sm text-white">{item.icon}</span>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-white/42">{item.label}</p>
                          <p className="truncate text-sm text-white">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-l border-white/10 pl-4">
                  {product.ingredients.length > 0 && (
                    <div>
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/42">Ingredientes</p>
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ing) => (
                          <span
                            key={ing}
                            className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-medium text-white/92 transition-all duration-200 hover:border-white/24 hover:bg-white/[0.09]"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extras.length > 0 && (
                    <div>
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/42">Extras</p>

                      <div className="space-y-2">
                        {extras.map((block) => (
                          <div key={block.title} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                            <div className="flex flex-col gap-1 xl:flex-row xl:items-baseline xl:justify-between">
                              <h3 className="text-sm font-semibold text-white">{block.title}</h3>
                              {block.note && <p className="text-xs italic text-white/58">{block.note}</p>}
                            </div>

                            <div className="mt-1 space-y-1">
                              {block.extras.map((extra) => (
                                <div key={extra.label} className="text-xs leading-relaxed text-white/84 sm:text-sm">
                                  <span>{extra.label}</span>
                                  {extra.price ? <span className="ml-1 text-white">+${extra.price}</span> : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-20 px-5 py-6 sm:px-8 lg:hidden">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.22)] sm:p-4">
              <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
                {metaItems.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 sm:px-3.5 sm:py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-sm text-white sm:h-9 sm:w-9">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[8px] uppercase tracking-[0.2em] text-white/42 sm:text-[9px]">{item.label}</p>
                        <p className="truncate text-xs text-white sm:text-sm">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                {product.ingredients.length > 0 && (
                  <div>
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/42">Ingredientes</p>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ing) => (
                        <span
                          key={ing}
                          className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[10px] font-medium text-white/92 transition-all duration-200 hover:border-white/24 hover:bg-white/[0.09] sm:px-3.5 sm:text-[11px]"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {extras.length > 0 && (
                  <div>
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/42">Extras</p>

                    <div className="space-y-2">
                      {extras.map((block) => (
                        <div key={block.title} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-semibold text-white">{block.title}</h3>
                            {block.note && <p className="text-xs italic text-white/58">{block.note}</p>}
                          </div>

                          <div className="mt-1 space-y-1">
                            {block.extras.map((extra) => (
                              <div key={extra.label} className="text-xs leading-relaxed text-white/84 sm:text-sm">
                                <span>{extra.label}</span>
                                {extra.price ? <span className="ml-1 text-white">+${extra.price}</span> : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {relatedWithPrices.length > 0 && (
          <section className="relative mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-16 lg:pb-24 lg:pt-14">
            <SectionTitle title="Tambien te puede gustar" />

            <div className="flex gap-4 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
              {relatedWithPrices.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/menu/${rel.slug}`}
                  className="group relative flex w-[78vw] shrink-0 flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                    <Image
                      fill
                      src={rel.img}
                      alt={rel.name}
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0.18)_34%,rgba(0,0,0,0.84)_100%)]" />

                    {rel.tag && <span className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] ${tagColors[rel.tag]}`}>{rel.tag}</span>}

                    <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                      <IconArrowNarrowRight className="h-4 w-4" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="line-clamp-2 text-sm leading-relaxed text-white/78">{rel.desc}</p>
                    </div>
                  </div>

                  <div className="px-2 pb-2 pt-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">{rel.category}</p>

                    <div className="mt-1 flex items-start justify-between gap-3">
                      <h3 className="text-lg leading-snug text-white transition-colors duration-200 group-hover:text-white/88">{rel.name}</h3>

                      <div className="shrink-0 text-right">
                        {rel.originalPrice && <span className="block font-title text-sm text-white/35 line-through">${rel.originalPrice}</span>}
                        <span className="font-title text-xl text-white">${rel.price}</span>
                        <span className="ml-1 text-[11px] uppercase tracking-[0.15em] text-white/45">MXN</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="relative mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-16">
          <SectionTitle title="Nuestras sucursales" />
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm sm:p-6">
            <Locations className="bg-transparent" locations={locations} />
          </div>
        </section>
      </main>

      <FooterServer />
    </>
  )
}
