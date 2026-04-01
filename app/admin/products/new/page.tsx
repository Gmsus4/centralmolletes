import prisma from "@/lib/prisma"
import ProductForm from "../ProductForm"

export default async function NewProductPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({ select: { tag: true } }),
  ])

  const existingCategories = categories.map((c) => c.name)
  const existingTags = Array.from(
    new Set(products.map((p) => p.tag).filter((t): t is string => t !== null && t !== ""))
  ).sort()

  return (
    <ProductForm
      existingCategories={existingCategories}
      existingTags={existingTags}
    />
  )
}