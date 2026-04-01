import { NextResponse } from "next/server"
import { setActiveTheme } from "@/lib/theme"
import { revalidatePath } from "next/cache"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params  // ← await aquí
  await setActiveTheme(id)
  revalidatePath("/", "layout")
  return NextResponse.json({ ok: true })
}