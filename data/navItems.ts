import { Icon, IconArticle, IconBread, IconMail, IconMap, IconUsersGroup } from "@tabler/icons-react";

export interface NavItem {
  title: string;
  href: string;
  icon: Icon;
}

export interface OtherLink {
  title: string;
  href: string;
}

export const navItems: NavItem[] = [
  {
    title: "Menú",
    href: "/menu",
    icon: IconBread,
  },
  {
    title: "Ubicación",
    href: "/locations",
    icon: IconMap,
  },  
  {
    title: "Nosotros",
    href: "/about",
    icon: IconUsersGroup,
  },
  {
    title: "Blog",
    href: "/blog",
    icon: IconArticle,
  },
  {
    title: "Contacto",
    href: "/contact",
    icon: IconMail,
  },
];

export const otherLinks: OtherLink[] = [
  { title: "Términos y condiciones", href: "/terms" },
  { title: "Privacidad", href: "/privacy" },
  { title: "Solo personal autorizado", href: "/login" },
]