import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { BLOG_POSTS } from "@/lib/constants/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages = [
    "",
    "/pricing",
    "/models",
    "/templates",
    "/docs",
    "/developers",
    "/blog",
    "/about",
    "/contact",
    "/status",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/pricing" ? 0.9 : 0.7,
  }));

  // Blog posts
  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
