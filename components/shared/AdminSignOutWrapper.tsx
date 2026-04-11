"use client"

import { useIsAdmin } from "@/hooks/useIsAdmin"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import { IconLogout } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const AdminSignOutWrapper = () => {
  const isAdmin = useIsAdmin()
  const { data: session } = useSession()

  if (!isAdmin) return null

  const email = session?.user?.email ?? ""

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer ring-2 ring-brand-primary hover:ring-offset-2 transition-all">
            <AvatarImage src={"/favicon.ico"} alt={"logo icon"} />
            <AvatarFallback className="bg-bg-dark text-white text-xs font-bold">
              CM
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="w-48 mb-2">
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">{"central molletes"}</span>
            <span className="text-xs text-muted-foreground font-normal truncate">{email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="text-red-500 focus:text-red-500 cursor-pointer gap-2"
          >
            <IconLogout size={15} />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}