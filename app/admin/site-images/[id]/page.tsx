export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import SiteImageForm from "../SiteImageForm"
import type { SiteImageSection } from "@/lib/validators/siteImage"

export default async function EditSiteImagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }  = await params
  const image   = await prisma.siteImage.findUnique({ where: { id } })
  if (!image) notFound()

  return (
    <SiteImageForm
      siteImage={{
        ...image,
        section: image.section as SiteImageSection,
      }}
    />
  )
}