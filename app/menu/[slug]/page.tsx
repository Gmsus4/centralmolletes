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
import { LocationsCards } from "@/components/locations/Locations"
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
      <main className="min-h-screen bg-background relative">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* ── COLUMNA IZQUIERDA: IMAGEN ── */}
          <div className="relative w-full h-[60vh] lg:h-dvh 2xl:col-span-9 xl:col-span-8 lg:col-span-7 lg:sticky col-span-12 lg:top-0 bg-background">
            <Image 
              src={product.img} 
              alt={product.name} 
              fill 
              priority 
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover" 
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-background opacity-5" />
            
            {/* Back Button */}
            {/* <div className="absolute left-6 top-6 z-50 sm:left-10 sm:top-10">
              <BackButton />
            </div> */}

            {/* Acciones flotantes sobre la imagen */}
            <div className="absolute right-6 bottom-6 z-50 sm:right-10 sm:bottom-10 flex flex-row items-end gap-3">
              {/* ─────── Share Button ─────── */}
              <ShareButton title={product.name} description="¡Tienes que probar este platillo de Central de Molletes!" />

              {/* Edit Button */}
              <EditButton productId={raw.id} />
            </div>
          </div>

          {/* ── COLUMNA DERECHA: INFORMACIÓN ── */}
          <div className="col-span-12 2xl:col-span-3 xl:col-span-4 lg:col-span-5 bg-background flex flex-col relative z-10 border-l border-black/10 pb-10 lg:pb-0 lg:pt-16 pt-0">
            <div className="flex flex-col px-6 py-6 sm:px-8 lg:p-10 xl:p-12">
              
              {/* CATEGORY & TAGS */}
              <div className="flex flex-row items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  {product.category}
                </p>
                <div className="flex flex-row gap-2">
                  {discount && (
                    <span className="rounded-radius px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                      -{discount}%
                    </span>
                  )}
                  {product.tag && (
                    <span className="border border rounded-radius px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                      {product.tag}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col">  
                {/* TITLE */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-title italic tracking-tighter leading-[0.95] mb-2">
                  {product.name}
                </h1>

                {/* PRICE */}
                <div className="flex flex-row items-baseline gap-3 mb-6 mt-6">
                  <span className="text-2xl sm:text-5xl font-bold tracking-tight">${product.price}</span>
                  {originalPrice && <span className="text-base font-medium opacity-50 line-through">${originalPrice}</span>}
                </div>
              </div>    

              {/* DESCRIPTION */}
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                {product.descLong}
              </p>
            </div>

            {/* ── LISTA DE DETALLES Y EXTRAS (Estilo Acordeón a ancho completo) ── */}
            <div className="flex flex-col border-t mt-auto">
              
              {/* EXTRAS */}
              {extras.map((extra, idx) => (
                <div key={`extra-${idx}`} className="flex flex-col px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b">
                  <p className="text-xs font-bold uppercase tracking-widest mb-4">{extra.title}</p>
                  <div className="flex flex-col gap-3">
                    {extra.extras.map((option, oIdx) => (
                      <div key={oIdx} className="flex justify-between items-center group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border rounded-full transition-colors flex items-center justify-center">
                            {/* Un punto interno sutil al hacer hover */}
                            <div className="w-1.5 h-1.5 bg-background rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-sm font-medium opacity-85">{option.label}</span>
                        </div>
                        {option.price && <span className="text-xs font-bold opacity-85">+${option.price}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* INGREDIENTES */}
              {product.ingredients.length > 0 && (
                <div className="flex flex-col gap-2 px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b transition-colors cursor-default">
                  <p className="text-xs font-bold uppercase tracking-widest">Ingredientes</p>
                  <p className="text-sm font-medium leading-relaxed opacity-85">
                    {product.ingredients.join(" • ")}
                  </p>
                </div>
              )}

              {/* ALÉRGENOS */}
              {product.allergens.length > 0 && (
                <div className="flex flex-col gap-2 px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b border-black/10 transition-colors cursor-default">
                  <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-200">Alérgenos</p>
                  <p className="text-sm text-red-900 dark:text-red-300 font-medium leading-relaxed">
                    {product.allergens.join(", ")}
                  </p>
                </div>
              )}

              {/* TIEMPO DE PREP */}
              <div className="flex justify-between items-center px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b transition-colors cursor-default">
                <span className="text-xs font-bold uppercase tracking-widest">Tiempo de Prep.</span>
                <span className="text-sm font-bold">{product.prepTime}</span>
              </div>

              {/* PRESENTACIÓN */}
              <div className="flex justify-between items-center px-6 sm:px-8 lg:px-10 xl:px-12 py-5 border-b transition-colors cursor-default">
                <span className="text-xs font-bold uppercase tracking-widest">Presentación</span>
                <span className="text-sm font-bold">{product.weight}</span>
              </div>

            </div>

            {/* PRODUCTOS RELACIONADOS (También te puede gustar) */}
            {relatedWithPrices.length > 0 && (
              <div className="bg-background pt-8 pb-10 px-6 sm:px-8 lg:px-10 xl:px-12">
                <h2 className="text-xl font-black uppercase italic tracking-tight mb-4">También te puede gustar</h2>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {relatedWithPrices.map((related, idx) => (
                    <Link href={`/menu/${related.slug}`} className="group flex flex-col bg-background rounded-radius border overflow-hidden" key={idx}>
                      <div className="relative w-full aspect-square border-b">
                        <Image src={related.img} alt={related.name} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-2.5 flex flex-col gap-0.5">
                        <span className="font-bold text-[10px] uppercase leading-tight line-clamp-1 group-hover:underline underline-offset-2">{related.name}</span>
                        <span className="text-[11px] font-bold opacity-85">${related.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* SUCURSALES (En la columna derecha) */}
            <div className="bg-background py-10 px-6 sm:px-8 lg:px-10 xl:px-12 border-t">
              <h2 className="text-xl font-black uppercase italic tracking-tight mb-6">Nuestras Sucursales</h2>
              <div className="rounded-radius border">
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
