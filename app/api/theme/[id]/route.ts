import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

function revalidate() {
  revalidatePath("/", "layout")
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const theme = await prisma.theme.findUnique({ where: { id } })

  if (!theme) {
    return NextResponse.json({ error: "Theme no encontrado" }, { status: 404 })
  }
  return NextResponse.json(theme)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const existing = await prisma.theme.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Theme no encontrado" }, { status: 404 })
  }

  try {
    const theme = await prisma.theme.update({
      where: { id },
      data: {
        name: body.name,
        bgBody: body.bgBody,
        bgDark:  body.bgDark,
        textMain:   body.textMain,
        textTitles: body.textTitles,
        textMuted:  body.textMuted,
        textInvert: body.textInvert,
        brandPrimary:       body.brandPrimary,
        brandPrimaryHover:  body.brandPrimaryHover,
        brandContrast:      body.brandContrast,
        brandContrastHover: body.brandContrastHover,
        borderColor: body.borderColor,
        statusError: body.statusError,
        shadowColor: body.shadowColor,
        radius:     body.radius,
        radiusFull: body.radiusFull,
        fontTitle: body.fontTitle,
        fontBody:  body.fontBody,
      },
    })

    revalidate()
    return NextResponse.json(theme)

  } catch (err) {
    console.error("Error al actualizar theme:", err)
    return NextResponse.json(
      { error: "Error interno al actualizar el tema" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing = await prisma.theme.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Theme no encontrado" }, { status: 404 })
  }

  try {
    await prisma.theme.delete({ where: { id } })
    revalidate()
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error("Error al eliminar theme:", err)
    return NextResponse.json(
      { error: "Error interno al eliminar el tema" },
      { status: 500 }
    )
  }
}