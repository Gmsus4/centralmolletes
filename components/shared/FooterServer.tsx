// FooterServer.tsx
import prisma from "@/lib/prisma"
import { Footer } from "./Footer"

export async function FooterServer() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { name: true },
  })

  const socialLinks = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
  })

  return <Footer categories={categories.map((c) => c.name)} links={socialLinks ?? []} />
}