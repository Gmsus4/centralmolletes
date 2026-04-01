import prisma from "@/lib/prisma"
import AnnouncementForm from "../AnnouncementForm"
import { notFound } from "next/navigation"

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const announcement = await prisma.announcement.findUnique({
    where: { id },
  })

  if (!announcement) notFound()

  return (
    <AnnouncementForm announcement={JSON.parse(JSON.stringify(announcement))} />
  )
}