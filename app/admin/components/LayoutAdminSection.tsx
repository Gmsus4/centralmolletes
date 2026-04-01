import Link from "next/link"
import { ReactNode } from "react"

interface Props {
  namePage: string
  children: ReactNode
  isLink?: boolean
  linkName: string
  linkHref: string
  className?: string
}

export const LayoutAdminSection = ({ namePage, children, isLink = true, className, linkName, linkHref }: Props) => {
  return (
    <div className={`${className} max-w-6xl mx-auto px-6 py-10`}>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Admin</span>
          </div>
          <h1 className="font-titleText text-stone-800 text-4xl sm:text-5xl leading-none">{namePage}</h1>
        </div>

        {isLink && (
          <Link
            href={`/admin/${linkHref.toLocaleLowerCase()}/new`}
            className="
            self-start sm:self-auto
            bg-stone-800 text-white
            px-5 py-3
            text-[11px] uppercase tracking-[0.3em] font-semibold
            hover:opacity-90 active:opacity-75
            transition-opacity duration-200
          "
          >
            + Nuevo {linkName.toLocaleLowerCase()}
          </Link>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      {children}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-titleText text-darkMid tracking-[0.15em] text-lg">Central molletes</span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-darkMid">Panel administrativo · {new Date().getFullYear()}</span>
      </div>
    </div>
  )
}
