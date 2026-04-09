import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getContent(key: string, fallback = ""): Promise<string> {
  const item = await prisma.siteContent.findUnique({ where: { key } })
  return item?.value ?? fallback
}

export async function getSectionContent(
  section: string
): Promise<Record<string, string>> {
  const items = await prisma.siteContent.findMany({ where: { section } })
  return Object.fromEntries(items.map((i) => [i.key, i.value]))
}

export function revalidateSiteContent() {
  revalidatePath("/")
  revalidatePath("/nosotros")
}