import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getContent(key: string, fallback = ""): Promise<string> {
  const item = await prisma.siteContent.findUnique({ where: { key } })
  return item?.value ?? fallback
}

// Para componentes normales (solo valor)
export async function getSectionContent(
  section: string
): Promise<Record<string, string>> {
  const items = await prisma.siteContent.findMany({ where: { section } })
  return Object.fromEntries(items.map((i) => [i.key, i.value]))
}

// Para componentes editables por admin (valor + id)
export async function getSectionContentWithIds(
  section: string
): Promise<Record<string, { value: string; id: string }>> {
  const items = await prisma.siteContent.findMany({ where: { section } })
  return Object.fromEntries(items.map((i) => [i.key, { value: i.value, id: i.id }]))
}

export function revalidateSiteContent() {
  revalidatePath("/")
  revalidatePath("/nosotros")
}