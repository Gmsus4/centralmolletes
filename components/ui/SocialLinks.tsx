import Link from "next/link"
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconBrandTiktok,
  IconBrandYoutube,
  IconBrandPinterest,
  IconBrandSnapchat,
  IconBrandReddit,
  IconBrandTelegram,
  IconBrandGithub,
  IconBrandDribbble,
  IconBrandBehance,
  IconBrandMedium,
  IconBrandDiscord,
  IconBrandSlack,
  IconBrandTwitch,
  IconBrandFlickr,
  IconBrandVimeo,
} from "@tabler/icons-react"

interface SocialLink {
    id: string
    platform: string
    url: string
    username: string | null
    order: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    contactInfoId: string
}

interface SocialLinksProps {
  links: SocialLink[] | undefined
}

const iconMap: Record<string, any> = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  twitter: IconBrandTwitter,
  linkedin: IconBrandLinkedin,
  whatsapp: IconBrandWhatsapp,
  tiktok: IconBrandTiktok,
  youtube: IconBrandYoutube,
  pinterest: IconBrandPinterest,
  snapchat: IconBrandSnapchat,
  reddit: IconBrandReddit,
  telegram: IconBrandTelegram,
  github: IconBrandGithub,
  dribbble: IconBrandDribbble,
  behance: IconBrandBehance,
  medium: IconBrandMedium,
  discord: IconBrandDiscord,
  slack: IconBrandSlack,
  twitch: IconBrandTwitch,
  flickr: IconBrandFlickr,
  vimeo: IconBrandVimeo,
}

export const SocialLinks = ({ links }: SocialLinksProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {links?.map((item) => {
        if (!item.isActive) return null

        const Icon = iconMap[item.platform.toLowerCase()]

        return (
          <Link
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Síguenos en ${item.platform}`}
            className="w-9 h-9 grid place-items-center bg-brand-contrast hover:bg-brand-contrast/90 rounded-radius text-brand-primary transition-all duration-200 hover:scale-110"
          >
            {Icon ? <Icon width={24} height={24} /> : <p>{item.platform[0]}</p>}
          </Link>
        )
      })}
    </div>
  )
}