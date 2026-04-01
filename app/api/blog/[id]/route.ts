import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"

function parsePublishedAt(datetimeLocal?: string, tzOffset?: number): Date {
  if (!datetimeLocal) return new Date()
  const local = new Date(datetimeLocal)
  if (typeof tzOffset === "number") {
    const serverOffset = 0
    const diffMs = (tzOffset - serverOffset) * 60 * 1000
    return new Date(local.getTime() + diffMs)
  }
  return local
}

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
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const post = await prisma.blog.findUnique({ where: { id } })
  if (!post) {
    return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
  }

  try {
    return NextResponse.json({
      ...post,
      gallery:  JSON.parse(post.gallery),
      tags:     JSON.parse(post.tags),
      sections: JSON.parse(post.sections),
    })
  } catch {
    return NextResponse.json({ error: "Error al parsear datos del artículo" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body   = await req.json()

  if (!body.slug || !body.title || !body.subtitle || !body.coverImage || !body.category) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: slug, title, subtitle, coverImage, category" },
      { status: 400 }
    )
  }

  const existing = await prisma.blog.findUnique({
    where:  { id },
    select: { coverImage: true, gallery: true, sections: true, slug: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
  }

  if (body.slug !== existing.slug) {
    const conflict = await prisma.blog.findUnique({ where: { slug: body.slug } })
    if (conflict) {
      return NextResponse.json(
        { error: `Ya existe un artículo con el slug "${body.slug}"` },
        { status: 409 }
      )
    }
  }

  try {
    const post = await prisma.blog.update({
      where: { id },
      data: {
        slug:            body.slug,
        title:           body.title,
        subtitle:        body.subtitle,
        coverImage:      body.coverImage,
        gallery:         JSON.stringify(body.gallery  ?? []),
        category:        body.category,
        tags:            JSON.stringify(body.tags     ?? []),
        sections:        JSON.stringify(body.sections ?? []),
        status:          body.status          ?? "published",
        author:          body.author          ?? "",
        metaDescription: body.metaDescription ?? "",
        publishedAt:     body.publishedAt
          ? parsePublishedAt(body.publishedAt, body.tzOffset)
          : undefined,
      },
    })

    if (existing.coverImage && existing.coverImage !== body.coverImage) {
      await deleteFromCloudinary(existing.coverImage)
    }

    const oldGallery = JSON.parse(existing.gallery ?? "[]") as string[]
    const removed    = oldGallery.filter((url: string) => !(body.gallery ?? []).includes(url))
    await Promise.all(removed.map(deleteFromCloudinary))

    const oldSections = JSON.parse(existing.sections ?? "[]") as Array<{ image?: string }>
    const newSections = (body.sections ?? []) as Array<{ image?: string }>
    const newSectionImages = new Set(newSections.map((s) => s.image).filter(Boolean))
    const removedSectionImages = oldSections
      .map((s) => s.image)
      .filter((img): img is string => !!img && !newSectionImages.has(img))
    await Promise.all(removedSectionImages.map(deleteFromCloudinary))

    // Si el slug cambió, invalida también la URL vieja
    if (existing.slug !== post.slug) {
      revalidatePath(`/blog/${existing.slug}`)
    }

    revalidateTag("blog", {expire: 3600})
    revalidate(post.slug)

    return NextResponse.json({
      ...post,
      gallery:  JSON.parse(post.gallery),
      tags:     JSON.parse(post.tags),
      sections: JSON.parse(post.sections),
    })
  } catch (err) {
    console.error("Error al actualizar artículo:", err)
    return NextResponse.json(
      { error: "Error interno al actualizar el artículo" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const post = await prisma.blog.findUnique({
    where:  { id },
    select: { coverImage: true, gallery: true, sections: true, slug: true },
  })
  if (!post) {
    return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 })
  }

  try {
    await prisma.blog.delete({ where: { id } })

    if (post.coverImage) await deleteFromCloudinary(post.coverImage)

    const gallery = JSON.parse(post.gallery ?? "[]") as string[]
    await Promise.all(gallery.map(deleteFromCloudinary))

    const sections = JSON.parse(post.sections ?? "[]") as Array<{ image?: string }>
    const sectionImages = sections.map((s) => s.image).filter((img): img is string => !!img)
    await Promise.all(sectionImages.map(deleteFromCloudinary))

    revalidateTag("blog", {expire: 3600})
    revalidate(post.slug)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error al eliminar artículo:", err)
    return NextResponse.json(
      { error: "Error interno al eliminar el artículo" },
      { status: 500 }
    )
  }
}