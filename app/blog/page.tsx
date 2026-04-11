import prisma from "@/lib/prisma"
import Link from "next/link"
import type { Metadata } from "next"
import { NavbarServer } from "@/components/shared/NavbarServer"
import { FooterServer } from "@/components/shared/FooterServer"
import type { BlogSection } from "@/lib/validators/blog"
import { autoPublishScheduled } from "@/lib/blog"
import { TitlePage } from "@/components/ui/TitlePage"

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos, historias y noticias de Central Molletes Cafetería. Entre granos de café y letras compartidas.",
  openGraph: {
    title: "Blog — Central Molletes",
    description: "Artículos, historias y noticias de Central Molletes Cafetería.",
    url: "/blog",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}

export const revalidate = 60

function readingTime(sections: BlogSection[]): number {
  const text = sections
    .map((s) => ("body" in s ? (s.body ?? "") : ""))
    .join(" ")
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function BlogPage() {
  await autoPublishScheduled()
  const raw = await prisma.blog.findMany({
    where: {
      OR: [
        { status: "published" },
        { status: "scheduled", publishedAt: { lte: new Date() } },
      ],
    },
    orderBy: { publishedAt: "desc" },
  })

  const posts = raw.map((p) => {
    const sections = JSON.parse(p.sections) as BlogSection[]
    return {
      ...p,
      tags:     JSON.parse(p.tags) as string[],
      sections,
      readMins: readingTime(sections),
    }
  })

  return (
    <>
      <NavbarServer />
      <main className="bg-stone-50">
        <TitlePage title={"Blog Page"} subtitle={"Subtitle Page"} />
        <div className="max-w-5xl mx-auto px-6 py-16">


          {posts.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-24">
              Próximamente publicaremos nuestras primeras historias.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white border rounded-radius border-stone-200 hover:border-stone-300 transition-colors duration-200 overflow-hidden"
                >
                  {/* Cover */}
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

                  {/* Content */}
                  <div className="flex flex-col gap-2 p-5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 bg-stone-100 px-2 py-0.5">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-stone-300">
                        {new Date(post.publishedAt).toLocaleDateString("es-MX", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                      <span className="text-[10px] text-stone-300">
                        {post.readMins} min de lectura
                      </span>
                    </div>
                    <h2 className="font-medium text-stone-900 leading-snug group-hover:text-stone-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-xs text-stone-400 line-clamp-2 flex-1">{post.subtitle}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[9px] uppercase tracking-[0.15em] text-stone-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <FooterServer />
    </>
  )
}