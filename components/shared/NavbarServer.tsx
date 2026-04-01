import prisma         from "@/lib/prisma"
import { unstable_cache } from "next/cache"
import { Navbar }     from "./Navbar"

const getContactPhone = unstable_cache(
  async () => {
    const data = await prisma.contactInfo.findFirst({
      select: { phone: true, whatsapp: true },
    })
    return data ?? { phone: null, whatsapp: null }
  },
  ["contact-phone"],
  { revalidate: 86400, tags: ["contact-phone"] }
)

export async function NavbarServer() {
  const contact = await getContactPhone()
  return <Navbar phone={contact.phone} whatsapp={contact.whatsapp} />
}