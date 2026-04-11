"use client"

import { useIsAdmin } from "@/hooks/useIsAdmin"
import { IconPencilCode } from "@tabler/icons-react"
import Link from "next/link"

type Props = {
  href: string
  children: React.ReactNode
  className?: string  // 👈 agrega esto
}

export const AdminImageWrapper = ({ href, children, className }: Props) => {
  const isAdmin = useIsAdmin()

  if (!isAdmin) return <div className={className}>{children}</div>

  return (
    <Link href={href} className={className}>
      <div className="relative group w-full h-full overflow-hidden">
        <div className="[&_img]:transition-all h-full [&_img]:duration-300 [&_img]:group-hover:brightness-50">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <IconPencilCode className="text-white" size={28} />
          <span className="text-white text-sm font-medium">Cambiar imagen</span>
        </div>
      </div>
    </Link>
  )
}