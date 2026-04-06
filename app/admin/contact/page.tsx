export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
  IconMapPin,
  IconPhoneCall,
  IconBrandTwitter,
  IconBrandTiktok,
  IconBrandYoutube,
  IconBrandLinkedin,
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
  IconEdit,
} from "@tabler/icons-react"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Admin | Contacto",
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  facebook:  IconBrandFacebook,
  instagram: IconBrandInstagram,
  whatsapp:  IconBrandWhatsapp,
  twitter:   IconBrandTwitter,
  tiktok:    IconBrandTiktok,
  youtube:   IconBrandYoutube,
  linkedin:  IconBrandLinkedin,
  pinterest: IconBrandPinterest,
  snapchat:  IconBrandSnapchat,
  reddit:    IconBrandReddit,
  telegram:  IconBrandTelegram,
  github:    IconBrandGithub,
  dribbble:  IconBrandDribbble,
  behance:   IconBrandBehance,
  medium:    IconBrandMedium,
  discord:   IconBrandDiscord,
  slack:     IconBrandSlack,
  twitch:    IconBrandTwitch,
  flickr:    IconBrandFlickr,
  vimeo:     IconBrandVimeo,
}

function SocialIcon({ platform }: { platform: string }) {
  const Icon = iconMap[platform.toLowerCase()]
  return Icon
    ? <Icon size={12} />
    : <span className="text-[10px] font-bold">{platform[0].toUpperCase()}</span>
}

// ─── Contact field ────────────────────────────────────────────────────────────

function ContactField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number }>
  label: string
  value?: string | null
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <Icon size={10} />
        {label}
      </span>
      {value ? (
        <span className="text-sm font-medium text-foreground">{value}</span>
      ) : (
        <span className="text-sm text-muted-foreground/50 italic">Sin {label.toLowerCase()}</span>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ContactPage() {
  const contacts = await prisma.contactInfo.findMany({
    include: { socialLinks: true },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <LayoutAdminSection namePage="Contacto" maxWidth="max-w-6xl">
      <Suspense>
        <Toast message="Contacto guardado correctamente"  type="success" triggerParam="edit" />
        <Toast message="Contacto eliminado correctamente" type="success" triggerParam="deleted" />
      </Suspense>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed rounded-lg">
          <div className="w-12 h-12 rounded-full bg-muted grid place-items-center">
            <IconMail size={20} className="text-muted-foreground" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm font-medium text-foreground">Sin registros de contacto</p>
            <p className="text-xs text-muted-foreground">Agrega tu primera información de contacto</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {contacts.map((contact, i) => (
            <Link href={`/admin/contact/${contact.id}`} key={contact.id} className="flex flex-col gap-5 p-5 border rounded-lg bg-card hover:shadow-sm transition-shadow duration-200">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    #{String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <Separator />

                {/* Fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ContactField icon={IconMail}       label="Email"     value={contact.email}    />
                  <ContactField icon={IconPhoneCall}  label="Teléfono"  value={contact.phone}    />
                  <ContactField icon={IconBrandWhatsapp} label="WhatsApp" value={contact.whatsapp} />
                  <ContactField icon={IconMapPin}     label="Dirección" value={contact.address}  />
                </div>

                {/* Social links */}
                {contact.socialLinks.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Redes sociales
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {contact.socialLinks.map((social) => (
                          <Badge
                            key={social.id}
                            variant={social.isActive ? "secondary" : "outline"}
                            className={`gap-1.5 ${!social.isActive ? "opacity-50 line-through" : ""}`}
                          >
                            <SocialIcon platform={social.platform} />
                            {social.platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
            </Link>
          ))}
        </div>
      )}
    </LayoutAdminSection>
  )
}