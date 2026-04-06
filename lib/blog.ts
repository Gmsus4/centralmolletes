import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function autoPublishScheduled() {
  const updated = await prisma.blog.updateMany({
    where: {
      status:      "scheduled",
      publishedAt: { lte: new Date() },
    },
    data: { status: "published" },
  })
  if (updated.count > 0) {
    revalidatePath("/blog")
    revalidatePath("/admin/blog")
  }
}