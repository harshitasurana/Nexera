import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react";
import { api } from "@/lib/api";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  featuredImage: string;
  createdAt: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get<{ success: boolean; data: Blog }>(`/blogs/${slug}`)
      .then((r) => { if (r.success) setBlog(r.data); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-white">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <button onClick={() => navigate("/blog")} className="text-white/40 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/[0.06] px-6 py-4 flex items-center gap-4 sticky top-0 bg-black/90 backdrop-blur-xl z-10">
        <button onClick={() => navigate("/blog")} className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" /> Blog
        </button>
        <span className="text-white/10">|</span>
        <span className="text-white font-semibold" style={{ fontFamily: "var(--app-font-display)" }}>Nexera</span>
      </nav>

      <article className="container mx-auto px-6 py-20 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Meta */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50">
              {blog.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              <Clock className="h-3 w-3" /> {blog.readTime} min read
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/30">
              <Calendar className="h-3 w-3" /> {new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{blog.title}</h1>

          <div className="flex items-center gap-3 pb-10 border-b border-white/[0.06] mb-10">
            <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-bold text-white/60">
              {blog.author.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-white/70">{blog.author}</div>
            </div>
          </div>

          {blog.featuredImage && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-white/[0.08]">
              <img src={blog.featuredImage} alt={blog.title} className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-p:text-white/60 prose-p:leading-relaxed
              prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-code:text-indigo-300 prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/[0.08]
              prose-blockquote:border-l-indigo-500 prose-blockquote:text-white/50
              prose-hr:border-white/[0.08]"
            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, "<br />") }}
          />

          {blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/[0.06] flex items-center gap-3 flex-wrap">
              <Tag className="h-4 w-4 text-white/30" />
              {blog.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </article>
    </div>
  );
}
