import prisma from "@/lib/prisma"
import { IconPhoneCall } from "@tabler/icons-react"
import Link from "next/link"

export async function CallNow(){
  const contact = await prisma.contactInfo.findMany({
    orderBy: { updatedAt: "desc" },
  })

  const phone = contact[0]?.phone?.replace(/\s+/g, "") ?? ""
  return (
    <Link href={`tel:${contact[0].phone}`} className="flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-darkWarm text-xl hover:opacity-90 transition-opacity">
      Pedir ahora
      <IconPhoneCall size={20} />
    </Link>
  )
}
