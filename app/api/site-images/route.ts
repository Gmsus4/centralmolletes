import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"

function revalidate() {
  revalidatePath("/")
  revalidatePath("/about")
  revalidateTag("site-images", { expire: 3600 })
}

// GET — todas las imágenes del sitio
export async function GET() {
  try {
    const images = await prisma.siteImage.findMany({
      orderBy: [{ section: "asc" }, { order: "asc" }],
    })
    return NextResponse.json(images)
  } catch (err) {
    console.error("Error al obtener imágenes del sitio:", err)
    return NextResponse.json({ error: "Error al obtener las imágenes" }, { status: 500 })
  }
}

// POST — crear nueva imagen
export async function POST(req: Request) {
  const body = await req.json()

  if (!body.section || !body.src) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: section, src" },
      { status: 400 }
    )
  }

  const orderConflict = await prisma.siteImage.findFirst({
    where: { section: body.section, order: body.order },
  })
  if (orderConflict) {
    return NextResponse.json(
      { error: `Ya existe una imagen con orden ${body.order} en esta sección` },
      { status: 409 }
    )
  }

  try {
    const image = await prisma.siteImage.create({
      data: {
        section: body.section,
        src:     body.src,
        alt:     body.alt   ?? "",
        order:   body.order ?? 0,
      },
    })

    revalidate()
    return NextResponse.json(image, { status: 201 })
  } catch (err) {
    console.error("Error al crear imagen:", err)
    return NextResponse.json({ error: "Error interno al crear la imagen" }, { status: 500 })
  }
}