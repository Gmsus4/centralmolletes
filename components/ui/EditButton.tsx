"use client"
import { useSession } from "next-auth/react"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"

interface EditButtonProps {
    productId: string
}

export const EditButton = ({productId}: EditButtonProps) => {
  const { data: session } = useSession()
  const isAdmin = !!session?.user
  
  if (!isAdmin) return null

  return (
    <Link 
      href={`/admin/products/${productId}`}
      className="w-12 h-12 rounded-full bg-brand-primary grid place-items-center shadow-md transition-transform hover:scale-105 active:scale-95 relative z-50"
      aria-label="Editar producto"
    >
      <IconEdit size={20} className="text-text-main" />
    </Link>
  )
}
