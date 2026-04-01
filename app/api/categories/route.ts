import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

// GET — todas las categorías ordenadas
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    })
    return NextResponse.json(categories)
  } catch (err) {
    console.error("Error al obtener categorías:", err)
    return NextResponse.json(
      { error: "Error al obtener las categorías" },
      { status: 500 }
    )
  }
}

// POST — crear nueva categoría
export async function POST(req: Request) {
  const body = await req.json()

  // 1. Validar que la data venga en el body
  if (!body.name) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: name" },
      { status: 400 }
    )
  }

  // 2. Verificar que no exista ya esa categoría
  const existing = await prisma.category.findUnique({
    where: { name: body.name },
  })

  if (existing) {
    return NextResponse.json(
      { error: `Ya existe una categoría con el mismo nombre: "${body.name}"` },
      { status: 409 } // Conflict
    )
  }

  // 3. Crear
  try {
    const category = await prisma.category.create({
      data: {
        name:  body.name,
        emoji: body.emoji ?? "•",
        order: body.order ?? 99,
      },
    })
  
    revalidatePath("/menu")
    revalidatePath("/admin")
    revalidatePath("/admin/categorias")
  
    return NextResponse.json(category, { status: 201 })
  } catch (err) {
    console.error("Error al intentar crear una nueva categoría", err)
    return NextResponse.json(
      { error: "Error al intentar crear una nueva categoría"},
      { status: 500}
    )
  }
}