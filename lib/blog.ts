import { revalidatePath, revalidateTag } from "next/cache"
import prisma from "./prisma"

export async function autoPublishScheduled() {
  const toPublish = await prisma.blog.findMany({
    where: {
      status:      "scheduled",
      publishedAt: { lte: new Date() },
    },
    select: { slug: true },
  })

  if (toPublish.length === 0) return

  await prisma.blog.updateMany({
    where: {
      status:      "scheduled",
      publishedAt: { lte: new Date() },
    },
    data: { status: "published" },
  })

  // revalidateTag invalida todo lo que use ese tag, sin importar desde dónde se llame
  revalidateTag("blog", "/")
  toPublish.forEach(({ slug }) => revalidatePath(`/blog/${slug}`))
}