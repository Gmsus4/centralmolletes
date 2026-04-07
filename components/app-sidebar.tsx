"use client"

import * as React from "react"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react"
import { IconAddressBook, IconArticle, IconBowlChopsticks, IconCalendarWeek, IconDiscount2, IconMapPin, IconMessageStar, IconSpeakerphone, IconTag } from "@tabler/icons-react"
import { NavComponent } from "./nav-component"

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@centralmolletes.com",
    avatar: "/favicon.ico",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Free",
    },
  ],
  navInfo: [
    {
      title: "Ubicación",
      url: "/admin/locations",
      icon: (
        <IconMapPin
        />
      ),
    },
    {
      title: "Horarios",
      url: "/admin/schedule",
      icon: (
        <IconCalendarWeek
        />
      ),
    },
    {
      title: "Contacto",
      url: "/admin/contact",
      icon: (
        <IconAddressBook
        />
      ),
    },
  ],
  navContent: [
    {
      title: "Blog",
      url: "/admin/blog",
      icon: (
        <IconArticle
        />
      ),
    },
    {
      title: "Anuncios",
      url: "/admin/announcements",
      icon: (
        <IconSpeakerphone
        />
      ),
    },
    {
      title: "Reseñas",
      url: "/admin/reviews",
      icon: (
        <IconMessageStar
        />
      ),
    },
  ],
  navMenu: [
    {
      title: "Productos",
      url: "/admin/products",
      icon: (
        <IconBowlChopsticks
        />
      ),
    },
    {
      title: "Categorías",
      url: "/admin/categories",
      icon: (
        <IconTag
        />
      ),
    },
    {
      title: "Promociones",
      url: "/admin/promotions",
      icon: (
        <IconDiscount2
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavComponent items={data.navMenu} title="Menú"/>
        <NavComponent items={data.navInfo} title="Información"/>
        <NavComponent items={data.navContent} title="Contenido"/>
        {/* <NavComponent items={data.navContent} title="Ajustes"/> */}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
