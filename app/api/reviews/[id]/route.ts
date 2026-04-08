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
  revalidateTag("reviews", { expire: 3600 })
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const review = await prisma.review.findUnique({ where: { id } })
  if (!review) {
    return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 })
  }

  return NextResponse.json(review)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body   = await req.json()

  if (!body.author || !body.role || !body.body || !body.rating) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: author, role, body, rating" },
      { status: 400 }
    )
  }

  if (body.rating < 1 || body.rating > 5) {
    return NextResponse.json(
      { error: "El rating debe estar entre 1 y 5" },
      { status: 400 }
    )
  }

  const existing = await prisma.review.findUnique({
    where:  { id },
    select: { photo: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 })
  }

  try {
    const review = await prisma.review.update({
      where: { id },
      data: {
        author: body.author,
        role:   body.role,
        body:   body.body,
        photo:  body.photo  ?? "",
        rating: body.rating,
        status: body.status ?? "visible",
        order:  body.order  ?? 0,
      },
    })

    // Borrar foto anterior de Cloudinary si cambió
    if (existing.photo && existing.photo !== body.photo) {
      await deleteFromCloudinary(existing.photo)
    }

    revalidate()
    return NextResponse.json(review)
  } catch (err) {
    console.error("Error al actualizar reseña:", err)
    return NextResponse.json({ error: "Error interno al actualizar la reseña" }, { status: 500 })
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const review = await prisma.review.findUnique({
    where:  { id },
    select: { photo: true },
  })
  if (!review) {
    return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 })
  }

  try {
    await prisma.review.delete({ where: { id } })

    if (review.photo) await deleteFromCloudinary(review.photo)

    revalidate()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error al eliminar reseña:", err)
    return NextResponse.json({ error: "Error interno al eliminar la reseña" }, { status: 500 })
  }
}