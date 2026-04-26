import { MenuComponent } from "@/components/menu/Menu"
import { Suspense } from "react"
import { Metadata } from "next"
import prisma from "@/lib/prisma"

import dynamicImport from "next/dynamic"
import { FooterServer } from "@/components/shared/FooterServer"
import { NavbarServer } from "@/components/shared/NavbarServer"

export const revalidate = 3600 

const OrderOnline = dynamicImport(() => import("@/components/shared/OrderOnline").then(m => ({ default: m.OrderOnline })))
const MarqueeStrip = dynamicImport(() => import("@/components/ui/MarqueeStrip").then(m => ({ default: m.MarqueeStrip })))

export const metadata: Metadata = {
  title: "Menú",
  description: "Explora molletes, chilaquiles, café de especialidad y más. Menú completo de Central Molletes en Etzatlán, Jalisco.",
  openGraph: {
    title: "Menú — Central Molletes",
    description: "Explora molletes, chilaquiles, café de especialidad y más.",
    url: "/menu",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}

export default async function Products() {
  const [rawProducts, categories, promotions] = await Promise.all([
    prisma.product.findMany({
      orderBy: { category: { order: "asc" } },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.promotion.findMany({
      where: {
        isActive: true,
        type: "DISCOUNT",
        startsAt: { lte: new Date() },
        endsAt:   { gte: new Date() },
      },
      include: { products: { select: { id: true } } },
    }),
  ])

  const discountMap = new Map<string, number>()
    for (const promo of promotions) {
      for (const product of promo.products) {
        const current = discountMap.get(product.id) ?? 0
        if ((promo.discount ?? 0) > current) {
          discountMap.set(product.id, promo.discount!)
        }
      }
    }

    const products = rawProducts.map((p) => {
      const discount = discountMap.get(p.id)
      return {
        ...p,
        category:      p.category.name,
        tag:           p.tag ?? undefined,
        ingredients:   JSON.parse(p.ingredients) as string[],
        availability:  p.availability,
        allergens:     JSON.parse(p.allergens) as string[],
        originalPrice: discount ? p.price : undefined,
        price:         discount ? Math.round(p.price * (1 - discount / 100)) : p.price,
      }
    })
  return (
    <>
      <NavbarServer />
      <main>
        <Suspense fallback={
          <div className="w-full py-24 flex justify-center">
            <span className="text-text-main/40 text-sm uppercase tracking-widest">Cargando menú...</span>
          </div>
        }>
          <MenuComponent products={products} categories={categories} />
        </Suspense>
        {/* <OrderOnline /> */}
        <MarqueeStrip />
      </main>
      <FooterServer />
    </>
  )
}