export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import SiteContentForm from "../SiteContentForm"
import type { SiteContentFormValues } from "@/lib/validators/siteContent"

export default async function EditSiteContentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }  = await params
  const item    = await prisma.siteContent.findUnique({ where: { id } })
  if (!item) notFound()

  return (
    <SiteContentForm
      siteContent={{
        ...item,
        section: item.section as SiteContentFormValues["section"],
        type:    item.type    as SiteContentFormValues["type"],
      }}
    />
  )
}