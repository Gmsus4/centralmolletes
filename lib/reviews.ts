// lib/reviews.ts
import { unstable_cache } from "next/cache"
import prisma from "@/lib/prisma"

export const getTopReviews = unstable_cache(
  () =>
    prisma.review.findMany({
      where: { status: "visible" },
      orderBy: { order: "asc" },
      take: 3,
    }),
  ["top-reviews"],
  { tags: ["reviews"] }
)