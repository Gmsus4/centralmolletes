import Image from "next/image"
import Link from "next/link"
import { getSiteImages } from "@/lib/siteImages"
import { AdminImageWrapper } from "@/components/shared/AdminImageWrapper"
import { LocationAdminEdit } from "./LocationAdminEdit"

interface Location {
  id: string
  slug: string
  city: string
  name: string
  address: string
  addressMin: string
  phone: string
  hours: string
  image: string
  gallery: string
  mapUrl: string
  embedUrl: string
  createdAt: Date
  updatedAt: Date
}

interface Props {
  className?: string
  locations: Location[]
}

export const Locations = async ({ className = "bg-brand-primary py-10", locations = [] }: Props) => {
  const isOdd = locations.length % 2 !== 0
  const aboutImages = await getSiteImages("locations")

  return (
    <div className={className}>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 grid-cols-1 gap-6 items-stretch">

        {/* Imagen izquierda */}
        <div className="overflow-hidden rounded-radius order-2 lg:order-1 min-h-72">
          <AdminImageWrapper
            href={`/admin/site-images/${aboutImages[0].id}`}
            className="h-full"
          >
            <Image
              width={800} height={600}
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
              src={aboutImages[0]?.src ?? ""}
              alt="Ubicación"
              className="h-full w-full object-cover"
            />
          </AdminImageWrapper>
        </div>

        {/* Cards de locations */}
        <div className="grid grid-cols-2 order-1 lg:gap-5 gap-2 lg:order-2">
          {locations.map((location, index) => {
            const isLast = index === locations.length - 1
            return (
              <div
                key={location.id}
                className={`relative overflow-hidden isolate rounded-radius p-0 flex flex-col justify-end text-text-invert min-h-[180px] group ${isOdd && isLast ? "col-span-2" : "col-span-1"}`}
                style={{ backgroundImage: `url(${location.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
              >
                <div
                  className="relative z-10 flex flex-col gap-2 rounded-radius p-4 justify-end"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)" }}
                >
                  <span className="bg-bg-dark text-text-invert px-2 py-1 mb-2 rounded-md text-[10px] uppercase tracking-wide w-fit">
                    {location.city}
                  </span>
                  <p className="font-semibold text-sm leading-tight">{location.addressMin}</p>
                  <p className="text-xs text-white/80">{location.hours}</p>
                  <div className="flex items-center gap-2 mt-3 justify-between">
                    <Link
                      href={`/locations/${location.slug}`}
                      className="w-fit bg-brand-primary text-black text-xs font-semibold px-4 py-2 rounded-md transition hover:bg-brand-primary/90"
                    >
                      Ver dirección →
                    </Link>
                    <LocationAdminEdit locationId={location.id} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}