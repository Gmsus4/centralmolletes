import prisma from "@/lib/prisma"
import Link from "next/link"

type Props = {
  currentId: string
  category:  string
  tags:      string[]
}

export default async function RelatedPosts({ currentId, category, tags }: Props) {
  const related = await prisma.blog.findMany({
    where: {
      id:  { not: currentId },
      OR: [
        { status: "published" },
        { status: "scheduled", publishedAt: { lte: new Date() } },
      ],
      AND: {
        OR: [
          { category },
          { tags: { contains: tags[0] ?? "" } },
        ],
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  })

  if (related.length === 0) return null

  return (
    <div className="mt-14 sm:mt-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400">También te puede interesar</span>
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white border border-stone-200 hover:border-stone-300 transition-colors duration-200 overflow-hidden"
          >
            <div className="aspect-[4/3] overflow-hidden bg-stone-100">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-stone-100" />
              )}
            </div>
            <div className="flex flex-col gap-1.5 p-4">
              <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400">
                {post.category}
              </span>
              <h3 className="text-sm font-medium text-stone-900 leading-snug group-hover:text-stone-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <span className="text-[10px] text-stone-300">
                {new Date(post.publishedAt).toLocaleDateString("es-MX", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}