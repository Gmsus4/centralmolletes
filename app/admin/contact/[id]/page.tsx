import prisma from "@/lib/prisma"
import ContactForm from "../ContactForm"
import { notFound } from "next/navigation"
import { LayoutAdminSection } from "../../components/LayoutAdminSection"

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const contact = await prisma.contactInfo.findUnique({
    where: { id },
    include: { socialLinks: true },
  })

  if (!contact) notFound()

  return (
    <ContactForm contact={JSON.parse(JSON.stringify(contact))}/>
  )
}