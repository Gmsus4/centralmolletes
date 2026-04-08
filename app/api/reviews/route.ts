import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"

function revalidate() {
  revalidatePath("/")
  revalidateTag("reviews", { expire: 3600 })
}

// GET — todas las reseñas visibles públicamente
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where:   { status: "visible" },
      orderBy: { order: "asc" },
    })
    return NextResponse.json(reviews)
  } catch (err) {
    console.error("Error al obtener reseñas:", err)
    return NextResponse.json({ error: "Error al obtener las reseñas" }, { status: 500 })
  }
}

// POST — crear nueva reseña
export async function POST(req: Request) {
  const body = await req.json()

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

  try {
    const review = await prisma.review.create({
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

    revalidate()
    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    console.error("Error al crear reseña:", err)
    return NextResponse.json({ error: "Error interno al crear la reseña" }, { status: 500 })
  }
}