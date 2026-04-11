"use client"

import { useIsAdmin } from "@/hooks/useIsAdmin"
import { IconPencilCode } from "@tabler/icons-react"
import Link from "next/link"

type Props = {
  href: string
  children: React.ReactNode
}

export const AdminImageWrapperFill = ({ href, children }: Props) => {
  const isAdmin = useIsAdmin()

  if (!isAdmin) return <>{children}</>

  return (
    <div className="absolute inset-0">
      {children}
      <Link
        href={href}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-radius bg-bg-dark/80 backdrop-blur-sm text-white hover:bg-bg-dark transition-colors duration-200"
      >
        <IconPencilCode size={16} />
        <span className="text-xs font-medium">Cambiar imagen</span>
      </Link>
    </div>
  )
}