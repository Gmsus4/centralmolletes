import LocationDetailClient from "@/components/locations/LocationDetailClient";
import { FooterServer } from "@/components/shared/FooterServer";
import { NavbarServer } from "@/components/shared/NavbarServer";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

// ── Caché de post individual ──
const getLocation = unstable_cache(
  async (slug: string) => prisma.location.findUnique({ where: { slug } }),
  ["location-data"],
  { revalidate: 3600, tags: ["locations"] }
)

// ── Prerenderiza todos los slugs en el build ──
export async function generateStaticParams() {
  const locations = await prisma.location.findMany({
    select: { slug: true },
  })
  return locations.map((l) => ({ id: l.slug }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const location = await prisma.location.findUnique({ where: { slug: id } });
  if (!location) return {};

  return {
    title: `${location.name} — ${location.city}`,
    metadataBase: new URL("https://centralmolletes.vercel.app/"),
    description: location.name,
    openGraph: {
      title: location.name,
      description: location.name,
      images: [{ url: location.image, width: 1200, height: 630, alt: location.name }],
      type: "website",
      locale: "es_MX",
    },
    twitter: {
      card: "summary_large_image",
      title: location.name,
      description: location.name,
      images: [location.image],
    },
  };
}

export default async function LocationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await getLocation(id)
  if (!raw) notFound();

  const location = {
    ...raw,
    gallery: JSON.parse(raw.gallery) as string[],
  };

  return (
    <>
      <NavbarServer />
      <LocationDetailClient location={location} />
      <FooterServer />
    </>
  );
}