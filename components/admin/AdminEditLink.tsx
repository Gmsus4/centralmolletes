// components/admin/AdminEditLink.tsx
"use client"
import Link from "next/link"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

type Props = {
  href: string
  label?: string
  children: React.ReactNode
  tooltipText?: string
}

export const AdminEditLink = ({ href, label, children, tooltipText = "Editar" }: Props) => {
  const isAdmin = useIsAdmin()
  if (!isAdmin) return <>{children}</>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href}>{children}</Link>
      </TooltipTrigger>
      <TooltipContent><p>{tooltipText}</p></TooltipContent>
    </Tooltip>
  )
}