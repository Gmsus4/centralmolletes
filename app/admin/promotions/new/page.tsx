import prisma from "@/lib/prisma"
import PromotionForm from "../PromotionForm"

export default async function NewPromotionPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return <PromotionForm products={products} />
}