import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useScroll, useInView, animate, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowRight, Code, Cpu, Database, Cloud, Zap, Rocket, Users,
  Globe, Mail, Phone, Linkedin, Github, Twitter,
  Target, FastForward, GraduationCap, HeartPulse, PieChart, Home as HomeIcon, Truck,
  Quote, ChevronRight
} from "lucide-react";
import {
  SiReact, SiNextdotjs, SiHtml5, SiCss, SiTailwindcss,
  SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiPython,
  SiTensorflow, SiOpencv, SiDocker, SiVercel, SiRender,
  SiLangchain, SiHuggingface
} from "react-icons/si";

function Counter({ from, to, duration, suffix = "" }: { from: number; to: number; duration: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        if (ref.current) ref.current.textContent = Math.round(value) + suffix;
      }
    });
    return () => controls.stop();
  }, [inView, from, to, duration, suffix]);
  return <span ref={ref}>{from}{suffix}</span>;
}

function TransitionOverlay({ isVisible }: { isVisible: boolean }) {
  const particles = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      duration: Math.random() * 2 + 1,
      size: Math.random() * 2 + 1,
    })), []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.97)", backdropFilter: "blur(12px)" }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -120], opacity: [0, 0.6, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
            />
          ))}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-5xl font-bold tracking-[0.3em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            style={{ fontFamily: "var(--app-font-display)" }}
          >
            NEXERA
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WireframeGlobe() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-64 h-64 rounded-full bg-white/[0.03] blur-[80px]" />
      <div className="relative w-72 h-72" style={{ animation: "spin 30s linear infinite" }}>
        <svg viewBox="-100 -100 200 200" className="w-full h-full">
          <circle cx="0" cy="0" r="90" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
          {[-60, -30, 0, 30, 60].map((lat, i) => {
            const rad = (lat * Math.PI) / 180;
            const rx = Math.cos(rad) * 90;
            const cy = Math.sin(rad) * 90;
            return <ellipse key={i} cx="0" cy={cy} rx={Math.max(rx, 1)} ry={Math.max(Math.abs(rx * 0.14), 1)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />;
          })}
          {[0, 30, 60, 90, 120, 150].map((lon, i) => (
            <ellipse key={i} cx="0" cy="0" rx={Math.max(Math.abs(Math.cos((lon * Math.PI) / 180)) * 90, 4)} ry="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" transform={`rotate(${lon})`} />
          ))}
          <circle cx="25" cy="-35" r="2.5" fill="#6366f1" opacity="0.9" />
          <circle cx="-45" cy="15" r="2" fill="#8b5cf6" opacity="0.8" />
          <circle cx="60" cy="5" r="2.5" fill="#6366f1" opacity="0.9" />
          <circle cx="-15" cy="55" r="2" fill="#06b6d4" opacity="0.7" />
          <circle cx="75" cy="-65" r="1.5" fill="#6366f1" opacity="0.6" />
          <circle cx="-70" cy="-40" r="2" fill="#8b5cf6" opacity="0.7" />
          <line x1="25" y1="-35" x2="60" y2="5" stroke="rgba(99,102,241,0.35)" strokeWidth="0.6" />
          <line x1="-45" y1="15" x2="-15" y2="55" stroke="rgba(139,92,246,0.3)" strokeWidth="0.6" />
          <line x1="25" y1="-35" x2="-45" y2="15" stroke="rgba(99,102,241,0.2)" strokeWidth="0.5" />
          <line x1="60" y1="5" x2="-15" y2="55" stroke="rgba(6,182,212,0.2)" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute inset-[4%] rounded-full border border-white/[0.05]" style={{ animation: "spin 20s linear infinite" }} />
      <div className="absolute inset-[14%] rounded-full border border-white/[0.04]" style={{ animation: "spin 15s linear infinite reverse" }} />
    </div>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -12;
    setTilt({ x, y });
  };
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 backdrop-blur-sm cursor-default transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.04)] h-full"
    >
      {children}
    </motion.div>
  );
}

const services = [
  { title: "Web Development", icon: <Code className="h-5 w-5 text-white" />, desc: "Build fast, responsive, and scalable websites and web applications.", items: ["Business Websites", "E-commerce Platforms", "SaaS Applications", "Portfolio Websites", "Admin Dashboards"] },
  { title: "Custom Software", icon: <Database className="h-5 w-5 text-white" />, desc: "Tailored software solutions built around your business needs.", items: ["CRM Systems", "ERP Solutions", "Workflow Management", "API Development", "Cloud Integration"] },
  { title: "AI & Machine Learning", icon: <Cpu className="h-5 w-5 text-white" />, desc: "Intelligent systems powered by modern AI technologies.", items: ["Chatbots", "Computer Vision", "Predictive Analytics", "Recommendation Systems", "Generative AI"] },
  { title: "Automation Solutions", icon: <Zap className="h-5 w-5 text-white" />, desc: "Automate repetitive business processes and increase productivity.", items: ["AI Agents", "Workflow Automation", "Data Processing", "Business Automation", "System Integrations"] }
];

const technologies = {
  Frontend: [
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
    { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
    { name: "CSS3", icon: SiCss, color: "#1572B6" },
    { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  ],
  Backend: [
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "Express", icon: SiExpress, color: "#FFFFFF" },
  ],
  Database: [
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  ],
  "AI & ML": [
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
    { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8" },
    { name: "LangChain", icon: SiLangchain, color: "#FFFFFF" },
    { name: "Hugging Face", icon: SiHuggingface, color: "#FFD21E" },
  ],
  Cloud: [
    { name: "AWS", icon: Cloud, color: "#FF9900" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
    { name: "Render", icon: SiRender, color: "#46E3B7" },
  ]
};

const projects = [
  { title: "AI Resume Analyzer", tags: ["React", "Python", "NLP"], desc: "AI-powered resume screening and ranking platform for enterprise hiring." },
  { title: "Smart Attendance System", tags: ["Next.js", "OpenCV", "AWS"], desc: "Face recognition attendance management system at scale." },
  { title: "E-commerce Platform", tags: ["MERN", "Stripe"], desc: "Modern MERN stack online shopping solution with real-time inventory." },
  { title: "Medical Diagnosis Assistant", tags: ["React", "TensorFlow", "Node.js"], desc: "AI-powered healthcare recommendation platform for clinical teams." }
];

const industries = [
  { name: "Healthcare", icon: <HeartPulse className="h-5 w-5" /> },
  { name: "Education", icon: <GraduationCap className="h-5 w-5" /> },
  { name: "Finance", icon: <PieChart className="h-5 w-5" /> },
  { name: "Real Estate", icon: <HomeIcon className="h-5 w-5" /> },
  { name: "E-commerce", icon: <Globe className="h-5 w-5" /> },
  { name: "Logistics", icon: <Truck className="h-5 w-5" /> },
  { name: "Startups", icon: <Rocket className="h-5 w-5" /> },
];

const features = [
  { title: "Innovation First", icon: <Target className="h-7 w-7 text-white/70" />, desc: "We use cutting-edge technology to solve complex, real-world problems." },
  { title: "Startup Friendly", icon: <Rocket className="h-7 w-7 text-white/70" />, desc: "Agile methodologies tailored for fast-paced, high-growth environments." },
  { title: "Fast Delivery", icon: <FastForward className="h-7 w-7 text-white/70" />, desc: "Rapid prototyping and iterative development without sacrificing quality." },
  { title: "Expert Team", icon: <Users className="h-7 w-7 text-white/70" />, desc: "Senior engineers and domain experts fully focused on your success." }
];

const process = [
  { step: "01", title: "Discover", desc: "Understanding your vision, goals, and technical requirements." },
  { step: "02", title: "Design", desc: "Architecting the system and designing the user experience." },
  { step: "03", title: "Develop", desc: "Building with modern frameworks and best practices." },
  { step: "04", title: "Test", desc: "Rigorous quality assurance, security audits, and performance tuning." },
  { step: "05", title: "Launch", desc: "Deployment, monitoring, and continuous integration." }
];

const testimonials = [
  { text: "Nexera transformed our legacy system into a modern, AI-powered platform. Their team's technical expertise is unmatched.", author: "Sarah Jenkins", role: "CTO, TechCorp" },
  { text: "Working with Nexera felt like having an elite engineering team in-house. They delivered our MVP ahead of schedule.", author: "Michael Chang", role: "Founder, InnovateTech" },
  { text: "The custom automation solution they built saved us thousands of hours. Highly recommended for enterprise projects.", author: "Elena Rodriguez", role: "Operations Director, GlobalLogistics" }
];

const whyNexera = [
  { title: "AI-Powered Innovation", desc: "We build intelligent systems that help businesses automate, optimize, and scale.", icon: <Cpu className="h-7 w-7 text-white/70" /> },
  { title: "Future-Ready Technology", desc: "Using modern architectures and cutting-edge tools to create long-lasting solutions.", icon: <Zap className="h-7 w-7 text-white/70" /> },
  { title: "Business-Focused", desc: "Every product is designed to solve real business challenges and create measurable impact.", icon: <Target className="h-7 w-7 text-white/70" /> },
  { title: "Scalable Products", desc: "From startup MVPs to enterprise applications, our solutions grow with your business.", icon: <Rocket className="h-7 w-7 text-white/70" /> }
];

const floatingIcons = [
  { Icon: SiReact, label: "React", pos: "top-[18%] right-[8%]", delay: 4 },
  { Icon: SiTensorflow, label: "TensorFlow", pos: "bottom-[22%] right-[12%]", delay: 5 },
  { Icon: SiPython, label: "Python", pos: "top-[42%] left-[6%]", delay: 6 },
  { Icon: SiNodedotjs, label: "Node.js", pos: "bottom-[38%] left-[3%]", delay: 4.5 },
  { Icon: SiDocker, label: "Docker", pos: "top-[8%] left-[38%]", delay: 5.5 },
  { Icon: SiMongodb, label: "MongoDB", pos: "bottom-[8%] left-[42%]", delay: 6.5 },
];

export default function Home() {
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();

  const [contactForm, setContactForm] = useState({ firstName: "", lastName: "", email: "", company: "", service: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.firstName || !contactForm.lastName || !contactForm.email || !contactForm.service || !contactForm.message) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setContactLoading(true);
    try {
      await api.post("/contact", contactForm);
      setContactSuccess(true);
      setContactForm({ firstName: "", lastName: "", email: "", company: "", service: "", message: "" });
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to send message.", variant: "destructive" });
    } finally {
      setContactLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterLoading(true);
    try {
      await api.post("/newsletter", { email: newsletterEmail });
      setNewsletterEmail("");
      toast({ title: "Subscribed!", description: "You'll receive our latest updates." });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Could not subscribe.", variant: "destructive" });
    } finally {
      setNewsletterLoading(false);
    }
  };

  const phrases = ["AI Solutions", "Web Applications", "Automation Systems", "Custom Software", "Cloud Platforms", "Digital Innovation"];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const typeSpeed = isDeleting ? 45 : 90;
    const currentPhrase = phrases[phraseIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting && typedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1600);
      } else if (isDeleting && typedText === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setTypedText(currentPhrase.substring(0, typedText.length + (isDeleting ? -1 : 1)));
      }
    }, typeSpeed);
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number }[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 90; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.2 + 0.4,
          opacity: Math.random() * 0.3 + 0.05,
        });
      }
    };

    let animationFrame: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          p.x -= dx * 0.04;
          p.y -= dy * 0.04;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        initParticles();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    render();
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [mousePos]);

  const navigateTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setTransitioning(true);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
      setTimeout(() => setTransitioning(false), 200);
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-white/20"
      style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
    >
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <TransitionOverlay isVisible={transitioning} />

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/[0.06] py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="#home" onClick={(e) => navigateTo(e, "home")} className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--app-font-display)" }}>
            Nexera
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[["home", "Home"], ["services", "Services"], ["technologies", "Technologies"], ["projects", "Projects"], ["about", "About"], ["contact", "Contact"]].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => navigateTo(e, id)}
                className="text-white/50 hover:text-white transition-colors duration-200 relative group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <a
              href="/careers"
              className="text-white/50 hover:text-white transition-colors duration-200 relative group"
            >
              Careers
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
            </a>
          </div>
          <Button
            className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-semibold text-sm h-9 transition-all duration-200"
            onClick={(e) => navigateTo(e, "contact")}
          >
            Book Free Consultation
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-24 overflow-hidden"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <div className="absolute inset-0 z-0">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
        <div
          className="pointer-events-none fixed inset-0 z-[5] transition-all duration-500"
          style={{ background: `radial-gradient(700px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.03), transparent 80%)` }}
        />
        <motion.div animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
        <motion.div animate={{ x: [0, -20, 0], y: [0, 15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs mb-10 text-white/50 tracking-wide uppercase">
              <Zap className="h-3 w-3" /> Building the future of technology
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[1.05] mb-7 tracking-tight text-white">
              Transforming<br />Ideas Into<br />
              <span className="text-white/40">Intelligent</span>
            </h1>
            <p className="text-lg text-white/40 mb-4 leading-relaxed max-w-lg">
              Nexera helps businesses build modern web applications, scalable software systems, and AI-powered solutions that drive innovation and growth.
            </p>
            <p className="text-white/70 mb-10 font-mono text-base">
              We specialize in <span className="text-white font-semibold">{typedText}</span><span className="animate-pulse text-white">|</span>
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full px-9 h-13 text-base font-semibold shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.18)] transition-all duration-300"
                onClick={(e) => navigateTo(e, "contact")}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-9 h-13 text-base border-white/20 hover:border-white/40 hover:bg-white/[0.04] bg-transparent text-white transition-all duration-300"
                onClick={(e) => navigateTo(e, "services")}
              >
                Explore Services <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block relative h-[580px] w-full"
          >
            <WireframeGlobe />
            {floatingIcons.map(({ Icon, label, pos, delay }, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, i % 2 === 0 ? -14 : 14, 0] }}
                transition={{ duration: delay, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute ${pos} flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] hover:border-white/20 transition-colors`}
              >
                <Icon className="w-4 h-4 text-white/60" />
                <span className="text-xs font-medium text-white/50">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/20 text-xs tracking-widest uppercase">
            <span>Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 border-y border-white/[0.06]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 10, suffix: "+", label: "Projects Delivered" },
              { value: 100, suffix: "%", label: "Client Satisfaction" },
              { value: 5, suffix: "+", label: "Industries Served" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "var(--app-font-display)" }}>
                  <Counter from={0} to={stat.value} duration={2} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-white/30 font-medium tracking-widest uppercase">{stat.label}</div>
              </div>
            ))}
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "var(--app-font-display)" }}>24/7</div>
              <div className="text-xs text-white/30 font-medium tracking-widest uppercase">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-40 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-20">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4">What We Build</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Services</h2>
            <p className="text-white/40 text-lg leading-relaxed">End-to-end engineering, from elegant interfaces to robust backend systems and AI integrations.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-6 p-3 rounded-xl bg-white/[0.06] inline-block group-hover:bg-white/[0.1] transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-base font-semibold mb-3 text-white">{service.title}</h3>
                <p className="text-white/40 text-sm mb-5 leading-relaxed">{service.desc}</p>
                <ul className="space-y-2.5">
                  {service.items.map((item, j) => (
                    <li key={j} className="text-sm text-white/30 flex items-center gap-2.5">
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nexera */}
      <section id="why-nexera" className="py-40 relative overflow-hidden border-y border-white/[0.06]">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Nexera</h2>
            <p className="text-white/40 text-lg leading-relaxed">We combine software engineering, artificial intelligence, and automation to build scalable digital products that drive business growth.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyNexera.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <TiltCard>
                  <div className="mb-6 p-3 rounded-xl bg-white/[0.05] inline-block">{card.icon}</div>
                  <h3 className="text-base font-bold mb-3 text-white">{card.title}</h3>
                  <p className="text-white/40 leading-relaxed text-sm">{card.desc}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section id="about" className="py-40">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-20">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Our Philosophy</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Approach</h2>
            <p className="text-white/40 text-lg leading-relaxed">We bring the engineering rigor of world-class technology companies to every project we take on.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="mb-6">{feat.icon}</div>
                <h3 className="text-base font-semibold mb-3 text-white">{feat.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section id="technologies" className="py-40 border-y border-white/[0.06] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-xl mb-20">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Stack</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Modern Stack</h2>
            <p className="text-white/40 text-lg leading-relaxed">We choose the right tool for every job — production-grade, battle-tested, and future-ready.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
            {Object.entries(technologies).map(([category, techs], i) => (
              <motion.div
                key={category}
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <h4 className="text-xs font-semibold tracking-widest text-white/30 uppercase">{category}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {techs.map((Tech, j) => (
                    <div key={j} className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group cursor-pointer hover:-translate-y-1">
                      <Tech.icon className="h-7 w-7 mb-2.5 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" style={{ color: Tech.color }} />
                      <span className="text-[10px] font-medium text-white/30 group-hover:text-white/70 transition-colors">{Tech.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-40">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-20">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4">How We Work</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Development Process</h2>
            <p className="text-white/40 text-lg leading-relaxed">A systematic, transparent process that ensures high-quality outcomes at every stage.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-gradient-to-r from-white/[0.06] via-white/[0.12] to-white/[0.06]" />
            <div className="grid md:grid-cols-5 gap-8">
              {process.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-full bg-black border border-white/[0.12] flex items-center justify-center font-mono text-white/50 font-bold text-sm mb-6 relative z-10 hover:border-white/30 hover:text-white transition-all duration-300">
                    {p.step}
                  </div>
                  <h3 className="text-base font-bold mb-2 text-white">{p.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-40 border-y border-white/[0.06]">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-20">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Featured Work</h2>
            <p className="text-white/40 text-lg leading-relaxed">A selection of recent platforms and systems engineered by our team.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:border-white/[0.14] transition-all duration-300 flex flex-col"
              >
                <div className="h-56 bg-black flex items-center justify-center relative overflow-hidden border-b border-white/[0.06]">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
                  <div className="text-white/10 font-mono text-7xl font-bold group-hover:text-white/[0.06] transition-colors">0{i + 1}</div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06] tracking-wide uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
                  <p className="text-white/40 text-sm mb-8 flex-1 leading-relaxed">{project.desc}</p>
                  <button className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-colors group/btn w-fit">
                    View Project <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-40">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-20">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Verticals</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Industries We Serve</h2>
            <p className="text-white/40 text-lg leading-relaxed">Delivering tailored digital solutions across diverse sectors and verticals.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {industries.map((ind, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 cursor-default"
              >
                <span className="text-white/40">{ind.icon}</span>
                <span className="font-medium text-white/70 text-sm">{ind.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-40 border-y border-white/[0.06]">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-20">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Client Success</h2>
            <p className="text-white/40 text-lg">What our partners say about working with Nexera.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm relative hover:border-white/[0.12] transition-all duration-300"
              >
                <Quote className="h-6 w-6 text-white/10 absolute top-6 right-6" />
                <p className="text-white/60 text-sm leading-relaxed mb-8 italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.author}</div>
                  <div className="text-xs text-white/30 mt-0.5">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-40">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-16">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Common Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "How long does development take?", a: "Depending on complexity, a standard web application takes 4–8 weeks, while complex AI or enterprise systems may take 3–6 months." },
              { q: "Do you provide AI solutions?", a: "Yes. We build custom AI agents, integrate LLMs, develop computer vision and predictive analytics models tailored to your business." },
              { q: "Can you redesign existing websites?", a: "Absolutely. We audit your current architecture, propose a modern tech stack, and deliver a high-performance redesign." },
              { q: "Do you provide maintenance support?", a: "Yes. We offer ongoing maintenance, SLA-backed support, and continuous feature development post-launch." },
              { q: "What technologies do you use?", a: "We primarily use React/Next.js for frontend, Node.js/Python for backend, and deploy on AWS or Vercel — choosing the right tool for each job." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/[0.08]">
                <AccordionTrigger className="text-left text-base text-white/70 hover:text-white py-6 hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-white/40 text-sm pb-6 leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-40 relative overflow-hidden border-t border-white/[0.06]">
        <div className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full blur-[200px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Get In Touch</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Build<br />Together</h2>
              <p className="text-white/40 text-lg mb-12 max-w-md leading-relaxed">Ready to start your next project? Fill out the form and our team will get back to you within 24 hours.</p>
              <div className="space-y-6">
                {[
                  { Icon: Mail, label: "Email Us", value: "hello@nexera.tech" },
                  { Icon: Phone, label: "Call Us", value: "+91 XXXXX XXXXX" },
                  { Icon: Target, label: "Visit Us", value: "Ahmedabad, Gujarat, India" },
                ].map(({ Icon, label, value }, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white/40" />
                    </div>
                    <div>
                      <div className="text-xs text-white/25 mb-0.5 uppercase tracking-wide">{label}</div>
                      <div className="text-sm font-medium text-white/70">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
              {contactSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-2xl">✓</div>
                  <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                  <p className="text-white/40 text-sm max-w-xs">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setContactSuccess(false)} className="text-xs text-white/30 hover:text-white/60 mt-2 transition-colors underline">Send another message</button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={(e) => { void handleContactSubmit(e); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wide">First Name</label>
                      <Input value={contactForm.firstName} onChange={(e) => setContactForm(f => ({ ...f, firstName: e.target.value }))} placeholder="John" className="bg-white/[0.03] border-white/[0.08] focus-visible:ring-white/20 text-white placeholder:text-white/20 h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Last Name</label>
                      <Input value={contactForm.lastName} onChange={(e) => setContactForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Doe" className="bg-white/[0.03] border-white/[0.08] focus-visible:ring-white/20 text-white placeholder:text-white/20 h-11" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Email Address</label>
                    <Input type="email" value={contactForm.email} onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))} placeholder="john@company.com" className="bg-white/[0.03] border-white/[0.08] focus-visible:ring-white/20 text-white placeholder:text-white/20 h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Company Name</label>
                    <Input value={contactForm.company} onChange={(e) => setContactForm(f => ({ ...f, company: e.target.value }))} placeholder="TechCorp Inc." className="bg-white/[0.03] border-white/[0.08] focus-visible:ring-white/20 text-white placeholder:text-white/20 h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Service Required</label>
                    <Select value={contactForm.service} onValueChange={(v) => setContactForm(f => ({ ...f, service: v }))}>
                      <SelectTrigger className="bg-white/[0.03] border-white/[0.08] focus:ring-white/20 text-white h-11">
                        <SelectValue placeholder="Select a service" className="text-white/30" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Custom Software">Custom Software</SelectItem>
                        <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                        <SelectItem value="Automation Solutions">Automation Solutions</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Message</label>
                    <Textarea value={contactForm.message} onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us about your project..." className="bg-white/[0.03] border-white/[0.08] focus-visible:ring-white/20 min-h-[110px] text-white placeholder:text-white/20" />
                  </div>
                  <Button type="submit" disabled={contactLoading} className="w-full bg-white text-black hover:bg-white/90 h-12 text-sm font-semibold rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.06)] hover:shadow-[0_0_50px_rgba(255,255,255,0.12)] transition-all duration-300 disabled:opacity-50">
                    {contactLoading ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[200px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 rounded-none border-y border-white/[0.06]" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs text-white/30 tracking-widest uppercase mb-8">Ready?</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Ready to Build Something<br />Extraordinary?
            </h2>
            <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto">Let's transform your ideas into innovative digital solutions that stand the test of time.</p>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 rounded-full px-12 h-14 text-base font-semibold shadow-[0_0_60px_rgba(255,255,255,0.1)] hover:shadow-[0_0_80px_rgba(255,255,255,0.18)] transition-all duration-300"
              onClick={(e) => navigateTo(e, "contact")}
            >
              Schedule Free Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 bg-black border-t border-white/[0.06]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="text-xl font-bold tracking-tight mb-6 text-white" style={{ fontFamily: "var(--app-font-display)" }}>
                Nexera
              </div>
              <p className="text-white/30 max-w-sm mb-6 leading-relaxed text-sm">
                Intelligent digital solutions for modern businesses. We design, engineer, and ship exceptional software.
              </p>
              <form onSubmit={(e) => { void handleNewsletterSubmit(e); }} className="flex gap-2 mb-6 max-w-sm">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/20 h-9 text-sm focus-visible:ring-white/20"
                />
                <Button type="submit" disabled={newsletterLoading} size="sm" className="bg-white text-black hover:bg-white/90 h-9 px-4 text-xs font-semibold shrink-0 disabled:opacity-50">
                  {newsletterLoading ? "…" : "Subscribe"}
                </Button>
              </form>
              <div className="flex gap-3">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all duration-200">
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-6 text-white/50 uppercase tracking-widest">Services</h4>
              <ul className="space-y-3.5">
                {["Web Development", "AI & ML Solutions", "Custom Software", "Cloud Architecture"].map(item => (
                  <li key={item}><a href="#services" onClick={(e) => navigateTo(e, "services")} className="text-sm text-white/30 hover:text-white/70 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-6 text-white/50 uppercase tracking-widest">Company</h4>
              <ul className="space-y-3.5">
                {[["about", "About Us"], ["projects", "Projects"], ["contact", "Contact"]].map(([id, label]) => (
                  <li key={id}><a href={`#${id}`} onClick={(e) => navigateTo(e, id)} className="text-sm text-white/30 hover:text-white/70 transition-colors">{label}</a></li>
                ))}
                <li><a href="/blog" className="text-sm text-white/30 hover:text-white/70 transition-colors">Blogs</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.06] text-xs text-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Nexera. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/50 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
