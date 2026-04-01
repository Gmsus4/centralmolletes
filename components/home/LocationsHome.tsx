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
      className="bg-brand-primary xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-2 gap-0 px-6"
    >
      <div className="max-w-7xl">
        <div className="grid gap-2">
          <h2 className="text-text-titles font-title text-center text-3xl md:text-6xl leading-tight">
            Ven a visitarnos
          </h2>
          <p className="text-base text-text-main text-center">
            Estamos en el centro de Etzatlán, Jalisco.
          </p>
        </div>
      </div>
      <Locations className="py-6" locations={locations} />
    </section>
  )
}