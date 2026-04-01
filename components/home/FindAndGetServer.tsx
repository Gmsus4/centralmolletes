import { unstable_cache } from "next/cache"
import prisma             from "@/lib/prisma"
import { FindAndGet }     from "./FindAndGet"

const getCategories = unstable_cache(
  async () => {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        products: {
          take:   1,
          select: { img: true },
        },
      },
    })

    return categories
      .filter((c) => c.products.length > 0)
      .map((c) => ({
        name: c.name,
        img:  c.products[0].img,
      }))
  },
  ["categories-home"],
  { revalidate: 3600, tags: ["categories"] }
)

export async function FindAndGetServer() {
  const categories = await getCategories()
  return <FindAndGet categories={categories} />
}