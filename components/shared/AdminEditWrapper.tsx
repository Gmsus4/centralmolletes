"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Props = {
  href: string
  tooltip: string
  className?: string
  children: React.ReactNode
}

export const AdminEditWrapper = ({ href, tooltip, className, children }: Props) => {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.isAdmin ?? false

  if (!isAdmin) return <>{children}</>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href} className={className}>
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent><p>{tooltip}</p></TooltipContent>
    </Tooltip>
  )
}