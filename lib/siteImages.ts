// lib/siteImages.ts
import { unstable_cache } from "next/cache"
import prisma from "@/lib/prisma"

export const getSiteImages = unstable_cache(
  (section: string) =>
    prisma.siteImage.findMany({
      where:   { section },
      orderBy: { order: "asc" },
    }),
  ["site-images"],
  { tags: ["site-images"], revalidate: 3600 }
)