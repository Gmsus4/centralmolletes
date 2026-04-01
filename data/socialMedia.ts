import { Icon, IconBrandFacebook, IconBrandInstagram, IconBrandTiktok } from "@tabler/icons-react";

export interface SocialM {
  title: string;
  href: string;
  icon: Icon;
}

export const socialMedia: Record<string, SocialM> = {
  facebook: {
    title: "Facebook",
    href: "https://www.facebook.com/CentralMolletes",
    icon: IconBrandFacebook,
  },
  instagram: {
    title: "Instagram",
    href: "https://www.instagram.com/centralmolletescafeteria",
    icon: IconBrandInstagram,
  },
  tiktok: {
    title: "Tiktok",
    href: "https://www.tiktok.com/@centralmolleteset",
    icon: IconBrandTiktok,
  }
};