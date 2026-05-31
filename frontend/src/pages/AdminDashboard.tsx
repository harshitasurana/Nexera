import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Users, Mail, Briefcase, FileText, TrendingUp, LogOut, Search, RefreshCw, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  monthlyLeads: number;
  subscribers: number;
  projectInquiries: number;
  publishedBlogs: number;
  monthlyChart: { month: string; leads: number }[];
  serviceChart: { service: string; count: number }[];
  recentLeads: Lead[];
}

interface ContactsResponse {
  data: Lead[];
  total: number;
  pages: number;
}

const SERVICE_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#a78bfa", "#67e8f9"];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Contacted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "In Progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Closed: "bg-white/5 text-white/40 border-white/10",
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contacts, setContacts] = useState<Lead[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [contactPages, setContactPages] = useState(1);
  const [contactPage, setContactPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "projects" | "blogs" | "careers">("overview");
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("nexera_admin_token");
    navigate("/admin/login");
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: DashboardStats }>("/dashboard/stats");
      if (res.success) setStats(res.data);
    } catch {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchContacts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(contactPage),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      const res = await api.get<{ success: boolean } & ContactsResponse>(`/contact?${params}`);
      if (res.success) {
        setContacts(res.data);
        setTotalContacts(res.total);
        setContactPages(res.pages);
      }
    } catch { /* ignored */ }
  }, [contactPage, search, statusFilter]);

  useEffect(() => {
    const token = localStorage.getItem("nexera_admin_token");
    if (!token) { navigate("/admin/login"); return; }
    setLoading(true);
    Promise.all([fetchStats(), fetchContacts()]).finally(() => setLoading(false));
  }, [fetchStats, fetchContacts, navigate]);

  const deleteContact = async (id: string) => {
    await api.delete(`/contact/${id}`);
    void fetchContacts();
    void fetchStats();
  };

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/contact/${id}`, { status });
    void fetchContacts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-60 bg-white/[0.02] border-r border-white/[0.06] z-20 flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="text-lg font-bold" style={{ fontFamily: "var(--app-font-display)" }}>Nexera</div>
          <div className="text-xs text-white/30 mt-0.5">Admin Console</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "overview", icon: TrendingUp, label: "Overview" },
            { id: "leads", icon: Users, label: "Leads" },
            { id: "projects", icon: Briefcase, label: "Projects" },
            { id: "blogs", icon: FileText, label: "Blogs" },
            { id: "careers", icon: GraduationCap, label: "Careers" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="ml-60 p-8">
        {activeTab === "overview" && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-white/30 text-sm">Overview of Nexera's activity</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "text-indigo-400" },
                { label: "New Leads", value: stats.newLeads, icon: TrendingUp, color: "text-green-400" },
                { label: "This Month", value: stats.monthlyLeads, icon: TrendingUp, color: "text-blue-400" },
                { label: "Subscribers", value: stats.subscribers, icon: Mail, color: "text-purple-400" },
                { label: "Project Inquiries", value: stats.projectInquiries, icon: Briefcase, color: "text-yellow-400" },
                { label: "Published Blogs", value: stats.publishedBlogs, icon: FileText, color: "text-cyan-400" },
              ].map((s, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <s.icon className={`h-4 w-4 ${s.color} mb-3`} />
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/30 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white mb-5">Monthly Leads</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={stats.monthlyChart}>
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff" }} />
                    <Line type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white mb-5">Service Requests</h3>
                {stats.serviceChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.serviceChart}>
                      <XAxis dataKey="service" stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                      <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#fff" }} />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]}>
                        {stats.serviceChart.map((_, i) => (
                          <Cell key={i} fill={SERVICE_COLORS[i % SERVICE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-white/20 text-sm">No data yet</div>
                )}
              </div>
            </div>

            {/* Recent Leads */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">Recent Leads</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {stats.recentLeads.length === 0 ? (
                  <div className="px-6 py-8 text-center text-white/20 text-sm">No leads yet</div>
                ) : (
                  stats.recentLeads.map((lead) => (
                    <div key={lead._id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div>
                        <div className="text-sm font-medium text-white">{lead.firstName} {lead.lastName}</div>
                        <div className="text-xs text-white/30">{lead.email} · {lead.company}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/30">{lead.service}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[lead.status] ?? STATUS_COLORS["New"]}`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "leads" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Leads</h1>
                <p className="text-white/30 text-sm">{totalContacts} total contacts</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => void fetchContacts()}
                className="border-white/10 text-white/50 hover:text-white bg-transparent">
                <RefreshCw className="h-3.5 w-3.5 mr-2" /> Refresh
              </Button>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  placeholder="Search leads…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setContactPage(1); }}
                  className="pl-9 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/20 h-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setContactPage(1); }}
                className="h-10 px-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/70 text-sm focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Name", "Email", "Company", "Service", "Status", "Date", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {contacts.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-white/20">No leads found</td></tr>
                  ) : (
                    contacts.map((lead) => (
                      <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 font-medium text-white">{lead.firstName} {lead.lastName}</td>
                        <td className="px-4 py-3 text-white/50">{lead.email}</td>
                        <td className="px-4 py-3 text-white/50">{lead.company || "—"}</td>
                        <td className="px-4 py-3 text-white/50">{lead.service}</td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.status}
                            onChange={(e) => void updateStatus(lead._id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border bg-transparent cursor-pointer focus:outline-none ${STATUS_COLORS[lead.status] ?? STATUS_COLORS["New"]}`}
                          >
                            {["New", "Contacted", "In Progress", "Closed"].map((s) => (
                              <option key={s} value={s} className="bg-black text-white">{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-white/30">{new Date(lead.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => void deleteContact(lead._id)}
                            className="text-white/20 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {contactPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: contactPages }).map((_, i) => (
                  <button key={i} onClick={() => setContactPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${
                      contactPage === i + 1 ? "bg-white text-black" : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08]"
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1}} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Project Inquiries</h1>
              <p className="text-white/30 text-sm">Incoming project requests</p>
            </div>
            <ProjectsTab />
          </motion.div>
        )}

        {activeTab === "blogs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Blog Management</h1>
              <p className="text-white/30 text-sm">Create and manage blog posts</p>
            </div>
            <BlogsTab />
          </motion.div>
        )}

        {activeTab === "careers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Career Management</h1>
              <p className="text-white/30 text-sm">Manage job openings and postings</p>
            </div>
            <CareersTab />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ProjectsTab() {
  const [projects, setProjects] = useState<Array<{
    _id: string; name: string; email: string; company: string;
    projectType: string; budget: string; status: string; createdAt: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: typeof projects }>("/projects")
      .then((r) => { if (r.success) setProjects(r.data); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white/20 text-sm">Loading…</div>;

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {["Name", "Email", "Type", "Budget", "Status", "Date"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {projects.length === 0 ? (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-white/20">No project inquiries yet</td></tr>
          ) : projects.map((p) => (
            <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3 font-medium text-white">{p.name}</td>
              <td className="px-4 py-3 text-white/50">{p.email}</td>
              <td className="px-4 py-3 text-white/50">{p.projectType}</td>
              <td className="px-4 py-3 text-white/50">{p.budget || "—"}</td>
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 text-white/30">{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlogsTab() {
  const [blogs, setBlogs] = useState<Array<{
    _id: string; title: string; slug: string; category: string;
    published: boolean; readTime: number; createdAt: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "Technology", tags: "" });
  const [saving, setSaving] = useState(false);

  const fetchBlogs = () => {
    api.get<{ success: boolean; data: typeof blogs }>("/blogs?limit=50")
      .then((r) => { if (r.success) setBlogs(r.data); })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(fetchBlogs, []);

  const saveBlog = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);
    try {
      await api.post("/blogs", {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        published: false,
      });
      setForm({ title: "", content: "", category: "Technology", tags: "" });
      setShowForm(false);
      fetchBlogs();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    await api.put(`/blogs/${id}`, { published: !published }).catch(() => null);
    fetchBlogs();
  };

  const deleteBlog = async (id: string) => {
    await api.delete(`/blogs/${id}`).catch(() => null);
    fetchBlogs();
  };

  if (loading) return <div className="text-white/20 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowForm(!showForm)}
        className="bg-white text-black hover:bg-white/90 h-9 text-sm rounded-xl px-4 font-semibold">
        {showForm ? "Cancel" : "+ New Post"}
      </Button>

      {showForm && (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          <input
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-lg font-semibold focus:outline-none focus:border-white/20"
          />
          <textarea
            placeholder="Write your content here…"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={8}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20 resize-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20"
            />
            <input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20"
            />
          </div>
          <Button onClick={() => void saveBlog()} disabled={saving}
            className="bg-white text-black hover:bg-white/90 h-9 text-sm rounded-xl px-6 font-semibold">
            {saving ? "Saving…" : "Save Draft"}
          </Button>
        </div>
      )}

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Title", "Category", "Read Time", "Status", "Date", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {blogs.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/20">No blogs yet</td></tr>
            ) : blogs.map((b) => (
              <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate">{b.title}</td>
                <td className="px-4 py-3 text-white/50">{b.category}</td>
                <td className="px-4 py-3 text-white/50">{b.readTime} min</td>
                <td className="px-4 py-3">
                  <button onClick={() => void togglePublish(b._id, b.published)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                      b.published
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10"
                    }`}>
                    {b.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-4 py-3 text-white/30">{new Date(b.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => void deleteBlog(b._id)}
                    className="text-white/20 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CareerEntry {
  _id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  createdAt: string;
}

const EMPTY_CAREER = {
  title: "",
  department: "",
  location: "",
  employmentType: "Full-time",
  experience: "",
  salaryRange: "",
  skills: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  applicationEmail: "",
  status: "Open",
};

function CareersTab() {
  const [careers, setCareers] = useState<CareerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_CAREER);
  const [saving, setSaving] = useState(false);

  const fetchCareers = () => {
    api.get<{ success: boolean; data: CareerEntry[] }>("/careers?limit=50")
      .then((r) => { if (r.success) setCareers(r.data); })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  useEffect(fetchCareers, []);

  const parseLines = (str: string) => str.split("\n").map((s) => s.trim()).filter(Boolean);

  const saveCareer = async () => {
    if (!form.title || !form.department || !form.location || !form.description) return;
    setSaving(true);
    try {
      await api.post("/careers", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        responsibilities: parseLines(form.responsibilities),
        requirements: parseLines(form.requirements),
        benefits: parseLines(form.benefits),
      });
      setForm(EMPTY_CAREER);
      setShowForm(false);
      fetchCareers();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: string, status: string) => {
    await api.put(`/careers/${id}`, { status: status === "Open" ? "Closed" : "Open" }).catch(() => null);
    fetchCareers();
  };

  const deleteCareer = async (id: string) => {
    if (!confirm("Delete this job opening?")) return;
    await api.delete(`/careers/${id}`).catch(() => null);
    fetchCareers();
  };

  if (loading) return <div className="text-white/20 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowForm(!showForm)}
        className="bg-white text-black hover:bg-white/90 h-9 text-sm rounded-xl px-4 font-semibold">
        {showForm ? "Cancel" : "+ New Job Opening"}
      </Button>

      {showForm && (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Job Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20"
            />
            <input
              placeholder="Department *"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20"
            />
            <input
              placeholder="Location *"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20"
            />
            <select
              value={form.employmentType}
              onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20"
            >
              {["Full-time", "Part-time", "Internship", "Remote"].map((t) => (
                <option key={t} value={t} className="bg-black">{t}</option>
              ))}
            </select>
            <input
              placeholder="Experience Required (e.g. 2–4 years)"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20"
            />
            <input
              placeholder="Salary Range (optional)"
              value={form.salaryRange}
              onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20"
            />
            <input
              placeholder="Application Email"
              value={form.applicationEmail}
              onChange={(e) => setForm({ ...form, applicationEmail: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20"
            />
            <input
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20"
            />
          </div>
          <textarea
            placeholder="Job Description *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20 resize-none"
          />
          <textarea
            placeholder="Responsibilities (one per line)"
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            rows={3}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20 resize-none"
          />
          <textarea
            placeholder="Requirements (one per line)"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            rows={3}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20 resize-none"
          />
          <textarea
            placeholder="Benefits (one per line)"
            value={form.benefits}
            onChange={(e) => setForm({ ...form, benefits: e.target.value })}
            rows={3}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20 resize-none"
          />
          <Button onClick={() => void saveCareer()} disabled={saving || !form.title || !form.department || !form.location || !form.description}
            className="bg-white text-black hover:bg-white/90 h-9 text-sm rounded-xl px-6 font-semibold disabled:opacity-40">
            {saving ? "Saving…" : "Publish Job Opening"}
          </Button>
        </div>
      )}

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Title", "Department", "Location", "Type", "Status", "Date", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {careers.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-white/20">No job openings yet</td></tr>
            ) : careers.map((c) => (
              <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-medium text-white max-w-[160px] truncate">{c.title}</td>
                <td className="px-4 py-3 text-white/50">{c.department}</td>
                <td className="px-4 py-3 text-white/50">{c.location}</td>
                <td className="px-4 py-3 text-white/50">{c.employmentType}</td>
                <td className="px-4 py-3">
                  <button onClick={() => void toggleStatus(c._id, c.status)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                      c.status === "Open"
                        ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                        : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10"
                    }`}>
                    {c.status}
                  </button>
                </td>
                <td className="px-4 py-3 text-white/30">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => void deleteCareer(c._id)}
                    className="text-white/20 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
