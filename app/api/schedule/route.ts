import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const horarios = await prisma.schedule.findMany({
      include: { shifts: true },
      orderBy: { dayOfWeek: "asc" },
    })
    return NextResponse.json(horarios)
  } catch (err) {
    console.error("Error al obtener horarios:", err)
    return NextResponse.json(
      { error: "Error al obtener los horarios" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.dayOfWeek) {
      return NextResponse.json(
        { error: "El día de la semana es requerido" },
        { status: 400 }
      )
    }

    // Verificar duplicado antes de intentar crear
    const existing = await prisma.schedule.findUnique({
      where: { dayOfWeek: body.dayOfWeek },
    })

    if (existing) {
      return NextResponse.json(
        { error: `Ya existe un horario para ese día` },
        { status: 409 }
      )
    }

    const horario = await prisma.schedule.create({
      data: {
        dayOfWeek: body.dayOfWeek,
        isActive:  body.isActive ?? true,
        shifts: {
          create: (body.shifts ?? []).map((s: {
            name?: string
            openTime: string
            closeTime: string
          }) => ({
            name:      s.name      ?? null,
            openTime:  s.openTime,
            closeTime: s.closeTime,
          })),
        },
      },
      include: { shifts: true },
    })
    
    revalidatePath("/")  
    revalidatePath("/contact")

    return NextResponse.json(horario, { status: 201 })

  } catch (err: any) {
    // Por si el findUnique falla en una race condition y llega P2002
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un horario para ese día" },
        { status: 409 }
      )
    }

    console.error("Error al crear horario:", err)
    return NextResponse.json(
      { error: "Error interno al guardar el horario" },
      { status: 500 }
    )
  }
}