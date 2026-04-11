import { unstable_cache } from "next/cache"
import prisma             from "@/lib/prisma"
import { Locations }      from "../locations/Locations"

const getLocations = unstable_cache(
  async () => prisma.location.findMany({ orderBy: [{ createdAt: "desc" }] }),
  ["locations-home"],
  { revalidate: 3600, tags: ["locations"] }
)

export const LocationsHome = async () => {
  const locations = await getLocations()

  return (
    <section
      aria-labelledby="locations-title"
      className="bg-bg-body xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-2 gap-0 px-6 relative"
      // style={{
      //   backgroundImage: "url('/hero.webp')",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center center",
      //   backgroundRepeat: "repeat"
      // }}
    >
      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-bg-dark" style={{ opacity: 0.75 }} /> */}

      <div className="z-10 max-w-7xl">
        <div className="grid gap-2">
          <h2 className="text-text-titles font-title text-center text-3xl md:text-6xl leading-tight">
            Ven a visitarnos
          </h2>
          <p className="text-base text-text-main/90 text-center">
            Estamos en el centro de Etzatlán, Jalisco.
          </p>
        </div>
      </div>
      <Locations className="py-6 z-10" locations={locations} />
    </section>
  )
}