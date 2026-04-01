import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { AnnouncementSchema } from "@/lib/validators/announcement"

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(announcements)
  } catch (error) {
    console.error("GET_ANNOUNCEMENTS_ERROR", error)
    return NextResponse.json({ error: "Error al obtener los avisos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = AnnouncementSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const announcement = await prisma.announcement.create({
      data: {
        ...parsed.data,
        startsAt: new Date(parsed.data.startsAt),
        endsAt:   parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
      },
    })

    revalidatePath("/")

    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    console.error("POST_ANNOUNCEMENT_ERROR", error)
    return NextResponse.json({ error: "Error interno al crear el aviso" }, { status: 500 })
  }
}