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
import { DatabaseIcon, HomeIcon } from "lucide-react"
import { IconAddressBook, IconArticle, IconBowlChopsticks, IconBrandGithub, IconBrandVercelFilled, IconCalendarWeek, IconDiscount2, IconImageInPicture, IconMapPin, IconMessageStar, IconPalette, IconPhoto, IconSpeakerphone, IconTag, IconWriting } from "@tabler/icons-react"
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
      name: "Central molletes",
      logo: (
        <HomeIcon />
      ),
      url: "/"
    },
    {
      name: "Cloudinary",
      logo: (
        <IconImageInPicture />
      ),
      url: "https://cloudinary.com"
    },
    {
      name: "Neon",
      logo: (
        <DatabaseIcon
        />
      ),
      url: "https://neon.com"
    },
    {
      name: "Vercel",
      logo: (
        <IconBrandVercelFilled
        />
      ),
      url: "https://vercel.com"
    },
    {
      name: "GitHub",
      logo: (
        <IconBrandGithub
        />
      ),
      url: "https://github.com"
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
    {
      title: "Galería del Sitio",
      url: "/admin/site-images",
      icon: (
        <IconPhoto
        />
      ),
    },
  ],
  navAdvanced: [
    {
      title: "Módulos de Texto",
      url: "/admin/site-content",
      icon: (
        <IconWriting
        />
      ),
    },
    {
      title: "Tema",
      url: "/admin/theme",
      icon: (
        <IconPalette
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
        <NavComponent items={data.navAdvanced} title="Avanzado"/>

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
