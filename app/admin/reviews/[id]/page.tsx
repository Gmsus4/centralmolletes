import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import ReviewForm from "../ReviewForm"
import { ReviewStatus } from "@/lib/validators/reviews"

export const dynamic = "force-dynamic"

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }   = await params
  const review   = await prisma.review.findUnique({ where: { id } })
  if (!review) notFound()

  return (
    <ReviewForm
      review={{
        ...review,
        status: review.status as ReviewStatus,
        photo:  review.photo ?? "",
      }}
    />
  )
}