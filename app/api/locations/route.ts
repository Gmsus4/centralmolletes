import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

// GET — todas las locaciones
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(
      locations.map((l) => ({
        ...l,
        gallery: JSON.parse(l.gallery),
      }))
    )
  } catch (err) {
    console.error("Error al obtener locaciones:", err)
    return NextResponse.json(
      { error: "Error al obtener las locaciones" },
      { status: 500 }
    )
  }
}

// POST — crear nueva locación
export async function POST(req: Request) {
  const body = await req.json()

  // Validación de campos requeridos
  if (!body.slug || !body.city || !body.name || !body.address) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: slug, city, name, address" },
      { status: 400 }
    )
  }

  // Verificar slug único
  const existing = await prisma.location.findUnique({ where: { slug: body.slug } })
  if (existing) {
    return NextResponse.json(
      { error: `Ya existe una locación con el slug "${body.slug}"` },
      { status: 409 }
    )
  }

  try {
    const location = await prisma.location.create({
      data: {
        slug:       body.slug,
        city:       body.city,
        name:       body.name,
        address:    body.address,
        addressMin: body.addressMin,
        phone:      body.phone,
        hours:      body.hours,
        image:      body.image      ?? "",
        gallery:    JSON.stringify(body.gallery ?? []),
        mapUrl:     body.mapUrl,
        embedUrl:   body.embedUrl,
      },
    })

    revalidatePath("/")
    revalidatePath("/locations")
    revalidatePath(`/locations/${location.slug}`)
    revalidatePath("/menu/[slug]", "page")

    return NextResponse.json(
      { ...location, gallery: JSON.parse(location.gallery) },
      { status: 201 }
    )
  } catch (err) {
    console.error("Error al crear locación:", err)
    return NextResponse.json(
      { error: "Error interno al crear la locación" },
      { status: 500 }
    )
  }
}