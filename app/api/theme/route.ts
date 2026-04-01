import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(themes)
  } catch (err) {
    console.error("Error al obtener themes:", err)
    return NextResponse.json(
      { error: "Error al obtener los temas" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const body = await req.json()

  const requiredFields = [
    "name",
    "bgBody", "bgDark",
    "textMain", "textTitles", "textMuted", "textInvert",
    "brandPrimary", "brandPrimaryHover", "brandContrast", "brandContrastHover",
    "borderColor", "statusError", "shadowColor",
    "radius", "radiusFull",
    "fontTitle", "fontBody",
  ]

  const missing = requiredFields.filter(field => !body[field])
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Faltan campos requeridos: ${missing.join(", ")}` },
      { status: 400 }
    )
  }

  try {
    const theme = await prisma.theme.create({
      data: {
        name: body.name,
        bgBody: body.bgBody,
        bgDark: body.bgDark,
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

    return NextResponse.json(theme, { status: 201 })

  } catch (err) {
    console.error("Error al crear theme:", err)
    return NextResponse.json(
      { error: "Error interno al crear el tema" },
      { status: 500 }
    )
  }
}