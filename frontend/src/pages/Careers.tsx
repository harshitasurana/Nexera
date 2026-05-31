import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, ChevronRight, Search, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

interface Career {
  _id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  salaryRange: string;
  skills: string[];
  status: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Part-time": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Internship": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Remote": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default function Careers() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    api.get<{ success: boolean; data: Career[] }>("/careers?status=Open")
      .then((r) => { if (r.success) setCareers(r.data); else setError(true); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const departments = Array.from(new Set(careers.map((c) => c.department)));

  const filtered = careers.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || c.employmentType === typeFilter;
    const matchDept = departmentFilter === "all" || c.department === departmentFilter;
    return matchSearch && matchType && matchDept;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.04] bg-black/80 backdrop-blur-xl">
        <Link href="/" className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--app-font-display)" }}>
          Nexera
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="container mx-auto max-w-5xl relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/40 mb-6">
              <Briefcase className="h-3 w-3" /> Join our team
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white" style={{ fontFamily: "var(--app-font-display)" }}>
              Build the Future<br />
              <span className="text-white/30">With Us</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
              Join Nexera and help shape next-generation software, AI systems, and digital products used by companies worldwide.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 pb-8">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                placeholder="Search roles, departments, locations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 h-11 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-11 px-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/70 text-sm focus:outline-none min-w-[140px]"
            >
              <option value="all">All Types</option>
              {["Full-time", "Part-time", "Internship", "Remote"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {departments.length > 0 && (
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="h-11 px-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/70 text-sm focus:outline-none min-w-[160px]"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Job list */}
      <div className="px-6 pb-24">
        <div className="container mx-auto max-w-5xl">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-24 text-white/30">
              <p>Failed to load job openings. Please try again later.</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-7 w-7 text-white/20" />
              </div>
              <h3 className="text-lg font-semibold text-white/40 mb-2">
                {search || typeFilter !== "all" || departmentFilter !== "all"
                  ? "No matching openings"
                  : "No open positions right now"}
              </h3>
              <p className="text-white/20 text-sm max-w-xs mx-auto">
                {search || typeFilter !== "all" || departmentFilter !== "all"
                  ? "Try adjusting your filters."
                  : "Check back soon — we're growing fast."}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <p className="text-white/30 text-sm mb-5">{filtered.length} open position{filtered.length !== 1 ? "s" : ""}</p>
              {filtered.map((job, i) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/careers/${job._id}`}>
                    <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200 cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border ${TYPE_COLORS[job.employmentType] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                              {job.employmentType}
                            </span>
                            <span className="text-xs text-white/30 border border-white/[0.06] px-2.5 py-0.5 rounded-full">
                              {job.department}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-white/30">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" /> {job.location}
                            </span>
                            {job.experience && (
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> {job.experience}
                              </span>
                            )}
                            {job.salaryRange && (
                              <span className="text-white/40">{job.salaryRange}</span>
                            )}
                          </div>
                          {job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {job.skills.slice(0, 5).map((skill) => (
                                <span key={skill} className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] text-white/40 border border-white/[0.06]">
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 5 && (
                                <span className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] text-white/30">
                                  +{job.skills.length - 5}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-24 border-t border-white/[0.06] pt-20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--app-font-display)" }}>
            Don't see the right role?
          </h2>
          <p className="text-white/30 mb-8">We're always looking for talented people. Send us your resume and we'll reach out when something fits.</p>
          <a
            href="mailto:careers@nexera.dev"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all"
          >
            Send Open Application <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
