"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Calendar, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/constants/blog-posts";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Simple markdown-like rendering (handles ##, ```, **, |tables|)
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = "";

    const flushCode = () => {
      if (codeLines.length > 0) {
        elements.push(
          <pre
            key={`code-${elements.length}`}
            className="my-4 overflow-x-auto rounded-lg border border-surface-800 bg-surface-950 p-4"
          >
            <code className="text-[13px] leading-relaxed text-surface-300">
              {codeLines.join("\n")}
            </code>
          </pre>
        );
        codeLines = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;

      // Code block
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          flushCode();
        } else {
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Empty line
      if (line.trim() === "") {
        continue;
      }

      // H2
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={i}
            className="mb-3 mt-8 text-xl font-bold text-white first:mt-0"
          >
            {line.slice(3)}
          </h2>
        );
        continue;
      }

      // Table
      if (line.startsWith("|")) {
        const tableLines: string[] = [line];
        let j = i + 1;
        while (j < lines.length && lines[j]!.startsWith("|")) {
          tableLines.push(lines[j]!);
          j++;
        }
        i = j - 1;

        const rows = tableLines
          .filter((l) => !l.match(/^\|[\s-|]+\|$/))
          .map((l) =>
            l
              .split("|")
              .filter(Boolean)
              .map((c) => c.trim())
          );

        if (rows.length > 0) {
          elements.push(
            <div
              key={`table-${i}`}
              className="my-4 overflow-x-auto rounded-lg border border-surface-800"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-800 bg-surface-900/50">
                    {rows[0]!.map((cell, ci) => (
                      <th
                        key={ci}
                        className="px-4 py-2 text-left font-medium text-surface-400"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((row, ri) => (
                    <tr key={ri} className="border-b border-surface-800/50">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2 text-surface-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // List item
      if (line.startsWith("- ")) {
        elements.push(
          <li
            key={i}
            className="ml-4 list-disc text-surface-300 leading-relaxed"
          >
            {line.slice(2)}
          </li>
        );
        continue;
      }

      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li
            key={i}
            className="ml-4 list-decimal text-surface-300 leading-relaxed"
          >
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
        continue;
      }

      // Paragraph with inline code and bold
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="rounded bg-surface-800 px-1.5 py-0.5 text-xs text-brand-400">$1</code>');

      elements.push(
        <p
          key={i}
          className="my-2 leading-relaxed text-surface-300"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="border-b border-surface-800/50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All Posts
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs font-medium text-brand-400">
              {post.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-surface-500">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="prose-surface">{renderContent(post.content)}</div>

        {/* Footer */}
        <div className="mt-16 border-t border-surface-800 pt-8">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
