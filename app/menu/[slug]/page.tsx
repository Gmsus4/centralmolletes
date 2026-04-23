// app/menu/[slug]/page.tsx
import type { Metadata } from "next"
import { unstable_cache } from "next/cache"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { EditButton } from "@/components/ui/EditButton"
import { FooterServer } from "@/components/shared/FooterServer"
import { NavbarServer } from "@/components/shared/NavbarServer"
import { Locations, LocationsCards } from "@/components/locations/Locations"
import { tagColors } from "@/lib/tagColors"
import { getCategoryExtras } from "@/data/menuCategoryExtra"
import { BackButton } from "@/components/ui/BackButton"
import { ShareButton } from "@/components/ui/ShareButton"

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
    twitter: { card: "summary_large_image", title: product.name, description: product.desc, images: [product.img] },
  }
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
    { label: "Presentación", value: product.weight, icon: "📦" },
    { label: "Tiempo", value: product.prepTime, icon: "⏱" },
    { label: "Alérgenos", value: product.allergens.join(", ") || "Ninguno", icon: "⚠️" },
  ]

  const extras = getCategoryExtras(product.category) ?? []

  return (
    <>
      <NavbarServer />
      <main className="min-h-screen bg-bg-body text-text-main relative">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* ── COLUMNA IZQUIERDA: IMAGEN ── */}
          <div className="relative w-full h-[60vh] lg:h-dvh 2xl:col-span-9 xl:col-span-8 lg:col-span-7 lg:sticky col-span-12 lg:top-0 bg-bg-dark/5">
            <Image 
              src={product.img} 
              alt={product.name} 
              fill 
              priority 
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover" 
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-black/5" />
            
            {/* Back Button */}
            <div className="absolute left-6 top-6 z-50 sm:left-10 sm:top-10">
              <BackButton />
            </div>

            {/* Acciones flotantes sobre la imagen */}
            <div className="absolute right-6 bottom-6 z-50 sm:right-10 sm:bottom-10 flex flex-row items-end gap-3">
              {/* ─────── Share Button ─────── */}
              <ShareButton title={product.name} description="¡Tienes que probar este platillo de Central de Molletes!" />

              {/* Edit Button */}
              <EditButton productId={raw.id} />
            </div>
          </div>

          {/* ── COLUMNA DERECHA: INFORMACIÓN ── */}
          <div className="col-span-12 2xl:col-span-3 xl:col-span-4 lg:col-span-5 bg-white flex flex-col relative z-10 border-l border-black/10 pb-10 lg:pb-0 lg:pt-16 pt-0">
            
            <div className="flex flex-col px-6 py-6 sm:px-8 lg:p-10 xl:p-12">
              
              {/* CATEGORY & TAGS */}
              <div className="flex flex-row items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  {product.category}
                </p>
                <div className="flex flex-row gap-2">
                  {discount && (
                    <span className="bg-[#111111] rounded-radius px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      -{discount}%
                    </span>
                  )}
                  {product.tag && (
                    <span className="border border-black rounded-radius px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
                      {product.tag}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col">  
                {/* TITLE */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-titles font-title italic tracking-tighter leading-[0.95] mb-2">
                  {product.name}
                </h1>

                {/* PRICE */}
                <div className="flex flex-row items-baseline gap-3 mb-6 mt-6">
                  <span className="text-2xl sm:text-5xl font-bold tracking-tight text-text-titles">${product.price}</span>
                  {originalPrice && <span className="text-base font-medium text-text-muted line-through">${originalPrice}</span>}
                </div>
              </div>    

              {/* DESCRIPTION */}
              <p className="text-text-main text-sm sm:text-base font-medium leading-relaxed">
                {product.descLong}
              </p>
            </div>

            {/* ── LISTA DE DETALLES Y EXTRAS (Estilo Acordeón a ancho completo) ── */}
            <div className="flex flex-col border-t border-black/10 mt-auto">
              
              {/* EXTRAS */}
              {extras.map((extra, idx) => (
                <div key={`extra-${idx}`} className="flex flex-col px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b border-black/10">
                  <p className="text-xs font-bold uppercase tracking-widest text-text-titles mb-4">{extra.title}</p>
                  <div className="flex flex-col gap-3">
                    {extra.extras.map((option, oIdx) => (
                      <div key={oIdx} className="flex justify-between items-center group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border border-black/30 rounded-full group-hover:border-black transition-colors flex items-center justify-center">
                            {/* Un punto interno sutil al hacer hover */}
                            <div className="w-1.5 h-1.5 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-sm font-medium text-text-titles">{option.label}</span>
                        </div>
                        {option.price && <span className="text-xs text-text-muted font-bold">+${option.price}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* INGREDIENTES */}
              {product.ingredients.length > 0 && (
                <div className="flex flex-col gap-2 px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b border-black/10 hover:bg-black/5 transition-colors cursor-default">
                  <p className="text-xs font-bold uppercase tracking-widest text-text-titles">Ingredientes</p>
                  <p className="text-sm text-text-main font-medium leading-relaxed">
                    {product.ingredients.join(" • ")}
                  </p>
                </div>
              )}

              {/* ALÉRGENOS */}
              {product.allergens.length > 0 && (
                <div className="flex flex-col gap-2 px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b border-black/10 hover:bg-red-50 transition-colors cursor-default">
                  <p className="text-xs font-bold uppercase tracking-widest text-red-600">Alérgenos</p>
                  <p className="text-sm text-red-900 font-medium leading-relaxed">
                    {product.allergens.join(", ")}
                  </p>
                </div>
              )}

              {/* TIEMPO DE PREP */}
              <div className="flex justify-between items-center px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b border-black/10 hover:bg-black/5 transition-colors cursor-default">
                <span className="text-xs font-bold uppercase tracking-widest text-text-titles">Tiempo de Prep.</span>
                <span className="text-sm font-bold text-text-titles">{product.prepTime}</span>
              </div>

              {/* PRESENTACIÓN */}
              <div className="flex justify-between items-center px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b border-black/10 hover:bg-black/5 transition-colors cursor-default">
                <span className="text-xs font-bold uppercase tracking-widest text-text-titles">Presentación</span>
                <span className="text-sm font-bold text-text-titles">{product.weight}</span>
              </div>

            </div>

            {/* PRODUCTOS RELACIONADOS (También te puede gustar) */}
            {relatedWithPrices.length > 0 && (
              <div className="bg-bg-dark/5 pt-8 pb-10 px-6 sm:px-8 lg:px-10 xl:px-12">
                <h2 className="text-xl font-black uppercase italic tracking-tight text-text-titles mb-4">También te puede gustar</h2>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {relatedWithPrices.map((related, idx) => (
                    <Link href={`/menu/${related.slug}`} className="group flex flex-col bg-white rounded-radius border border-black/10 overflow-hidden" key={idx}>
                      <div className="relative w-full aspect-square border-b border-black/10 bg-bg-dark/5">
                        <Image src={related.img} alt={related.name} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-2.5 flex flex-col gap-0.5">
                        <span className="text-text-titles font-bold text-[10px] uppercase leading-tight line-clamp-1 group-hover:underline decoration-black/30 underline-offset-2">{related.name}</span>
                        <span className="text-text-muted text-[11px] font-bold">${related.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* SUCURSALES (En la columna derecha) */}
            <div className="bg-white py-10 px-6 sm:px-8 lg:px-10 xl:px-12 border-t border-black/10">
              <h2 className="text-xl font-black uppercase italic tracking-tight text-text-titles mb-6">Nuestras Sucursales</h2>
              <div className="rounded-radius border border-black/5">
                <LocationsCards className="bg-transparent" locations={locations} />
              </div>
            </div>
          </div>
        </div>

      </main>
      <FooterServer />
    </>
  )
}
