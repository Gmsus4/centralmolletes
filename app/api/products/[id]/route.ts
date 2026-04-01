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
  revalidateTag("products", {expire: 3600})
  revalidatePath("/")
  revalidatePath("/menu")
  revalidatePath(`/menu/${slug}`)
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })

  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  try {
    return NextResponse.json({
      ...product,
      ingredients: JSON.parse(product.ingredients),
      allergens:   JSON.parse(product.allergens),
    })
  } catch {
    return NextResponse.json({ error: "Error al parsear datos del producto" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { img: true, slug: true, categoryId: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  if (!body.name || !body.price || !body.slug) {
    return NextResponse.json({ error: "Faltan campos requeridos: name, price, slug" }, { status: 400 })
  }

  try {
    let category = await prisma.category.findUnique({ where: { name: body.category } })
    if (!category) {
      category = await prisma.category.create({
        data: { name: body.category, emoji: "•", order: 99 },
      })
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        slug:         body.slug,
        name:         body.name,
        price:        Number(body.price),
        categoryId:   category.id,
        tag:          body.tag ?? null,
        img:          body.img,
        desc:         body.desc,
        descLong:     body.descLong,
        ingredients:  JSON.stringify(body.ingredients),
        allergens:    JSON.stringify(body.allergens),
        weight:       body.weight,
        prepTime:     body.prepTime,
        availability: body.availability ?? "BOTH",
      },
      include: { category: true },
    })

    if (existing.img && existing.img !== body.img) {
      await deleteFromCloudinary(existing.img)
    }

    if (existing.categoryId && existing.categoryId !== category.id) {
      const count = await prisma.product.count({ where: { categoryId: existing.categoryId } })
      if (count === 0) {
        await prisma.category.delete({ where: { id: existing.categoryId } }).catch(err =>
          console.error("Error al limpiar categoría huérfana:", err)
        )
      }
    }

    if (existing.slug !== product.slug) {
      revalidatePath(`/menu/${existing.slug}`)
    }
    revalidate(product.slug)

    return NextResponse.json(product)

  } catch (err) {
    console.error("Error al actualizar producto:", err)
    return NextResponse.json({ error: "Error interno al actualizar el producto" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    select: { img: true, slug: true, categoryId: true },
  })
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  try {
    await prisma.product.delete({ where: { id } })

    if (product.img) {
      await deleteFromCloudinary(product.img)
    }

    if (product.categoryId) {
      const count = await prisma.product.count({ where: { categoryId: product.categoryId } })
      if (count === 0) {
        await prisma.category.delete({ where: { id: product.categoryId } }).catch(err =>
          console.error("Error al limpiar categoría huérfana:", err)
        )
      }
    }

    revalidate(product.slug)

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error("Error al eliminar producto:", err)
    return NextResponse.json({ error: "Error interno al eliminar el producto" }, { status: 500 })
  }
}