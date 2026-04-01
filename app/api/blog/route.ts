import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

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

function revalidate(slug: string) {
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
}

// Filtro público: published siempre, scheduled solo si ya pasó su fecha
const publicFilter = {
  OR: [
    { status: "published" },
    { status: "scheduled", publishedAt: { lte: new Date() } },
  ],
} as const

function parsePost(p: {
  gallery: string
  tags: string
  sections: string
  [key: string]: unknown
}) {
  return {
    ...p,
    gallery:  JSON.parse(p.gallery),
    tags:     JSON.parse(p.tags),
    sections: JSON.parse(p.sections),
  }
}

// GET — todos los artículos visibles públicamente
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const admin = searchParams.get("admin") === "1"

  function publicFilter() {
    return {
      OR: [
        { status: "published" },
        { status: "scheduled", publishedAt: { lte: new Date() } },
      ],
    }
  }

  try {
    const posts = await prisma.blog.findMany({
      where:   admin ? undefined : publicFilter(),
      orderBy: { publishedAt: "desc" },
    })
    return NextResponse.json(posts.map(parsePost))
  } catch (err) {
    console.error("Error al obtener artículos:", err)
    return NextResponse.json({ error: "Error al obtener los artículos" }, { status: 500 })
  }
}

// POST — crear nuevo artículo
export async function POST(req: Request) {
  const body = await req.json()

  if (!body.slug || !body.title || !body.subtitle || !body.coverImage || !body.category) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: slug, title, subtitle, coverImage, category" },
      { status: 400 }
    )
  }

  const existing = await prisma.blog.findUnique({ where: { slug: body.slug } })
  if (existing) {
    return NextResponse.json(
      { error: `Ya existe un artículo con el slug "${body.slug}"` },
      { status: 409 }
    )
  }

  try {
    const post = await prisma.blog.create({
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
        publishedAt:     parsePublishedAt(body.publishedAt, body.tzOffset),
      },
    })

    revalidate(post.slug)

    return NextResponse.json(parsePost(post), { status: 201 })
  } catch (err) {
    console.error("Error al crear artículo:", err)
    return NextResponse.json({ error: "Error interno al crear el artículo" }, { status: 500 })
  }
}