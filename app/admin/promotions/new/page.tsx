import prisma from "@/lib/prisma"
import PromotionForm from "../PromotionForm"

export default async function NewPromotionPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true ,tag: true, category: {select: {name: true}} },
    orderBy: { name: "asc" },
  })

  const mappedProducts = products.map((p) => ({
    id:       p.id,
    name:     p.name,
    tag:      p.tag,
    category: p.category.name,
  }))

  return <PromotionForm products={mappedProducts} />
}