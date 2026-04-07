import Link from "next/link"
import { ReactNode } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface AdminLink {
  label: string
  href: string
}

interface Props {
  namePage: string
  children: ReactNode
  link?: AdminLink        // Si no se pasa, el botón no se muestra
  maxWidth?: string       // Ej: "max-w-4xl", "max-w-7xl". Default: "max-w-6xl"
  className?: string
}

export const LayoutAdminSection = ({
  namePage,
  children,
  link,
  maxWidth = "max-w-6xl",
  className,
}: Props) => {
  return (
    <div className={`${maxWidth} ${className} mx-auto px-6 lg:py-10 py-6 flex-1 flex flex-col`}>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Admin</span>
          <h1 className="text-foreground text-4xl sm:text-5xl uppercase leading-none">
            {namePage}
          </h1>
        </div>

        {link && (
          <Button asChild className="self-start sm:self-auto">
            <Link href={link.href}>
              <Plus className="w-4 h-4" />
              {link.label}
            </Link>
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <Separator className="flex-1" />
        <span className="w-1 h-1 rounded-full bg-border" />
        <Separator className="flex-1" />
      </div>

      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 flex-1 mt-10">
        <span className="font-titleText text-muted-foreground tracking-[0.15em] text-lg">
          Central molletes
        </span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
          Panel administrativo · {new Date().getFullYear()}
        </span>
      </div>
    </div>
  )
}