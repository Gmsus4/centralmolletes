import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function getPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

async function deleteFromCloudinary(url: string) {
  if (!url) return
  const publicId = getPublicId(url)
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error("Error al borrar imagen de Cloudinary:", err)
  }
}

function revalidate() {
  revalidatePath("/")
  revalidatePath("/about")
  revalidateTag("site-images", { expire: 3600 })
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const image = await prisma.siteImage.findUnique({ where: { id } })
  if (!image) {
    return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 })
  }

  return NextResponse.json(image)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body   = await req.json()

  if (!body.section || !body.src) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: section, src" },
      { status: 400 }
    )
  }

  const existing = await prisma.siteImage.findUnique({
    where:  { id },
    select: { src: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 })
  }

  const orderConflict = await prisma.siteImage.findFirst({
    where: { section: body.section, order: body.order, NOT: { id } },
  })
  if (orderConflict) {
    return NextResponse.json(
      { error: `Ya existe una imagen con orden ${body.order} en esta sección` },
      { status: 409 }
    )
  }

  try {
    const image = await prisma.siteImage.update({
      where: { id },
      data: {
        section: body.section,
        src:     body.src,
        alt:     body.alt   ?? "",
        order:   body.order ?? 0,
      },
    })

    if (existing.src && existing.src !== body.src) {
      await deleteFromCloudinary(existing.src)
    }

    revalidate()
    return NextResponse.json(image)
  } catch (err) {
    console.error("Error al actualizar imagen:", err)
    return NextResponse.json({ error: "Error interno al actualizar la imagen" }, { status: 500 })
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const image = await prisma.siteImage.findUnique({
    where:  { id },
    select: { src: true },
  })
  if (!image) {
    return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 })
  }

  try {
    await prisma.siteImage.delete({ where: { id } })

    if (image.src) await deleteFromCloudinary(image.src)

    revalidate()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error al eliminar imagen:", err)
    return NextResponse.json({ error: "Error interno al eliminar la imagen" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body   = await req.json()

  if (typeof body.order !== "number") {
    return NextResponse.json({ error: "Order inválido" }, { status: 400 })
  }

  try {
    const image = await prisma.siteImage.update({
      where: { id },
      data:  { order: body.order },
    })
    revalidate()
    return NextResponse.json(image)
  } catch {
    return NextResponse.json({ error: "Error al actualizar orden" }, { status: 500 })
  }
}