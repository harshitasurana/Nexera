import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, ChevronRight, ArrowLeft, CheckCircle2, DollarSign } from "lucide-react";
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
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationEmail: string;
  status: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Part-time": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Internship": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Remote": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default function CareerDetail() {
  const [, params] = useRoute("/careers/:id");
  const id = params?.id ?? "";

  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<{ success: boolean; data: Career }>(`/careers/${id}`)
      .then((r) => {
        if (r.success) setCareer(r.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const applyEmail = career?.applicationEmail || "careers@nexera.dev";
  const applySubject = career ? `Application for ${career.title}` : "Job Application";
  const applyHref = `mailto:${applyEmail}?subject=${encodeURIComponent(applySubject)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !career) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-white/40">Job opening not found.</p>
        <Link href="/careers" className="text-sm text-white/60 hover:text-white underline">Browse all openings</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.04] bg-black/80 backdrop-blur-xl">
        <Link href="/" className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--app-font-display)" }}>
          Nexera
        </Link>
        <Link href="/careers" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> All Openings
        </Link>
      </nav>

      <div className="pt-28 pb-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Header */}
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${TYPE_COLORS[career.employmentType] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                  {career.employmentType}
                </span>
                <span className="text-xs text-white/30 border border-white/[0.06] px-2.5 py-0.5 rounded-full">
                  {career.department}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${career.status === "Open" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-white/30 border-white/10"}`}>
                  {career.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--app-font-display)" }}>
                {career.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-white/40">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {career.location}</span>
                {career.experience && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {career.experience}</span>}
                {career.salaryRange && <span className="flex items-center gap-1.5">Rs. {career.salaryRange}</span>}
              </div>
            </div>

            {/* Apply CTA */}
            {career.status === "Open" && (
              <a href={applyHref} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all mb-10">
                Apply Now <ChevronRight className="h-4 w-4" />
              </a>
            )}

            {/* Skills */}
            {career.skills.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((s) => (
                    <span key={s} className="text-sm px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-white/[0.06] my-10" />

            {/* Description */}
            <Section title="About the Role">
              <p className="text-white/60 leading-relaxed whitespace-pre-line">{career.description}</p>
            </Section>

            {/* Responsibilities */}
            {career.responsibilities.length > 0 && (
              <Section title="Responsibilities">
                <ul className="space-y-2.5">
                  {career.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60">
                      <CheckCircle2 className="h-4 w-4 text-white/20 mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Requirements */}
            {career.requirements.length > 0 && (
              <Section title="Requirements">
                <ul className="space-y-2.5">
                  {career.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60">
                      <CheckCircle2 className="h-4 w-4 text-white/20 mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Benefits */}
            {career.benefits.length > 0 && (
              <Section title="What We Offer">
                <ul className="space-y-2.5">
                  {career.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400/60 mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <div className="border-t border-white/[0.06] mt-12 pt-10">
              {career.status === "Open" ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <Briefcase className="h-8 w-8 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--app-font-display)" }}>
                    Ready to apply?
                  </h3>
                  <p className="text-white/30 text-sm mb-6 max-w-xs mx-auto">
                    Send your resume and a short intro to <span className="text-white/50">{applyEmail}</span>
                  </p>
                  <a href={applyHref} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all">
                    Apply Now <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <p className="text-white/30 text-sm">This position is currently closed. <Link href="/careers" className="text-white/60 underline">View open roles</Link></p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "var(--app-font-display)" }}>{title}</h2>
      {children}
    </div>
  );
}
