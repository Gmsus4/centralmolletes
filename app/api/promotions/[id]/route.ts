import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import prisma from "@/lib/prisma"
import { PromotionSchema } from "@/lib/validators/promotion"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const promotion = await prisma.promotion.findUnique({
    where: { id },
    include: { products: true },
  })

  if (!promotion) {
    return NextResponse.json({ error: "Promoción no encontrada" }, { status: 404 })
  }

  return NextResponse.json(promotion)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing = await prisma.promotion.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Promoción no encontrada" }, { status: 404 })
  }

  try {
    const body   = await req.json()
    const parsed = PromotionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { productIds, ...data } = parsed.data

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        ...data,
        startsAt: new Date(data.startsAt),
        endsAt:   new Date(data.endsAt),
        products: {
          set: productIds.map((id) => ({ id })),
        },
      },
      include: { products: true },
    })

    revalidateTag("promotions", {expire: 3600})
    revalidatePath("/")

    return NextResponse.json(promotion)
  } catch (error) {
    console.error("PUT_PROMOTION_ERROR", error)
    return NextResponse.json({ error: "Error interno al actualizar la promoción" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing = await prisma.promotion.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Promoción no encontrada" }, { status: 404 })
  }

  try {
    await prisma.promotion.delete({ where: { id } })

    revalidateTag("promotions", {expire: 3600})
    revalidatePath("/")

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DELETE_PROMOTION_ERROR", error)
    return NextResponse.json({ error: "Error interno al eliminar la promoción" }, { status: 500 })
  }
}