export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { ProductsTable } from "../components/ProductsTable"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"

// export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin | Productos",
}

export default async function ProductsPage(){
  const products = await prisma.product.findMany({
    orderBy: { category: { order: "asc" } },
    include: { category: true },
  })

  const parsed = products.map((p) => ({
    ...p,
    category: p.category.name,
  }))

  const categories = Array.from(new Set(parsed.map((p) => p.category))).sort()
  return (
    <LayoutAdminSection namePage="Productos" maxWidth="max-w-6xl" link={{ label: "Nuevo producto", href: "/admin/products/new" }}>
        <Suspense>
          <Toast message="¡Producto guardado correctamente!" type="success" triggerParam="success"/>
          <Toast message="Producto eliminado" type="warning" triggerParam="deleted"/>
        </Suspense>
        <ProductsTable products={parsed} categories={categories} />
    </LayoutAdminSection>
  )
}
