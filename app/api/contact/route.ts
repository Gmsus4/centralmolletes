import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    const contact = await prisma.contactInfo.findFirst({
      include: {
        socialLinks: { orderBy: { order: "asc" } },
      },
    })
    return NextResponse.json(contact ?? null)
  } catch (err) {
    console.error("Error al obtener contacto:", err)
    return NextResponse.json(
      { error: "Error al obtener la información de contacto" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  // Validación movida dentro del try para capturar errores de JSON malformado
  try {
    const body = await req.json()

    if (!body.address || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: address, email, phone" },
        { status: 400 }
      )
    }

    const existing = await prisma.contactInfo.findFirst()
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe información de contacto. Usa PUT para actualizar." },
        { status: 409 }
      )
    }

    const contact = await prisma.contactInfo.create({
      data: {
        address:   body.address,
        email:     body.email,
        phone:     body.phone,
        whatsapp:  body.whatsapp  ?? null,
        schedule:  body.schedule  ?? null,
        extraInfo: body.extraInfo ?? null,
        socialLinks: {
          create: (body.socialLinks ?? []).map((s: any, i: number) => ({
            platform: s.platform,
            url:      s.url,
            username: s.username ?? null,
            order:    s.order    ?? i,
            isActive: s.isActive ?? true,
          })),
        },
      },
      include: { socialLinks: true },
    })

    revalidatePath("/")
    revalidatePath("/contact")

    return NextResponse.json(contact, { status: 201 })

  } catch (err: any) {
    // Plataforma duplicada dentro del mismo contacto
    if (err.code === "P2002") {
      const fields = err.meta?.target as string[] ?? []
      if (fields.includes("platform")) {
        return NextResponse.json(
          { error: "Ya tienes esa plataforma registrada" },
          { status: 409 }
        )
      }
      if (fields.includes("email")) {
        return NextResponse.json(
          { error: "Ya existe un contacto con ese email" },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: "Ya existe un registro con esos datos" },
        { status: 409 }
      )
    }

    console.error("Error al crear contacto:", err)
    return NextResponse.json(
      { error: "Error interno al crear la información de contacto" },
      { status: 500 }
    )
  }
}