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
  IconPlus,
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
} from "@tabler/icons-react"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | Contacto",
}

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
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


export default async function ContactPage() {
  const contacts = await prisma.contactInfo.findMany({
    include: { socialLinks: true },
    orderBy: { updatedAt: "desc" },
  })


  function getIcon(platform: string) {
    const Icon = iconMap[platform.toLowerCase()]
    return Icon ? <Icon size={14} /> : <span className="text-[10px]">{platform[0].toUpperCase()}</span>
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Suspense>
        <Toast message="Contacto guardado correctamente" type="success" triggerParam="edit"/>
        <Toast message="Contacto eliminado correctamente" type="success" triggerParam="deleted"/>
      </Suspense>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Admin</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
            Contacto
          </h1>
        </div>

        {contacts.length === 0 && (
          <Link
            href="/admin/contact/new"
            className="
              inline-flex items-center gap-2
              bg-stone-900 text-white
              px-6 py-3
              text-[11px] uppercase tracking-[0.3em] font-semibold
              hover:opacity-90 active:opacity-75
              transition-opacity duration-200
            "
          >
            <IconPlus size={13} />
            Nuevo contacto
          </Link>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      {/* ── Section label ── */}
      {/* <div className="flex items-center gap-3 mb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-darkWarm/75">
          Registros ({contacts.length})
        </span>
        <span className="flex-1 h-px bg-stone-100" />
      </div> */}

      {/* ── Empty state ── */}
      {contacts.length === 0 && (
        <p className="text-[11px] uppercase tracking-[0.25em] text-darkWarm/75 py-10 text-center">
          Sin registros de contacto
        </p>
      )}

      {/* ── Contact cards ── */}
      <div className="flex flex-col gap-px">
        {contacts.map((contact, i) => (
          <Link
            key={contact.id}
            href={`/admin/contact/${contact.id}`}
            className="
              group
              bg-white border border-stone-200
              hover:border-stone-700
              transition-colors duration-200
              p-6
            "
          >
            {/* Card top: index + edit hint */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[9px] uppercase tracking-[0.35em] text-darkWarm">
                #{String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-darkWarm group-hover:text-stone-600 transition-colors duration-200">
                Editar 
              </span>
            </div>

            {/* Fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Email */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-darkWarm/75 flex items-center gap-1.5">
                  <IconMail size={10} /> Email
                </span>
                <span className="text-sm text-stone-700 font-medium">
                  {contact.email || <em className="text-darkWarm not-italic">Sin email</em>}
                </span>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-darkWarm/75 flex items-center gap-1.5">
                  <IconPhoneCall size={10} /> Teléfono
                </span>
                <span className="text-sm text-stone-700 font-medium">
                  {contact.phone || <em className="text-darkWarm not-italic">Sin teléfono</em>}
                </span>
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-darkWarm/75 flex items-center gap-1.5">
                  <IconBrandWhatsapp size={10} /> WhatsApp
                </span>
                <span className="text-sm text-stone-700 font-medium">
                  {contact.whatsapp || <em className="text-darkWarm not-italic">Sin WhatsApp</em>}
                </span>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-darkWarm/75 flex items-center gap-1.5">
                  <IconMapPin size={10} /> Dirección
                </span>
                <span className="text-sm text-stone-700 font-medium">
                  {contact.address || <em className="text-darkWarm not-italic">Sin dirección</em>}
                </span>
              </div>
            </div>

            {/* Social links */}
            {contact.socialLinks.length > 0 && (
              <>
                <div className="h-px bg-stone-100 my-5" />
                <div className="flex items-start gap-4 flex-col">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-darkWarm lg:mb-0 mb-4">Redes</span>
                  <div className="flex gap-8 flex-col lg:flex-row">
                    {contact.socialLinks.map((social) => (
                      <div
                        key={social.id}
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-darkWarm"
                      >
                        {getIcon(social.platform)}
                        <span className={`${social.isActive ? "" : "line-through"}`}>
                          {social.platform}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}