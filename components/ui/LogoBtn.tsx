import { IconBus } from "@tabler/icons-react"
import Link from "next/link"

export const LogoBtn = () => {
  return (
      <Link href="/" className="mask mask-square rounded-md w-11 h-11 justify-center bg-bg-dark inline-flex items-center font-semibold text-brand-primary transition-all duration-300 hover:scale-110 active:scale-95" aria-label="Ir a inicio" title="Inicio">
        <IconBus size={28} className={"text-brand-primary"}/>
      </Link>
  )
}
