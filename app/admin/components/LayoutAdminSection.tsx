import Link from "next/link"
import { ReactNode } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"

interface Props {
  namePage: string
  children: ReactNode
  isLink?: boolean
  linkName: string
  linkHref: string
  className?: string
}

export const LayoutAdminSection = ({
  namePage,
  children,
  isLink = true,
  className,
  linkName,
  linkHref,
}: Props) => {
  return (
    <div className={`${className} max-w-6xl mx-auto px-6 py-10`}>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Admin</span>
          </div>
          <h1 className="font-titleText text-foreground text-4xl sm:text-5xl leading-none">
            {namePage}
          </h1>
        </div>

        {isLink && (
          <Button asChild className="self-start sm:self-auto">
            <Link href={`/admin/${linkHref.toLocaleLowerCase()}/new`}>
              <Plus className="w-4 h-4" />
              Nuevo {linkName.toLocaleLowerCase()}
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

      {children}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
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