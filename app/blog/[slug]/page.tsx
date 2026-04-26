import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { BlogSection } from "@/lib/validators/blog"
import { NavbarServer } from "@/components/shared/NavbarServer"
import { FooterServer } from "@/components/shared/FooterServer"
import GalleryCarousel from "../GalleryCarousel"
import SectionRenderer from "@/components/blog/SectionRenderer"
import ReadingProgress from "@/components/blog/ReadingProgress"
import ShareBar from "@/components/blog/ShareBar"
import RelatedPosts from "@/components/blog/RelatedPosts"

export const dynamicParams = true

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://centralmolletes.com"

async function getPost(slug: string) {
  return prisma.blog.findUnique({ where: { slug } })
}

export async function generateStaticParams() {
  const posts = await prisma.blog.findMany({ select: { slug: true } })
  return posts.map((p) => ({ slug: p.slug }))
}

export const revalidate = 3600

function readingTime(sections: BlogSection[]): number {
  const text = sections
    .map((s) => ("body" in s ? (s.body ?? "") : ""))
    .join(" ")
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post     = await getPost(slug)
  if (!post) return {}

  const sections = JSON.parse(post.sections) as BlogSection[]
  const description = (post.metaDescription || post.subtitle) ?? ""

  return {
    title:       post.title,
    description,
    openGraph: {
      title:         post.title,
      description,
      images:        post.coverImage ? [{ url: post.coverImage }] : [],
      type:          "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post     = await getPost(slug)
  if (!post) notFound()

  // Ocultar drafts y scheduled futuros en el público
  const isVisible =
    post.status === "published" ||
    (post.status === "scheduled" && new Date(post.publishedAt) <= new Date())
  if (!isVisible) notFound()

  const tags:     string[]      = JSON.parse(post.tags)
  const sections: BlogSection[] = JSON.parse(post.sections)
  const gallery:  string[]      = JSON.parse(post.gallery)
  const readMins                = readingTime(sections)
  const postUrl                 = `${BASE_URL}/blog/${post.slug}`

  return (
    <>
      <NavbarServer />
      <ReadingProgress />

      <main className="min-h-screen bg-background">

        {/* Hero */}
        <div className="relative w-full min-h-[440px] sm:min-h-0 sm:aspect-[16/7] overflow-hidden bg-bg-dark">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/85 via-bg-dark/30 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-8 py-8 sm:py-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 flex-wrap mb-3 sm:mb-4">
              <span className="text-[9px] uppercase tracking-[0.3em] text-bg-body/80 bg-bg-body/15 px-2 py-1">
                {post.category}
              </span>
              <span className="text-[10px] text-bg-body/50">
                {new Date(post.publishedAt).toLocaleDateString("es-MX", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
              <span className="text-[10px] text-bg-body/40">·</span>
              <span className="text-[10px] text-bg-body/50">{readMins} min de lectura</span>
              {post.author && (
                <>
                  <span className="text-[10px] text-bg-body/40">·</span>
                  <span className="text-[10px] text-bg-body/50">{post.author}</span>
                </>
              )}
            </div>
            <h1 className="font-titleText text-bg-body uppercase text-3xl sm:text-5xl lg:text-6xl leading-tight sm:leading-none mb-2 sm:mb-3">
              {post.title}
            </h1>
            <p className="text-bg-body/70 text-sm sm:text-lg max-w-2xl line-clamp-3 sm:line-clamp-none">
              {post.subtitle}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-14">

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase tracking-[0.2em] bg-background px-2.5 py-1"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Sections */}
          <SectionRenderer sections={sections} />

          {/* Galería */}
          <GalleryCarousel images={gallery} title={post.title} />

          {/* Divider */}
          <div className="flex items-center gap-3 mt-12 sm:mt-14">
            <span className="flex-1 h-px bg-background" />
            <span className="w-1 h-1 rounded-full bg-background" />
            <span className="flex-1 h-px bg-background" />
          </div>

          {/* Share */}
          <div className="mt-8">
            <ShareBar title={post.title} url={postUrl} />
          </div>

          {/* Related posts */}
          <RelatedPosts
            currentId={post.id}
            category={post.category}
            tags={tags}
          />
        </div>
      </main>
      <FooterServer />
    </>
  )
}