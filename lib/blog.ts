import { revalidatePath } from "next/cache"
import prisma from "./prisma"

// lib/blog.ts
export async function autoPublishScheduled() {
  // Primero obtén los slugs que vas a publicar
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

  revalidatePath("/blog")
  revalidatePath("/admin/blog")
  // Invalida cada artículo publicado individualmente
  toPublish.forEach(({ slug }) => revalidatePath(`/blog/${slug}`))
}