import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const items = await prisma.siteContent.findMany({
      orderBy: [{ section: "asc" }, { key: "asc" }],
    })
    return NextResponse.json(items)
  } catch (err) {
    console.error("Error al obtener contenido:", err)
    return NextResponse.json({ error: "Error al obtener el contenido" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.key || !body.value || !body.section || !body.label || !body.type) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: key, value, section, label, type" },
      { status: 400 }
    )
  }

  const existing = await prisma.siteContent.findUnique({ where: { key: body.key } })
  if (existing) {
    return NextResponse.json(
      { error: `Ya existe un item con la key "${body.key}"` },
      { status: 409 }
    )
  }

  try {
    const item = await prisma.siteContent.create({
      data: {
        key:     body.key,
        value:   body.value,
        section: body.section,
        label:   body.label,
        type:    body.type,
      },
    })
    revalidateSiteContent()
    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    console.error("Error al crear item:", err)
    return NextResponse.json({ error: "Error interno al crear el item" }, { status: 500 })
  }
}

function revalidateSiteContent() {
  const { revalidatePath } = require("next/cache")
  revalidatePath("/")
  revalidatePath("/nosotros")
}