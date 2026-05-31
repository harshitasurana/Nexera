import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { api } from "@/lib/api";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  createdAt: string;
}

export default function BlogList() {
  const [, navigate] = useLocation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const params = category !== "all" ? `?published=true&category=${category}` : "?published=true";
    api.get<{ success: boolean; data: Blog[] }>(`/blogs${params}`)
      .then((r) => { if (r.success) setBlogs(r.data); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [category]);

  const categories = ["all", ...Array.from(new Set(blogs.map((b) => b.category)))];

  return (
    <div className="min-h-screen bg-black text-white"
      style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      <nav className="border-b border-white/[0.06] px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/")} className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>
        <span className="text-white/10">|</span>
        <span className="text-white font-semibold" style={{ fontFamily: "var(--app-font-display)" }}>Nexera</span>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Insights</p>
          <h1 className="text-5xl font-bold text-white mb-4">Blog</h1>
          <p className="text-white/40 text-lg max-w-xl">Thoughts, insights, and updates from the Nexera team.</p>
        </motion.div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-white text-black"
                  : "bg-white/[0.03] border border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70"
              }`}>
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-white/20">
            <p className="text-lg">No posts published yet.</p>
            <p className="text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(`/blog/${blog.slug}`)}
                className="group p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04] cursor-pointer transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40">
                    {blog.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/25">
                    <Clock className="h-3 w-3" /> {blog.readTime} min
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-3 group-hover:text-white/90 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed flex-1 line-clamp-3">{blog.excerpt}</p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/50 font-medium">{blog.author}</div>
                    <div className="text-xs text-white/25 mt-0.5">{new Date(blog.createdAt).toLocaleDateString()}</div>
                  </div>
                  {blog.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 text-white/20">
                      <Tag className="h-3 w-3" />
                      <span className="text-xs">{blog.tags[0]}</span>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
