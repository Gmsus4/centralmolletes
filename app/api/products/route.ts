import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { category: { order: "asc" } },
      include: { category: true },
    })

    const parsed = products.map((p) => ({
      ...p,
      // Usamos opcionales o valores por defecto para evitar errores si la DB tiene datos corruptos
      ingredients: p.ingredients ? JSON.parse(p.ingredients as string) : [],
      allergens: p.allergens ? JSON.parse(p.allergens as string) : [],
    }))

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("RORGET_PRODUCTS_ER", error)
    return NextResponse.json({ error: "Error al obtener los productos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validación básica: asegúrate de que existan los campos mínimos
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Lógica de categoría: Buscar o crear
    let category = await prisma.category.findUnique({
      where: { name: body.category },
    })

    if (!category) {
      category = await prisma.category.create({
        data: { name: body.category, emoji: "•", order: 99 },
      })
    }

    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        name: body.name,
        price: Number(body.price),
        categoryId: category.id,
        tag: body.tag ?? null,
        img: body.img,
        desc: body.desc,
        descLong: body.descLong,
        ingredients: JSON.stringify(body.ingredients || []),
        allergens: JSON.stringify(body.allergens || []),
        weight: body.weight,
        prepTime: body.prepTime,
        availability: body.availability ?? "BOTH",
      },
      include: { category: true },
    })

    // Revalidación selectiva
    revalidatePath("/")
    revalidatePath("/menu")
    revalidatePath(`/menu/${product.slug}`)

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("POST_PRODUCT_ERROR", error)
    
    // Manejo específico para errores de Prisma (ej. slug duplicado)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Ya existe un producto con ese slug o nombre" }, { status: 400 })
    }

    return NextResponse.json({ error: "Error interno al crear el producto" }, { status: 500 })
  }
}