"use client"
import { useSession } from "next-auth/react"
import { IconEdit } from "@tabler/icons-react"
import { ButtonCustom } from "./ButtonCustom"

interface EditButtonProps {
    productId: string
}

export const EditButton = ({productId}: EditButtonProps) => {
  const { data: session } = useSession()
  const isAdmin = !!session?.user
  return (
    <>  
      {isAdmin && (
        <ButtonCustom className="absolute z-50 bottom-4 right-18" isFilled={false} url={`/admin/products/${productId}`}>
          <IconEdit className="text-darkWarm" />
        </ButtonCustom>
      )}
    </>
  )
}
