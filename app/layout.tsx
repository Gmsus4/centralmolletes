import type { Metadata } from "next"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { getCurrentTheme } from "@/lib/theme"
import prisma from "@/lib/prisma"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const revalidate = 3600

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://centralmolletes.netlify.app/"),

  title: {
    default: "Central Molletes",
    template: "%s — Central Molletes",
  },

  description: "Cafetería en Etzatlán, Jalisco. Molletes, café y más desde 2020. ¡Visítanos!",

  keywords: ["molletes", "cafetería", "Etzatlán", "Jalisco", "desayunos", "café", "comida", "restaurante Etzatlán", "Central Molletes"],

  authors: [{ name: "Central Molletes" }],
  creator: "Central Molletes",

  openGraph: {
    title: "Central Molletes",
    description: "Cafetería en Etzatlán, Jalisco. Molletes, café y más desde 2020. ¡Visítanos!",
    url: process.env.NEXT_PUBLIC_BASE_URL ?? "https://centralmolletes.netlify.app/",
    siteName: "Central Molletes",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Central Molletes — Cafetería en Etzatlán, Jalisco",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Central Molletes",
    description: "Cafetería en Etzatlán, Jalisco. Molletes, café y más desde 2020.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  manifest: "/site.webmanifest",

  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
    const [theme, contact, schedules] = await Promise.all([
      getCurrentTheme(),
      prisma.contactInfo.findFirst({
        include: { socialLinks: { where: { isActive: true }, orderBy: { order: "asc" } } },
      }),
      prisma.schedule.findMany({
        where: { isActive: true },
        include: { shifts: true },
        orderBy: { dayOfWeek: "asc" },
      }),
    ])

    // Mapeo de días del schema (español) al formato que espera Schema.org (inglés)
    const dayMap: Record<string, string> = {
      LUNES:     "Monday",
      MARTES:    "Tuesday",
      MIERCOLES: "Wednesday",
      JUEVES:    "Thursday",
      VIERNES:   "Friday",
      SABADO:    "Saturday",
      DOMINGO:   "Sunday",
    }

    // Cada Schedule tiene varios Shifts — generamos una entrada por cada combinación
    const openingHours = schedules.flatMap((schedule) =>
      schedule.shifts.map((shift) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayMap[schedule.dayOfWeek],
        opens: shift.openTime,    // "08:30"
        closes: shift.closeTime,  // "13:00"
        name: shift.name ?? undefined, // "Matutino", "Vespertino"…
      }))
    )

    // Redes sociales activas como array de URLs
    const sameAs = contact?.socialLinks
      .filter((s) => s.url)
      .map((s) => s.url) ?? []

     const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CafeOrCoffeeShop",
        name: "Central Molletes",
        url: process.env.NEXTAUTH_URL,
        image: `${process.env.NEXTAUTH_URL}/og-image.jpg`,
        description: "Cafetería en Etzatlán, Jalisco. Molletes, café y más desde 2020.",
        telephone: contact?.phone ?? undefined,
        email: contact?.email ?? undefined,
        address: contact?.address
          ? {
              "@type": "PostalAddress",
              streetAddress: contact.address,
              addressLocality: "Etzatlán",
              addressRegion: "Jalisco",
              addressCountry: "MX",
            }
          : undefined,
        openingHoursSpecification: openingHours,
        sameAs,
      }

  return (
    <html
      lang="es"
      style={
        {
          "--bg-body": theme?.bgBody || "#FDFBF0",
          "--bg-dark": theme?.bgDark || "#1A1600",

          "--text-main": theme?.textMain || "#2D2410",
          "--text-titles": theme?.textTitles || "#1A1200",
          "--text-muted": theme?.textMuted || "#726B5A",
          "--text-invert": theme?.textInvert || "#FDFBF0",

          "--brand-primary": theme?.brandPrimary || "#DDBB02",
          "--brand-primary-hover": theme?.brandPrimaryHover || "#F5CF03",
          "--brand-contrast": theme?.brandContrast || "#3D3200",
          "--brand-contrast-hover": theme?.brandContrastHover || "#5C4B00",

          "--border-color": theme?.borderColor || "#000000",
          "--status-error": theme?.statusError || "#000000",
          "--shadow-color": theme?.shadowColor || "#000000",

          "--radius": theme?.radius || "8px",
          "--radius-full": theme?.radiusFull || "9999px",
          "--font-title": theme?.fontTitle || '"Lobster Two", cursive',
          "--font-body": theme?.fontBody || '"Onest Variable", sans-serif',
        } as React.CSSProperties
      } className={cn("font-sans", geist.variable)}
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SessionProvider>
           <TooltipProvider>
            {children}
           </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
