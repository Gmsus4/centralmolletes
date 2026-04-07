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
            <SidebarMenuButton tooltip={item.title}>
              {item.icon}
              <a href={item.url}>{item.title}</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}