import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; token: string; message?: string }>(
        "/auth/login",
        { email, password }
      );
      if (res.token) {
        localStorage.setItem("nexera_admin_token", res.token);
        navigate("/admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative"
      style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[200px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <div className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--app-font-display)" }}>Nexera</div>
          <p className="text-white/30 text-sm">Admin Console</p>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-6">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 uppercase tracking-wide font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexera.tech"
                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20 h-11"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 uppercase tracking-wide font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/20 focus-visible:ring-white/20 h-11"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-white/90 h-11 font-semibold rounded-xl mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          First time?{" "}
          <a href="/api/auth/seed" className="text-white/40 hover:text-white/60 transition-colors underline">
            Seed admin account
          </a>
        </p>
      </motion.div>
    </div>
  );
}
