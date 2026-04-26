import { unstable_cache } from "next/cache"
import prisma from "@/lib/prisma"
import { Locations } from "../locations/Locations"
import { getSectionContentWithIds } from "@/lib/siteContent"
import { AdminEditWrapper } from "../shared/AdminEditWrapper"

const getLocations = unstable_cache(
  async () => prisma.location.findMany({ orderBy: [{ createdAt: "desc" }] }),
  ["locations-home"],
  { revalidate: 3600, tags: ["locations"] }
)

export const LocationsHome = async () => {
  const [locations, content] = await Promise.all([
    getLocations(),
    getSectionContentWithIds("locations"),
  ])

  return (
    <section
      aria-labelledby="locations-title"
      className="bg-background xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-2 gap-0 px-6 relative"
    >
      <div className="z-10 max-w-7xl">
        <div className="grid gap-2">
          <AdminEditWrapper href={`/admin/site-content/${content["locations.title"]?.id}`} tooltip="Editar título">
            <h2 className="font-title text-center text-3xl md:text-6xl leading-tight hover:opacity-60 transition-opacity">
              {content["locations.title"]?.value ?? "Ven a visitarnos"}
            </h2>
          </AdminEditWrapper>
          <AdminEditWrapper href={`/admin/site-content/${content["locations.subtitle"]?.id}`} tooltip="Editar subtítulo">
            <p className="text-base text-center hover:opacity-60 transition-opacity opacity-90">
              {content["locations.subtitle"]?.value ?? "Estamos en el centro de Etzatlán, Jalisco."}
            </p>
          </AdminEditWrapper>
        </div>
      </div>
      <Locations className="py-6 z-10" locations={locations} />
    </section>
  )
}