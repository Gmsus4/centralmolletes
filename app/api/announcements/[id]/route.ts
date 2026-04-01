import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { AnnouncementSchema } from "@/lib/validators/announcement"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const announcement = await prisma.announcement.findUnique({ where: { id } })

  if (!announcement) {
    return NextResponse.json({ error: "Aviso no encontrado" }, { status: 404 })
  }

  return NextResponse.json(announcement)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing = await prisma.announcement.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Aviso no encontrado" }, { status: 404 })
  }

  try {
    const body = await req.json()
    const parsed = AnnouncementSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const announcement = await prisma.announcement.update({
      where: { id },
        data: {
        ...parsed.data,
        startsAt: new Date(parsed.data.startsAt),
        endsAt:   parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
      },
    })

    revalidatePath("/")

    return NextResponse.json(announcement)
  } catch (error) {
    console.error("PUT_ANNOUNCEMENT_ERROR", error)
    return NextResponse.json({ error: "Error interno al actualizar el aviso" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing = await prisma.announcement.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Aviso no encontrado" }, { status: 404 })
  }

  try {
    await prisma.announcement.delete({ where: { id } })

    revalidatePath("/")

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DELETE_ANNOUNCEMENT_ERROR", error)
    return NextResponse.json({ error: "Error interno al eliminar el aviso" }, { status: 500 })
  }
}