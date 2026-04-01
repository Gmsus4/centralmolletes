import prisma from "@/lib/prisma"
import ProductForm from "../ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [product, categories, allProducts] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({ select: { tag: true } }),
  ])

  if (!product) notFound()

  const existingCategories = categories.map((c) => c.name)
  const existingTags = Array.from(
    new Set(allProducts.map((p) => p.tag).filter((t): t is string => t !== null && t !== ""))
  ).sort()

  return (
    <ProductForm
      product={{
        ...product,
        category:    product.category.name,
        tag:         product.tag ?? "",
        ingredients: JSON.parse(product.ingredients),
        allergens:   JSON.parse(product.allergens),
      }}
      existingCategories={existingCategories}
      existingTags={existingTags}
    />
  )
}