import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

function revalidate() {
  revalidatePath("/contact")
}

// GET — un horario específico
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const horario = await prisma.schedule.findUnique({
    where: { id },
    include: { shifts: true },
  })

  if (!horario) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  }

  return NextResponse.json(horario)
}

// PUT — editar horario y reemplazar sus turnos
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  // 1. Verificar que el horario existe
  const existing = await prisma.schedule.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Horario no encontrado" }, { status: 404 })
  }

  // 2. Si cambia el día, verificar que no esté tomado por OTRO horario
  if (body.dayOfWeek && body.dayOfWeek !== existing.dayOfWeek) {
    const conflict = await prisma.schedule.findUnique({
      where: { dayOfWeek: body.dayOfWeek },
    })
    if (conflict) {
      return NextResponse.json(
        { error: `Ya existe un horario para el ${body.dayOfWeek}` },
        { status: 409 }
      )
    }
  }

  try {
    const horario = await prisma.schedule.update({
      where: { id },
      data: {
        dayOfWeek: body.dayOfWeek,
        isActive:  body.isActive,
        shifts: {
          deleteMany: {},
          create: (body.shifts ?? []).map((s: { name?: string; openTime: string; closeTime: string }) => ({
            name:      s.name ?? null,
            openTime:  s.openTime,
            closeTime: s.closeTime,
          })),
        },
      },
      include: { shifts: true },
    })

    revalidate()
    return NextResponse.json(horario)

  } catch (err) {
    console.error("Error al actualizar horario:", err)
    return NextResponse.json(
      { error: "Error interno al actualizar el horario" },
      { status: 500 }
    )
  }
}

// DELETE — eliminar horario y sus turnos
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing = await prisma.schedule.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Horario no encontrado" }, { status: 404 })
  }

  try {
    await prisma.shift.deleteMany({ where: { scheduleId: id } })
    await prisma.schedule.delete({ where: { id } })

    revalidate()
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error("Error al eliminar horario:", err)
    return NextResponse.json(
      { error: "Error interno al eliminar el horario" },
      { status: 500 }
    )
  }
}