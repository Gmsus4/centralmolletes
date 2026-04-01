import { NextResponse }    from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import prisma              from "@/lib/prisma"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params

  const contact = await prisma.contactInfo.findUnique({
    where: { id },
    include: { socialLinks: true },
  })

  if (!contact) {
    return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 })
  }

  return NextResponse.json(contact)
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const body   = await req.json()

    if (!body.address || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: address, email, phone" },
        { status: 400 }
      )
    }

    const existing = await prisma.contactInfo.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 })
    }

    const contact = await prisma.contactInfo.update({
      where: { id },
      data: {
        address:        body.address,
        email:          body.email,
        phone:          body.phone,
        whatsapp:       body.whatsapp       ?? null,
        schedule:       body.schedule       ?? null,
        extraInfo:      body.extraInfo      ?? null,
        isOpenOverride: body.isOpenOverride ?? null,
        socialLinks: {
          deleteMany: {},
          create: (body.socialLinks ?? []).map((s: any, index: number) => ({
            platform: s.platform,
            url:      s.url,
            username: s.username ?? null,
            order:    index,
            isActive: s.isActive ?? true,
          })),
        },
      },
      include: { socialLinks: true },
    })

    revalidatePath("/")  
    revalidatePath("/contact")          // invalida la página de contacto
    revalidateTag("contact-phone", { expire: 86400 })    // invalida el caché del navbar

    return NextResponse.json(contact)

  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Ya tienes esa plataforma registrada" },
        { status: 409 }
      )
    }
    console.error("Error al actualizar contacto:", err)
    return NextResponse.json(
      { error: "Error interno al actualizar el contacto" },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params

    const existing = await prisma.contactInfo.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 })
    }

    await prisma.socialLink.deleteMany({ where: { contactInfoId: id } })
    await prisma.contactInfo.delete({ where: { id } })

    revalidatePath("/contact")          // invalida la página de contacto
    revalidateTag("contact-phone", { expire: 86400 })    // invalida el caché del navbar

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error("Error al eliminar contacto:", err)
    return NextResponse.json(
      { error: "Error interno al eliminar el contacto" },
      { status: 500 }
    )
  }
}