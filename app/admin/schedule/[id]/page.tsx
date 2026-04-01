import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import ScheduleForm from "../ScheduleForm"

export default async function EditHorarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const horario = await prisma.schedule.findUnique({
    where: { id },
    include: { shifts: true },
  })

  if (!horario) notFound()

  return <ScheduleForm horario={horario} />
}