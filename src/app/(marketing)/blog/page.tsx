"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Sparkles, User } from "lucide-react";
import {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  type BlogPost,
} from "@/lib/constants/blog-posts";

function PostCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="gpu-card overflow-hidden"
        >
          <div
            className={`h-48 rounded-lg bg-gradient-to-br ${post.coverGradient} flex items-end p-6`}
          >
            <div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {post.category}
              </span>
              <h2 className="mt-3 text-2xl font-bold text-white">
                {post.title}
              </h2>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm leading-relaxed text-surface-400">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-surface-500">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.author}
                </span>
                <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime}
                </span>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors group-hover:text-brand-300">
                Read
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="gpu-card flex flex-col"
      >
        <div
          className={`h-2 rounded-t-lg bg-gradient-to-r ${post.coverGradient} -mx-6 -mt-6 mb-4`}
        />
        <span className="text-[11px] font-medium text-surface-500">
          {post.category}
        </span>
        <h3 className="mt-1 font-semibold text-white group-hover:text-brand-400 transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-surface-400">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-surface-500">
          <span>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function BlogPage() {
  const [category, setCategory] = useState("All");

  const filtered =
    category === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === category);

  const featuredPost = filtered.find((p) => p.featured);
  const otherPosts = filtered.filter((p) => p !== featuredPost);

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-surface-800/50">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-sm text-brand-400">
              <BookOpen className="h-4 w-4" />
              Blog
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Wollnut Labs Blog
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-400">
              Guides, tutorials, and updates from the Wollnut Labs team.
              Learn how to get the most out of GPU cloud computing.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-brand-600 text-white"
                  : "bg-surface-800 text-surface-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featuredPost && <PostCard post={featuredPost} featured />}

        {/* Other posts */}
        {otherPosts.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-surface-600" />
            <h3 className="mt-4 text-lg font-medium text-white">
              No posts in this category yet
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
