export const dynamic = "force-dynamic"

import { unstable_noStore as noStore } from "next/cache"
import prisma from "@/lib/prisma"
import { CategoriesTable } from "./components/CategoriesTable"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | Categorías",
}

export default async function CategoriasPage() {
  noStore()

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  })

  return (
    <LayoutAdminSection namePage="Categorías">
      <CategoriesTable categories={categories} />
    </LayoutAdminSection>
  )
}