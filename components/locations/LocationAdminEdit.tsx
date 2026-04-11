// components/locations/LocationAdminEdit.tsx
"use client"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { IconPencilCode } from "@tabler/icons-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export const LocationAdminEdit = ({ locationId }: { locationId: string }) => {
  const isAdmin = useIsAdmin()
  if (!isAdmin) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/admin/locations/${locationId}`}>
          <IconPencilCode className="text-white hover:opacity-60 transition-opacity" size={18} />
        </Link>
      </TooltipTrigger>
      <TooltipContent><p>Editar sucursal</p></TooltipContent>
    </Tooltip>
  )
}