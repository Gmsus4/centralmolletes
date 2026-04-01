"use client"
import { IconBrandWhatsapp } from "@tabler/icons-react"

interface WhatsAppOrderButtonProps {
  phone: string
}

export const WhatsAppOrderButton = ({ phone }: WhatsAppOrderButtonProps) => {
  const handleClick = () => {
    const url = window.location.href
    const title = document.title
    const description = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? ""
    const text = encodeURIComponent(`¡Me interesa este producto: ${title}! ${description}`)
    const encodedUrl = encodeURIComponent(url)
    window.open(`https://wa.me/${phone}?text=${text}%20${encodedUrl}`, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      onClick={handleClick}
      className="btn rounded-primarySize bg-transparent border-secundaryColor shadow-none text-secundaryColor hover:bg-secundaryColor/10 transition-colors duration-200 px-8"
    >
      Pedir por WhatsApp
      <IconBrandWhatsapp size={18} />
    </button>
  )
}