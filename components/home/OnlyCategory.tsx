import prisma from "@/lib/prisma"
import { getSectionContent, getSectionContentWithIds } from "@/lib/siteContent"
import { IconSparkles } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { unstable_cache } from "next/cache"
import { AdminEditWrapper } from "../shared/AdminEditWrapper"

export const revalidate = 3600

// ── Caché de promoción activa para un producto ──
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

export const OnlyCategory = async () => {
  const tagData = await getSectionContentWithIds("featured_products")
  const targetTag = tagData["tag.name"] || "Destacados"
  const title = tagData["featured.title"]

  const products = await prisma.product.findMany({
    where: { tag: targetTag.value },
    take: 4,
  })

  // Resolver precios con descuento en paralelo
  const productsWithPrices = await Promise.all(
    products.map(async (item) => {
      const promo = await getActivePromotion(item.id)
      const discount = promo?.discount ?? null
      return {
        ...item,
        discount,
        originalPrice: discount ? item.price : null,
        finalPrice: discount ? Math.round(item.price * (1 - discount / 100)) : item.price,
      }
    }),
  )

  return (
    <div
      className="bg-bg-dark xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-16 gap-12 px-6 relative"
      style={{
        backgroundImage: "url('/hero.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-bg-dark" style={{ opacity: 0.75 }} />

      {/* Header */}
      <div className="z-10 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px bg-bg-dark/25" />
          <AdminEditWrapper href={`/admin/site-content/${targetTag?.id}`} tooltip="Editar Tag" side="right">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-primary/90">{targetTag?.value}</span>
          </AdminEditWrapper>
          <span className="w-8 h-px bg-bg-dark/25" />
        </div>
        <AdminEditWrapper href={`/admin/site-content/${title?.id}`} tooltip="Editar título" side="bottom">
          <h2 className="text-brand-primary font-title text-center text-3xl md:text-6xl leading-tight">{title?.value}</h2>
        </AdminEditWrapper>
      </div>

      {/* Grid */}
      <div className="z-10 lg:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 xs:grid-cols-2 gap-6 lg:gap-10 px-0 xs:px-4 lg:px-0 w-full">
        {productsWithPrices.map((item, idx) => (
          <Link href={`/menu/${item.slug}`} className="grid grid-cols-2 xs:grid-cols-1 gap-2 xs:gap-1 group" key={item.slug}>
            <div className="relative w-full rounded-radius aspect-square overflow-hidden shrink-0 bg-brand-primary grid place-items-center col-span-2">
              <Image
                width={600}
                height={600}
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading={idx === 0 ? "eager" : "lazy"}
                priority={idx === 0}
                src={item.img}
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-130"
                alt={item.desc}
              />

              <div aria-hidden="true" className="absolute top-3 left-3 flex items-center gap-1 bg-brand-primary text-[9px] uppercase tracking-widest px-2 py-1 rounded-full">
                <IconSparkles size={10} className="text-brand-contrast" />
                <span className="pt-px text-brand-contrast font-bold">{targetTag?.value}</span>
              </div>

              {/* Badge de descuento */}
              {item.discount && <span className="text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 bg-bg-dark text-text-invert absolute right-3 top-3 rounded-full">-{item.discount}%</span>}
            </div>

            <div className="flex w-full justify-between items-center col-span-2 pt-2 px-1">
              <h3 className="text-brand-primary text-xl lg:text-base">{item.name}</h3>
              <div className="flex items-baseline gap-2">
                {item.originalPrice && <span className="text-brand-primary/40 line-through text-sm font-title">${item.originalPrice}</span>}
                <span className="text-brand-primary font-bold text-xl">${item.finalPrice}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
