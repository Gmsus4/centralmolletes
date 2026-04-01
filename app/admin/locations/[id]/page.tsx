import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import LocationForm from "../LocationForm"

export const dynamic = "force-dynamic"

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const location = await prisma.location.findUnique({ where: { id } })
  if (!location) notFound()

  return (
    <LocationForm
      location={{
        ...location,
        gallery: JSON.parse(location.gallery) as string[],
      }}
    />
  )
}