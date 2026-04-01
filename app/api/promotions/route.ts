import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { PromotionSchema } from "@/lib/validators/promotion"

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
      include: { products: true },
    })
    return NextResponse.json(promotions)
  } catch (error) {
    console.error("GET_PROMOTIONS_ERROR", error)
    return NextResponse.json({ error: "Error al obtener las promociones" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body   = await req.json()
    const parsed = PromotionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { productIds, ...data } = parsed.data

    const promotion = await prisma.promotion.create({
      data: {
        ...data,
        startsAt: new Date(data.startsAt),
        endsAt:   new Date(data.endsAt),
        products: {
          connect: productIds.map((id) => ({ id })),
        },
      },
      include: { products: true },
    })

    revalidatePath("/")

    return NextResponse.json(promotion, { status: 201 })
  } catch (error) {
    console.error("POST_PROMOTION_ERROR", error)
    return NextResponse.json({ error: "Error interno al crear la promoción" }, { status: 500 })
  }
}