import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import BlogForm from "../BlogForm"
import { BlogStatus } from "@/lib/validators/blog"

export const dynamic = "force-dynamic"

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post   = await prisma.blog.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <BlogForm
      blog={{
        ...post,
        status:      post.status as BlogStatus,
        gallery:     JSON.parse(post.gallery)  as string[],
        tags:        JSON.parse(post.tags)      as string[],
        sections:    JSON.parse(post.sections),
        publishedAt: post.publishedAt.toISOString(),
      }}
    />
  )
}