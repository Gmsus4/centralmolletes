import prisma from "@/lib/prisma"
import Link from "next/link"
import type { Metadata } from "next"
import { NavbarServer } from "@/components/shared/NavbarServer"
import { FooterServer } from "@/components/shared/FooterServer"
import type { BlogSection } from "@/lib/validators/blog"
import { autoPublishScheduled } from "@/lib/blog"
import { TitlePage } from "@/components/ui/TitlePage"
import { MarqueeStrip } from "@/components/ui/MarqueeStrip"
import { AdminEditWrapper } from "@/components/shared/AdminEditWrapper"
import { PencilIcon } from "lucide-react"
import { IconPencilCode } from "@tabler/icons-react"

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
      <main className="bg-background">
        <TitlePage section="blog" />
        <div className="max-w-7xl mx-auto px-6 lg:py-16 py-8">


          {posts.length === 0 ? (
            <p className="text-sm text-center py-24">
              Próximamente publicaremos nuestras primeras historias.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id} className="relative">
                  <AdminEditWrapper
                    href={`/admin/blog/${post.id}`}
                    tooltip="Editar blog"
                    side="top"
                    className="absolute top-2 right-2 z-10"
                    hideWhenNotAdmin
                  >
                    <div className="bg-background/90 backdrop-blur-sm border rounded p-1.5 shadow-sm hover:!opacity-100">
                      <IconPencilCode className="hover:opacity-60 transition-opacity" size={18} />
                    </div>
                  </AdminEditWrapper>
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-background border rounded-radius transition-colors duration-200 overflow-hidden"
                  >
                    {/* Cover */}
                    <div className="aspect-[4/3] overflow-hidden">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2 p-5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5">
                          {post.category}
                        </span>
                        <span className="text-[10px] opacity-85">
                          {new Date(post.publishedAt).toLocaleDateString("es-MX", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] opacity-85">
                          {post.readMins} min de lectura
                        </span>
                      </div>
                      <h2 className="font-medium leading-snug transition-colors text-2xl">
                        {post.title}
                      </h2>
                      <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-2 flex-1">{post.subtitle}</p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[9px] uppercase tracking-[0.15em]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {/* <MarqueeStrip /> */}
      <FooterServer />
    </>
  )
}