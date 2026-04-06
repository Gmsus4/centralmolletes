import prisma from "@/lib/prisma"
import PromotionForm from "../PromotionForm"
import { notFound } from "next/navigation"

export default async function EditPromotionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [promotion, products] = await Promise.all([
    prisma.promotion.findUnique({ where: { id }, include: { products: true } }),
    prisma.product.findMany({ select: { id: true, name: true, tag: true, category: { select: { name: true } } }, orderBy: { name: "asc" } }),
  ])

  if (!promotion) notFound()

  const mappedProducts = products.map((p) => ({
    id:       p.id,
    name:     p.name,
    tag:      p.tag,
    category: p.category.name,
  }))

  return (
    <PromotionForm promotion={JSON.parse(JSON.stringify(promotion))} products={mappedProducts} />
  )
}