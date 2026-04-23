"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cloneElement, isValidElement, ReactElement, ReactNode } from "react"

type Props = {
  href: string
  tooltip: string
  className?: string
  side?: "bottom" | "left" | "right" | "top"
  children: ReactNode
  hideWhenNotAdmin?: boolean
}

type ChildWithClassName = ReactElement<{ className?: string }>

export const AdminEditWrapper = ({
  href,
  tooltip,
  className,
  side = "top",
  children,
  hideWhenNotAdmin = false,
}: Props) => {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.isAdmin ?? false

  const childWithHover =
    isAdmin && isValidElement<{ className?: string }>(children)
      ? cloneElement(children as ChildWithClassName, {
          className: `${children.props.className ?? ""} hover:opacity-60 transition-opacity cursor-pointer`,
        })
      : children

  if (!isAdmin) {
    if (hideWhenNotAdmin) return null
    return <>{children}</>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href} className={className} target="_blank">
          {childWithHover}
        </Link>
      </TooltipTrigger>
      <TooltipContent side={side}>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
