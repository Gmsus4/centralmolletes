import Link from "next/link"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"

interface NavProps {
    title: string
    url: string
    icon?: React.ReactNode
}

interface Props {
    items: NavProps[]
    title: string
}

export function NavComponent({items, title}: Props) {  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, idx) => (
          <SidebarMenuItem key={idx}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link href={item.url}>
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}