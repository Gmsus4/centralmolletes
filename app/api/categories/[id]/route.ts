import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"

// PUT — editar categoría
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  if(!body.name || !body.emoji || !body.order){
    return NextResponse.json({error: "Faltan campos requeridos: name, emoji, order"}, { status: 400})
  }
  
  const existing = await prisma.category.findUnique({where: {id} })
  if(!existing){
    return NextResponse.json({error: "Categoría no encontrada"}, {status: 400})
  }

  const products = await prisma.product.findMany({
    where: { categoryId: id },
    select: { slug: true },
  })

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name:  body.name,
        emoji: body.emoji,
        order: Number(body.order),
      },
    })
  
    revalidateTag("categories", {expire: 3600})
    revalidatePath("/menu")
    products.forEach((p) => revalidatePath(`/menu/${p.slug}`))
  
    return NextResponse.json(category)
  } catch (err) {
    console.error("Error al actualizar la categoría:", err)
    return NextResponse.json(
      { error: "Error interno al actualizar la categoría" },
      { status: 500 }
    )
  }
}

// DELETE — eliminar categoría (solo si no tiene productos)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const count = await prisma.product.count({ where: { categoryId: id } }) /* Cuántas productos existen utilizando esta categoría [id] */

  if (count > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar — tiene ${count} producto${count === 1 ? "" : "s"} asociado${count === 1 ? "" : "s"}` },
      { status: 400 }
    )
  }

  const products = await prisma.product.findMany({
    where: { categoryId: id },
    select: { slug: true },
  })

  try {
    await prisma.category.delete({ where: { id } })
  
    revalidateTag("categories", {expire: 3600})
    revalidatePath("/menu")
    products.forEach((p) => revalidatePath(`/menu/${p.slug}`))
  
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error al borrar la categoría:", err)
    return NextResponse.json(
      { error: "Error interno al eliminar la categoría" },
      { status: 500 }
    )
  }
}