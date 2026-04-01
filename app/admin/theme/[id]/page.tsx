import prisma from "@/lib/prisma"
import ThemeForm from "../ThemeForm"

export default async function EditThemePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const theme = await prisma.theme.findUnique({
    where: { id },
  })

  return <ThemeForm theme={theme ?? undefined} />
}