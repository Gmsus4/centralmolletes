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
  const publicId = getPublicId(url)
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error("Error al borrar imagen de Cloudinary:", err)
  }
}

function revalidate(slug: string) {
  revalidateTag("locations", {expire: 3600})
  revalidatePath("/")
  revalidatePath("/locations")
  revalidatePath(`/locations/${slug}`)
  revalidatePath("/menu/[slug]", "page")
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const location = await prisma.location.findUnique({ where: { id } })
  if (!location) {
    return NextResponse.json({ error: "Locación no encontrada" }, { status: 404 })
  }

  try {
    return NextResponse.json({ ...location, gallery: JSON.parse(location.gallery) })
  } catch {
    return NextResponse.json({ error: "Error al parsear datos de la locación" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  if (!body.slug || !body.city || !body.name || !body.address) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: slug, city, name, address" },
      { status: 400 }
    )
  }

  const existing = await prisma.location.findUnique({
    where: { id },
    select: { image: true, gallery: true, slug: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Locación no encontrada" }, { status: 404 })
  }

  // Si cambia el slug, verificar que no esté tomado
  if (body.slug !== existing.slug) {
    const conflict = await prisma.location.findUnique({ where: { slug: body.slug } })
    if (conflict) {
      return NextResponse.json(
        { error: `Ya existe una locación con el slug "${body.slug}"` },
        { status: 409 }
      )
    }
  }

  try {
    const location = await prisma.location.update({
      where: { id },
      data: {
        slug:       body.slug,
        city:       body.city,
        name:       body.name,
        address:    body.address,
        addressMin: body.addressMin,
        phone:      body.phone,
        hours:      body.hours,
        image:      body.image ?? "",
        gallery:    JSON.stringify(body.gallery ?? []),
        mapUrl:     body.mapUrl,
        embedUrl:   body.embedUrl,
      },
    })

    // Best effort — no fallan el request
    if (existing.image && existing.image !== body.image) {
      await deleteFromCloudinary(existing.image)
    }

    const oldGallery = JSON.parse(existing.gallery ?? "[]") as string[]
    const removed = oldGallery.filter((url: string) => !(body.gallery ?? []).includes(url))
    await Promise.all(removed.map(deleteFromCloudinary))

    if (existing.slug !== location.slug) {
      revalidatePath(`/locations/${existing.slug}`)
    }

    revalidateTag("locations", {expire: 3600})
    revalidate(location.slug)
    return NextResponse.json({ ...location, gallery: JSON.parse(location.gallery) })

  } catch (err) {
    console.error("Error al actualizar locación:", err)
    return NextResponse.json(
      { error: "Error interno al actualizar la locación" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const location = await prisma.location.findUnique({
    where: { id },
    select: { image: true, gallery: true, slug: true },
  })
  if (!location) {
    return NextResponse.json({ error: "Locación no encontrada" }, { status: 404 })
  }

  try {
    await prisma.location.delete({ where: { id } })

    // Best effort
    if (location.image) await deleteFromCloudinary(location.image)

    const gallery = JSON.parse(location.gallery ?? "[]") as string[]
    await Promise.all(gallery.map(deleteFromCloudinary))

    revalidateTag("locations", {expire: 3600})
    revalidate(location.slug)
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error("Error al eliminar locación:", err)
    return NextResponse.json(
      { error: "Error interno al eliminar la locación" },
      { status: 500 }
    )
  }
}