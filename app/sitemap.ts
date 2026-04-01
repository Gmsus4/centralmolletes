// app/sitemap.ts
import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                    lastModified: new Date(), priority: 1,   changeFrequency: "daily" },
    { url: `${baseUrl}/menu`,          lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${baseUrl}/blog`,          lastModified: new Date(), priority: 0.7, changeFrequency: "weekly" },
    { url: `${baseUrl}/locations`,     lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/schedule`,      lastModified: new Date(), priority: 0.6, changeFrequency: "monthly" },
    { url: `${baseUrl}/contact`,       lastModified: new Date(), priority: 0.5, changeFrequency: "yearly" },
  ]

  const [blogPosts, products, locations] = await Promise.all([
    prisma.blog.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.location.findMany({ select: { slug: true, updatedAt: true } }),
  ])

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/menu/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const locationRoutes: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${baseUrl}/locations/${location.slug}`,
    lastModified: location.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes, ...productRoutes, ...locationRoutes]
}