import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

function revalidate() {
  revalidatePath("/")
  revalidatePath("/nosotros")
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const item = await prisma.siteContent.findUnique({ where: { id } })
  if (!item) {
    return NextResponse.json({ error: "Item no encontrado" }, { status: 404 })
  }
  return NextResponse.json(item)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body   = await req.json()

  if (!body.key || !body.value || !body.section || !body.label || !body.type) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: key, value, section, label, type" },
      { status: 400 }
    )
  }

  const existing = await prisma.siteContent.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Item no encontrado" }, { status: 404 })
  }

  // key única: no puede colisionar con otro registro distinto
  const keyConflict = await prisma.siteContent.findFirst({
    where: { key: body.key, NOT: { id } },
  })
  if (keyConflict) {
    return NextResponse.json(
      { error: `La key "${body.key}" ya está en uso` },
      { status: 409 }
    )
  }

  try {
    const item = await prisma.siteContent.update({
      where: { id },
      data: {
        key:     body.key,
        value:   body.value,
        section: body.section,
        label:   body.label,
        type:    body.type,
      },
    })
    revalidate()
    return NextResponse.json(item)
  } catch (err) {
    console.error("Error al actualizar item:", err)
    return NextResponse.json({ error: "Error interno al actualizar el item" }, { status: 500 })
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const item = await prisma.siteContent.findUnique({ where: { id } })
  if (!item) {
    return NextResponse.json({ error: "Item no encontrado" }, { status: 404 })
  }

  try {
    await prisma.siteContent.delete({ where: { id } })
    revalidate()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error al eliminar item:", err)
    return NextResponse.json({ error: "Error interno al eliminar el item" }, { status: 500 })
  }
}