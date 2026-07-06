import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, animate } from "framer-motion";
import {
  FaJava, FaHtml5, FaCss3Alt, FaJs, FaPython, FaReact, FaGitAlt, FaGithub,
  FaLinkedin, FaDatabase, FaCloud, FaCode, FaServer, FaProjectDiagram,
  FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane,
  FaArrowUp, FaDownload, FaExternalLinkAlt, FaBriefcase, FaAward,
  FaChevronRight, FaCheckCircle,
} from "react-icons/fa";
import {
  SiSpringboot, SiMysql, SiVercel, SiEclipseide, SiJetpackcompose,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import heroPortrait from "@/assets/hero-portrait.jpg";
import emailjs from "@emailjs/browser";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

/* ----------------------------- Utilities ----------------------------- */

function useTypedText(words: string[], typeMs = 90, holdMs = 1400) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[index % words.length];
    const done = !deleting && text === current;
    const cleared = deleting && text === "";
    const delay = done ? holdMs : cleared ? 250 : deleting ? typeMs / 2 : typeMs;
    const t = setTimeout(() => {
      if (done) setDeleting(true);
      else if (cleared) { setDeleting(false); setIndex((i) => i + 1); }
      else setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, typeMs, holdMs]);
  return text;
}

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6, ease: "easeOut",
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};


function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
      className="mb-16 text-center"
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-highlight">
        <span className="h-1.5 w-1.5 rounded-full bg-highlight" />{eyebrow}
      </div>
      <h2 className="text-4xl md:text-5xl font-bold">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{sub}</p>}
    </motion.div>
  );
}

/* ----------------------------- Navbar ----------------------------- */

const NAV = [
  ["Home", "home"], ["About", "about"], ["Skills", "skills"],
  ["Experience", "experience"], ["Education", "education"], ["Projects", "projects"],
  ["Services", "services"], ["Certifications", "certifications"], ["Contact", "contact"],
] as const;

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all ${scrolled ? "glass-strong shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]" : ""} mx-4 md:mx-auto`}>
        <a href="#home" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-highlight text-primary-foreground font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            SK
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight">Sabarish Kumar</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Stack Engineer</div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-transform hover:scale-105">
            Let's Talk <FaPaperPlane className="text-xs" />
          </a>
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden rounded-lg p-2 glass" aria-label="Menu">
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-foreground transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-foreground transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-foreground transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden mx-4 mt-2 glass-strong rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-1">
            {NAV.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5">
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

/* ----------------------------- Hero ----------------------------- */

function Hero() {
  const roles = useMemo(() => ([
    "Java Full Stack Developer", "Software Engineer", "Backend Developer",
    "Frontend Developer", "Problem Solver", "Continuous Learner",
  ]), []);
  const typed = useTypedText(roles);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 100]);

  // Cursor spotlight
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const stack = ["Java", "Spring Boot", "MySQL", "REST APIs", "JPA", "JavaScript", "HTML5", "CSS3", "Git", "Cloud", "Agile", "MVC"];
  const orbitTech = [
    { icon: <FaJava />, color: "text-[#f89820]" },
    { icon: <SiSpringboot />, color: "text-emerald-400" },
    { icon: <SiMysql />, color: "text-sky-400" },
    { icon: <FaJs />, color: "text-yellow-300" },
    { icon: <FaGitAlt />, color: "text-orange-400" },
    { icon: <FaCloud />, color: "text-highlight" },
  ];

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden pt-28 md:pt-32 pb-16"
      style={{
        // @ts-expect-error CSS vars
        "--mx": "50%", "--my": "40%",
      }}
    >
      {/* Aurora / mesh background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-[0.25]" />
        <div className="absolute inset-0 [background:radial-gradient(1200px_600px_at_15%_10%,oklch(0.65_0.19_258/0.35),transparent_60%),radial-gradient(900px_500px_at_90%_20%,oklch(0.78_0.14_210/0.28),transparent_60%),radial-gradient(700px_500px_at_50%_100%,oklch(0.55_0.22_280/0.22),transparent_60%)]" />
        <div className="absolute -top-32 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,oklch(0.65_0.19_258/0.35),oklch(0.78_0.14_210/0.35),oklch(0.55_0.22_280/0.35),oklch(0.65_0.19_258/0.35))] blur-3xl animate-aurora" />
        {/* Radial vignette bottom */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity"
        style={{
          background:
            "radial-gradient(400px circle at var(--mx) var(--my), oklch(0.65 0.19 258 / 0.18), transparent 60%)",
        }}
      />

      {/* Floating particles */}
      <motion.div style={{ y: yParallax }} className="pointer-events-none absolute inset-0">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute block h-1 w-1 rounded-full bg-white/50"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animation: `float ${5 + (i % 6)}s ease-in-out ${i * 0.3}s infinite`,
              boxShadow: "0 0 12px rgba(59,130,246,0.7)",
            }}
          />
        ))}
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.15fr_1fr]">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Status pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass-strong px-3 py-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-muted-foreground">Available for opportunities</span>
            <span className="text-white/20">·</span>
            <span className="text-foreground">Class of 2025</span>
          </div>

          {/* Terminal-style path chip */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-1 font-mono text-[11px] text-highlight">
            <span className="text-emerald-400">~/portfolio</span>
            <span className="text-white/40">$</span>
            <span>whoami</span>
          </div>

          <h1 className="text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl font-bold tracking-tight">
            <span className="block text-foreground/95">Sabarish</span>
            <span className="block">
              <span className="text-gradient">Kumar</span>{" "}
              <span className="text-foreground/95">Srinivasan</span>
            </span>
          </h1>

          {/* Typing role in bordered chip */}
          <div className="mt-6 inline-flex min-h-[44px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-primary to-highlight text-[10px] font-bold text-primary-foreground">
              ›_
            </span>
            <span className="font-mono text-sm md:text-base">
              <span className="text-muted-foreground">role = </span>
              <span className="text-gradient">"{typed || "\u00A0"}"</span>
              <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[3px] bg-highlight animate-caret" />
            </span>
          </div>

          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Building{" "}
            <span className="text-foreground">scalable software</span>. Solving{" "}
            <span className="text-foreground">real problems</span>. Creating meaningful digital experiences with Java, Spring Boot, and modern web technologies.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-highlight px-6 py-3 font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)] transition-transform hover:scale-[1.03]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">View Projects</span>
              <FaChevronRight className="relative transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/sabarish-kumar-CV.pdf"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-medium hover:bg-white/10"
            >
              <FaDownload /> Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium hover:border-primary/60 hover:text-primary"
            >
              Contact
            </a>
          </div>

          {/* Mini stats bento */}
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-2">
            {[
              { n: "3+", l: "Projects" },
              { n: "30+", l: "Skills" },
              { n: "7.54", l: "CGPA" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl glass px-4 py-3">
                <div className="text-lg font-bold text-gradient">{s.n}</div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Connect</span>
            <div className="h-px w-10 bg-gradient-to-r from-white/30 to-transparent" />
            <div className="flex gap-2">
              {[
                { icon: <FaGithub />, href: "https://github.com/au820621104070", label: "GitHub" },
                { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/sabarish-kumar-srinivasan-91a178273", label: "LinkedIn" },
                { icon: <FaEnvelope />, href: "mailto:sabarishsri03@gmail.com", label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl glass text-base transition-all hover:text-primary hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Portrait with orbits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative mx-auto flex w-full max-w-md items-center justify-center py-6"
        >
          {/* Orbital rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-[112%] w-[112%] animate-spin-slow">
              <div className="absolute inset-0 rounded-full border border-dashed border-white/10" />
              {orbitTech.slice(0, 3).map((t, i) => {
                const angle = (i / 3) * Math.PI * 2;
                const r = 50;
                const x = 50 + Math.cos(angle) * r;
                const y = 50 + Math.sin(angle) * r;
                return (
                  <div
                    key={i}
                    className={`absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl glass-strong text-lg animate-spin-reverse ${t.color}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {t.icon}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-[132%] w-[132%] animate-spin-reverse">
              <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.07]" />
              {orbitTech.slice(3).map((t, i) => {
                const angle = (i / 3) * Math.PI * 2 + Math.PI / 4;
                const r = 50;
                const x = 50 + Math.cos(angle) * r;
                const y = 50 + Math.sin(angle) * r;
                return (
                  <div
                    key={i}
                    className={`absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl glass-strong text-lg animate-spin-slow ${t.color}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {t.icon}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Glow */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/40 via-highlight/25 to-transparent blur-3xl" />

          {/* Portrait */}
          <div className="relative aspect-square w-[78%] overflow-hidden rounded-full glass-strong p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <img
                src={heroPortrait}
                alt="Sabarish Kumar Srinivasan"
                width={1024}
                height={1280}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute left-0 top-6 z-10 rounded-2xl glass-strong px-3 py-2 shadow-lg"
          >
            <div className="flex items-center gap-2 text-xs">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#f89820]/20 text-[#f89820]">
                <FaJava />
              </div>
              <div>
                <div className="font-semibold">Java · Spring</div>
                <div className="text-[10px] text-muted-foreground">Backend stack</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
            className="absolute -right-2 bottom-16 z-10 rounded-2xl glass-strong px-3 py-2 shadow-lg"
          >
            <div className="flex items-center gap-2 text-xs">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/20 text-primary">
                <FaCode />
              </div>
              <div>
                <div className="font-semibold">Full Stack</div>
                <div className="text-[10px] text-muted-foreground">End-to-end</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-2 left-6 z-10 rounded-2xl glass-strong px-3 py-2 shadow-lg"
          >
            <div className="flex items-center gap-2 text-xs">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-highlight/20 text-highlight">
                <FaCloud />
              </div>
              <div>
                <div className="font-semibold">Cloud Ready</div>
                <div className="text-[10px] text-muted-foreground">IaaS · PaaS</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee tech ticker */}
      <div className="relative mt-16 border-y border-white/5 bg-white/[0.02]">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex overflow-hidden py-4">
          <div className="flex shrink-0 animate-marquee gap-10 pr-10 font-mono text-sm text-muted-foreground">
            {[...stack, ...stack].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2 whitespace-nowrap">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-10 flex justify-center">
        <a href="#about" className="group flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase tracking-[0.3em]">Scroll</span>
          <span className="flex h-9 w-5 justify-center rounded-full border border-white/15 p-1">
            <span className="h-2 w-0.5 animate-float rounded-full bg-primary" />
          </span>
        </a>
      </div>
    </section>
  );
}


/* ----------------------------- About ----------------------------- */

function About() {
  const traits = [
    { label: "Problem Solver", icon: "🧩" },
    { label: "Fast Learner", icon: "⚡" },
    { label: "Team Player", icon: "🤝" },
    { label: "Analytical", icon: "📊" },
    { label: "Curious", icon: "🔍" },
  ];
  return (
    <Section id="about">
      <SectionHeader eyebrow="About Me" title="Turning ideas into reliable software" sub="A quick look at who I am, what I care about, and how I build." />

      <div className="grid gap-5 md:grid-cols-6 md:grid-rows-2 md:auto-rows-fr">
        {/* Story */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl glass p-8 md:col-span-4 md:row-span-2"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-1 font-mono text-[11px] text-highlight">
              <span className="text-emerald-400">const</span> me =
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold leading-tight">
              I enjoy turning innovative ideas into{" "}
              <span className="text-gradient">reliable, scalable software</span>.
            </h3>
            <div className="mt-5 space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>As a passionate Java Full Stack Developer, I focus on creating scalable web applications, clean backend architectures, and intuitive user experiences.</p>
              <p>I enjoy solving real-world challenges through software engineering while continuously expanding my knowledge of Spring Boot, REST APIs, Cloud Computing, and Full Stack Development.</p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs md:text-sm">
              <div className="flex items-center gap-1.5 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-2 text-[10px] text-muted-foreground">philosophy.java</span>
              </div>
              <div className="space-y-1">
                <div><span className="text-primary">public class</span> <span className="text-highlight">Engineer</span> {"{"}</div>
                <div className="pl-4"><span className="text-primary">boolean</span> keepLearning = <span className="text-emerald-400">true</span>;</div>
                <div className="pl-4"><span className="text-primary">String</span> mission = <span className="text-yellow-300">"Build. Solve. Improve."</span>;</div>
                <div>{"}"}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {traits.map((t) => (
                <span key={t.label} className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-sm">
                  <span>{t.icon}</span>{t.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        {[
          { n: 3, s: "+", label: "Projects Completed", icon: <FaProjectDiagram />, tone: "from-primary/25 to-primary/5" },
          { n: 3, s: "+", label: "Training & Internships", icon: <FaBriefcase />, tone: "from-highlight/25 to-highlight/5" },
          { n: 30, s: "+", label: "Technical Skills", icon: <FaCode />, tone: "from-purple-500/25 to-purple-500/5" },
          { n: 7.54, d: 2, label: "CGPA / 10", icon: <FaGraduationCap />, tone: "from-emerald-500/25 to-emerald-500/5" },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={`relative overflow-hidden rounded-3xl glass p-5 md:col-span-1 md:row-span-1 ${i < 2 ? "" : ""}`}
          >
            <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${s.tone}`} />
            <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-primary">{s.icon}</div>
            <div className="text-2xl md:text-3xl font-bold text-gradient">
              <Counter to={s.n} decimals={s.d ?? 0} suffix={s.s ?? ""} />
            </div>
            <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- Skills ----------------------------- */

const SKILL_GROUPS: { title: string; icon: React.ReactNode; items: { name: string; level: number; icon?: React.ReactNode }[] }[] = [
  {
    title: "Languages", icon: <FaCode />,
    items: [
      { name: "Java", level: 90, icon: <FaJava /> },
      { name: "SQL", level: 85, icon: <FaDatabase /> },
      { name: "Python", level: 70, icon: <FaPython /> },
    ],
  },
  {
    title: "Frontend", icon: <FaReact />,
    items: [
      { name: "HTML5", level: 90, icon: <FaHtml5 /> },
      { name: "CSS3", level: 85, icon: <FaCss3Alt /> },
      { name: "JavaScript", level: 80, icon: <FaJs /> },
      { name: "Responsive Design", level: 85 },
    ],
  },
  {
    title: "Backend", icon: <FaServer />,
    items: [
      { name: "Spring Boot", level: 85, icon: <SiSpringboot /> },
      { name: "REST APIs", level: 85 },
      { name: "JDBC", level: 80 },
      { name: "MVC Architecture", level: 82 },
      { name: "OOP", level: 90 },
    ],
  },
  {
    title: "Database", icon: <FaDatabase />,
    items: [
      { name: "MySQL", level: 88, icon: <SiMysql /> },
      { name: "JPA", level: 78 },
      { name: "DB Design", level: 80 },
      { name: "CRUD", level: 90 },
    ],
  },
  {
    title: "Cloud", icon: <FaCloud />,
    items: [
      { name: "Cloud Computing", level: 78 },
      { name: "IaaS / PaaS / SaaS", level: 75 },
      { name: "Secure Architecture", level: 72 },
    ],
  },
  {
    title: "Tools", icon: <SiJetpackcompose />,
    items: [
      { name: "Git & GitHub", level: 88, icon: <FaGitAlt /> },
      { name: "Eclipse", level: 85, icon: <SiEclipseide /> },
      { name: "VS Code", level: 90, icon: <VscVscode /> },
      { name: "Vercel", level: 80, icon: <SiVercel /> },
      { name: "Agile / SDLC", level: 80 },
    ],
  },
];

function SkillBar({ level }: { level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${level}%` } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative h-full rounded-full bg-gradient-to-r from-primary to-highlight"
      >
        <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-highlight shadow-[0_0_10px_rgba(6,182,212,0.9)]" />
      </motion.div>
    </div>
  );
}

function Skills() {
  const [active, setActive] = useState<string>("All");
  const tabs = ["All", ...SKILL_GROUPS.map((g) => g.title)];
  const visible = active === "All" ? SKILL_GROUPS : SKILL_GROUPS.filter((g) => g.title === active);

  return (
    <Section id="skills">
      <SectionHeader eyebrow="Toolkit" title="Skills & Technologies" sub="A modern stack for building scalable, maintainable, high-quality software." />

      {/* Filter tabs */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => {
          const on = active === t;
          return (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                on
                  ? "bg-gradient-to-r from-primary to-highlight text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)]"
                  : "glass hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((g, i) => (
          <motion.div
            key={g.title}
            layout
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-3xl glass p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.35)]"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl transition-opacity group-hover:bg-primary/25" />
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-highlight/25 text-primary text-lg">{g.icon}</div>
                <h3 className="font-semibold">{g.title}</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {g.items.length} skills
              </span>
            </div>
            <div className="space-y-3.5">
              {g.items.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {s.icon && <span className="text-primary/80">{s.icon}</span>}
                      {s.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{s.level}%</span>
                  </div>
                  <SkillBar level={s.level} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Core strengths */}
      <div className="mt-8 relative overflow-hidden rounded-3xl glass p-6 md:p-8">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-highlight/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-highlight">Core Strengths</div>
            <div className="mt-1 text-lg font-semibold">The traits I bring to every engineering team</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Full Stack","API Integration","Clean Code","Problem Solving","Analytical Thinking","Team Collaboration","Adaptability"].map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs md:text-sm hover:border-primary/50 hover:text-primary transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------- Services ----------------------------- */

function Services() {
  const services = [
    {
      icon: <FaServer />, title: "Java Full Stack Development",
      desc: "Scalable web applications with Java, Spring Boot, REST APIs, and MySQL — from database schema to responsive UI.",
      tags: ["Spring Boot", "REST", "MySQL", "JPA"],
      steps: ["Requirement analysis", "API & schema design", "Implementation & testing", "Deployment & handoff"],
    },
    {
      icon: <FaReact />, title: "Frontend Development",
      desc: "Responsive, modern interfaces focused on performance, accessibility, and user experience across every device.",
      tags: ["HTML/CSS", "JavaScript", "Responsive", "A11y"],
      steps: ["UI planning", "Component build", "Interaction polish", "Performance audit"],
    },
  ];
  return (
    <Section id="services">
      <SectionHeader eyebrow="What I Do" title="Services" sub="Focused capabilities I bring to every project." />
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((s, i) => (
          <motion.div
            key={i}
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl p-[1px]"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/40 via-white/5 to-highlight/40 opacity-70 transition-opacity group-hover:opacity-100" />
            <div className="relative h-full rounded-3xl glass-strong p-8">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl transition-all group-hover:bg-primary/30" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-highlight text-2xl text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)]">
                    {s.icon}
                  </div>
                  <span className="font-mono text-4xl text-white/10">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-muted-foreground">{s.desc}</p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  {s.steps.map((step, j) => (
                    <div key={step} className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-xs">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-primary/20 font-mono text-[10px] text-primary">
                        {j + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">{t}</span>
                  ))}
                </div>

                <a href="#contact" className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:text-highlight">
                  Start a project <FaChevronRight className="text-[10px] transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- Experience ----------------------------- */

const EXPERIENCE = [
  {
    role: "Java Full Stack Development Trainee",
    org: "QSpiders Training Institute",
    date: "May 2025 – Apr 2026",
    type: "Training",
    icon: <FaJava />,
    tone: "from-[#f89820]/30 to-primary/20",
    points: ["Core & Advanced Java, SQL, Spring Boot, REST APIs",
             "Built Personal Budget Tracker (Java + MySQL)",
             "Built Employee Management REST API (Spring Boot + JPA)",
             "MVC Architecture · Full Stack Development"],
  },
  {
    role: "Cloud Computing Intern",
    org: "The Mind IT Solution",
    date: "Jul 2024 – Aug 2024",
    type: "Internship",
    icon: <FaCloud />,
    tone: "from-highlight/30 to-primary/20",
    points: ["Cloud infrastructure fundamentals",
             "Cost optimization strategies",
             "Secure cloud architecture patterns",
             "Deployment automation basics"],
  },
  {
    role: "Virtual Job Simulations",
    org: "Forage · Wells Fargo · Deloitte · Tata GenAI",
    date: "May 2026 – Jun 2026",
    type: "Simulation",
    icon: <FaBriefcase />,
    tone: "from-purple-500/30 to-primary/20",
    points: ["Software Engineering practices",
             "Data Analytics workflows",
             "AI Analytics fundamentals",
             "Business problem solving"],
  },
];

function Experience() {
  return (
    <Section id="experience">
      <SectionHeader eyebrow="Journey" title="Experience" sub="Training, internship, and simulation programs shaping my engineering foundation." />
      <div className="relative mx-auto max-w-5xl">
        {/* Central spine */}
        <div className="absolute left-6 md:left-1/2 top-0 h-full w-px bg-gradient-to-b from-primary/70 via-highlight/40 to-transparent md:-translate-x-1/2" />

        <div className="space-y-12">
          {EXPERIENCE.map((e, i) => {
            const rightSide = i % 2 === 1;
            return (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
                className="relative grid md:grid-cols-2 md:gap-16"
              >
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 z-10">
                  <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-highlight text-primary-foreground shadow-[0_0_25px_rgba(59,130,246,0.6)] ring-4 ring-background">
                    {e.icon}
                  </div>
                </div>

                <div className={`${rightSide ? "md:col-start-2" : ""} pl-16 md:pl-0 ${rightSide ? "md:pl-16" : "md:pr-16 md:text-right"}`}>
                  <div className={`relative overflow-hidden rounded-2xl glass-strong p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.4)]`}>
                    <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${e.tone} opacity-40`} />
                    <div className={`flex items-center gap-2 ${rightSide ? "md:justify-start" : "md:justify-end"}`}>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-highlight">
                        {e.type}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{e.date}</span>
                    </div>
                    <h3 className="mt-3 text-lg md:text-xl font-semibold">{e.role}</h3>
                    <div className="text-sm text-muted-foreground">{e.org}</div>
                    <ul className={`mt-4 space-y-1.5 text-sm ${rightSide ? "md:text-left" : "md:text-right"}`}>
                      {e.points.map((p) => (
                        <li key={p} className={`flex gap-2 ${rightSide ? "" : "md:flex-row-reverse"}`}>
                          <FaChevronRight className={`mt-1 shrink-0 text-primary text-[10px] ${rightSide ? "" : "md:rotate-180"}`} />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------- Education ----------------------------- */

function Education() {
  const courses = ["Data Structures", "Algorithms", "DBMS", "Operating Systems", "Software Engineering", "Computer Networks", "OOP", "Web Technologies"];
  return (
    <Section id="education">
      <SectionHeader eyebrow="Academia" title="Education" />
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl glass-strong">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-highlight/20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative grid gap-8 p-8 md:grid-cols-[auto_1fr] md:p-10">
            <div className="flex md:flex-col items-center md:items-start gap-4">
              <motion.div
                animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-primary to-highlight text-4xl text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)]"
              >
                <FaGraduationCap />
              </motion.div>
              <div className="md:mt-2">
                <div className="text-[10px] uppercase tracking-[0.25em] text-highlight">2021 – 2025</div>
                <div className="mt-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300 inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Graduating soon
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Bachelor of Engineering</h3>
              <div className="text-muted-foreground">Computer Science and Engineering</div>
              <div className="mt-1 text-sm text-muted-foreground">Arasu Engineering College · Anna University</div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">CGPA</div>
                  <div className="text-2xl font-bold text-gradient">7.54</div>
                  <div className="text-[10px] text-muted-foreground">/ 10.00</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Batch</div>
                  <div className="text-2xl font-bold text-gradient">2025</div>
                  <div className="text-[10px] text-muted-foreground">Class of</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Degree</div>
                  <div className="text-2xl font-bold text-gradient">B.E.</div>
                  <div className="text-[10px] text-muted-foreground">CSE</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-highlight">Relevant Coursework</div>
                <div className="flex flex-wrap gap-2">
                  {courses.map((c) => (
                    <span key={c} className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ----------------------------- Projects ----------------------------- */

const PROJECTS = [
  {
    title: "Blockchain Enabled File Storage System",
    desc: "Decentralized file storage with tamper-proof verification and immutable audit trails, boosting integrity verification by 35%.",
    tech: ["Java", "Solidity", "Ethereum", "SHA-256", "MySQL"],
    features: ["Blockchain file storage", "Tamper-proof verification", "Immutable audit trails", "Automated file validation"],
    gradient: "from-primary/40 via-purple-500/25 to-highlight/20",
    icon: "🔐",
    metric: "+35%",
    metricLabel: "integrity verification",
    featured: true,
  },
  {
    title: "Personal Budget Tracker",
    desc: "Java desktop app with MySQL persistence for CRUD-based expense tracking and monthly reporting.",
    tech: ["Java", "MySQL", "JDBC"],
    features: ["CRUD Operations", "Expense Tracking", "Monthly Reports", "Data Persistence"],
    gradient: "from-emerald-400/40 to-highlight/20",
    icon: "💰",
    metric: "−40%",
    metricLabel: "manual tracking effort",
  },
  {
    title: "Employee Management REST API",
    desc: "Spring Boot REST API using MVC architecture with JPA for employee lifecycle management and optimized database access.",
    tech: ["Spring Boot", "Java", "REST", "MySQL", "JPA", "JDBC"],
    features: ["Employee CRUD", "RESTful APIs", "MVC Architecture", "Database Optimization"],
    gradient: "from-primary/40 to-purple-500/20",
    icon: "🧩",
    metric: "REST",
    metricLabel: "MVC architecture",
  },
];

function ProjectCard({ p, i, featured }: { p: typeof PROJECTS[number]; i: number; featured?: boolean }) {
  return (
    <motion.article
      variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: i * 0.08 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl glass transition-all hover:-translate-y-2 hover:shadow-[0_30px_80px_-20px_rgba(59,130,246,0.45)] ${featured ? "md:col-span-2 md:flex-row" : ""}`}
    >
      <div className={`relative overflow-hidden bg-gradient-to-br ${p.gradient} ${featured ? "md:w-1/2 md:min-h-[380px]" : "aspect-[16/10]"}`}>
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 grid place-items-center text-7xl md:text-8xl">{p.icon}</div>
        <div className="absolute top-3 left-3 rounded-full glass-strong px-3 py-1 font-mono text-[10px]">
          PROJECT_0{i + 1}
        </div>
        {featured && (
          <div className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-primary to-highlight px-3 py-1 text-[10px] font-semibold text-primary-foreground">
            ★ Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3 rounded-2xl glass-strong px-3 py-2">
          <div className="text-lg font-bold text-gradient">{p.metric}</div>
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{p.metricLabel}</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg md:text-xl font-semibold">{p.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
        <ul className={`mt-4 space-y-1 text-sm ${featured ? "md:grid md:grid-cols-2 md:gap-x-4 md:space-y-0" : ""}`}>
          {p.features.map((f) => (
            <li key={f} className="flex gap-2"><FaCheckCircle className="mt-1 shrink-0 text-primary text-xs" /><span>{f}</span></li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-mono">{t}</span>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <a href="https://github.com/au820621104070" target="_blank" rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
            <FaGithub /> GitHub
          </a>
          <a href="#" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-highlight px-4 py-2 text-sm text-primary-foreground">
            <FaExternalLinkAlt className="text-xs" /> Live
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function Projects() {
  const [featured, ...rest] = PROJECTS;
  return (
    <Section id="projects">
      <SectionHeader eyebrow="Selected Work" title="Featured Projects" sub="A snapshot of what I've built while learning and applying full-stack engineering." />
      <div className="grid gap-6 md:grid-cols-2">
        <ProjectCard p={featured} i={0} featured />
        {rest.map((p, i) => (
          <ProjectCard key={p.title} p={p} i={i + 1} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <a href="https://github.com/au820621104070" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:bg-white/10">
          Explore all repositories on GitHub <FaExternalLinkAlt className="text-[10px]" />
        </a>
      </div>
    </Section>
  );
}

/* ----------------------------- Certifications ----------------------------- */

const CERTS = [
  { title: "Java Full Stack Training", org: "QSpiders", year: "2025 – 26", color: "from-primary to-highlight", id: "JFS-2025" },
  { title: "Cloud Computing Internship", org: "The Mind IT Solution", year: "Aug 2024", color: "from-highlight to-primary", id: "CC-2024" },
  { title: "Software Engineering", org: "Wells Fargo · Forage", year: "Jun 2026", color: "from-primary to-purple-500", id: "WF-SE" },
  { title: "Data Analytics", org: "Deloitte · Forage", year: "Jun 2026", color: "from-emerald-500 to-primary", id: "DEL-DA" },
  { title: "GenAI Data Analytics", org: "Tata · Forage", year: "Jun 2026", color: "from-highlight to-emerald-400", id: "TATA-GAI" },
];

function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeader eyebrow="Recognition" title="Certifications" sub="Programs completed to deepen my engineering foundation." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((c, i) => (
          <motion.div
            key={c.title}
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-3xl p-[1px]"
          >
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${c.color} opacity-50 transition-opacity group-hover:opacity-100`} />
            <div className="relative h-full rounded-3xl glass-strong p-6">
              <div className={`absolute -right-14 -top-14 h-40 w-40 rounded-full bg-gradient-to-br ${c.color} opacity-30 blur-2xl transition-opacity group-hover:opacity-60`} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.05 }}
                    className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-2xl text-primary-foreground shadow-lg`}
                  >
                    <FaAward />
                  </motion.div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {c.year}
                  </span>
                </div>
                <h3 className="mt-5 font-semibold">{c.title}</h3>
                <div className="text-sm text-muted-foreground">{c.org}</div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="font-mono text-[10px] text-muted-foreground">ID · {c.id}</div>
                  <div className="inline-flex items-center gap-1 text-xs text-highlight">
                    <FaCheckCircle /> Verified
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- Contact ----------------------------- */

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
const submit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setStatus("sending");

  try {
  await emailjs.sendForm(
    "service_nsbtmlw",
    "template_6nrr1bf",
    e.currentTarget,
    "yvXJSh7tuZPB2sBjz"
  );

  setStatus("sent");
} catch (error) {
  console.error(error);
  setStatus("idle");
  alert("Failed to send message");
}
};
  const details = [
    { icon: <FaEnvelope />, label: "Email", value: "sabarishsri03@gmail.com", href: "mailto:sabarishsri03@gmail.com" },
    { icon: <FaPhone />, label: "Phone", value: "+91 8248353887", href: "tel:+918248353887" },
    { icon: <FaMapMarkerAlt />, label: "Location", value: "Chennai, Tamil Nadu, India" },
    { icon: <FaGithub />, label: "GitHub", value: "au820621104070", href: "https://github.com/au820621104070" },
    { icon: <FaLinkedin />, label: "LinkedIn", value: "sabarish-kumar-srinivasan", href: "https://www.linkedin.com/in/sabarish-kumar-srinivasan-91a178273" },
  ];
  return (
    <Section id="contact">
      <SectionHeader eyebrow="Let's Connect" title="Get in Touch" sub="Have a project, role, or idea in mind? I'd love to hear from you." />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl glass-strong p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-muted-foreground">Currently accepting new opportunities</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold">Let's build something together</h3>
            <p className="mt-2 text-sm text-muted-foreground">Available for full-time roles, internships, and freelance collaborations.</p>

            <div className="mt-6 space-y-2.5">
              {details.map((d) => (
                <a key={d.label} href={d.href ?? "#"} target={d.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition-all hover:border-primary/40 hover:bg-white/[0.06] hover:translate-x-1">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-highlight/25 text-primary">{d.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{d.label}</div>
                    <div className="truncate text-sm">{d.value}</div>
                  </div>
                  <FaChevronRight className="text-[10px] text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </a>
              ))}
            </div>

            <a href="/sabarish-kumar-CV.pdf" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-highlight px-6 py-3 font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)] hover:scale-[1.02] transition-transform">
              <FaDownload /> Download Resume
            </a>
          </div>
        </motion.div>

        <form onSubmit={submit}
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl glass-strong p-8">
          <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-highlight/20 blur-3xl" />
          <div className="relative">
            <div className="mb-6 flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[11px] text-highlight w-fit">
              <span className="text-emerald-400">POST</span>
              <span className="text-white/40">/api/</span>
              <span>contact</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Name</span>
                <input required maxLength={100} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30" placeholder="Your name" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email</span>
                <input required type="email" maxLength={255} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30" placeholder="you@company.com" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Subject</span>
              <input required maxLength={150} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30" placeholder="Let's build something great" />
            </label>
            <label className="mt-4 block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Message</span>
              <textarea required maxLength={1000} rows={6} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30" placeholder="Tell me about your project or opportunity..." />
            </label>
            <button type="submit" disabled={status !== "idle"}
              className="group relative mt-6 inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-primary to-highlight px-7 py-3 font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)] transition-transform hover:scale-[1.02] disabled:opacity-70">
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center gap-2">
                {status === "sent" ? (<><FaCheckCircle /> Message sent</>)
                  : status === "sending" ? "Sending..."
                  : (<>Send Message <FaPaperPlane className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></>)}
              </span>
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
}


/* ----------------------------- Footer + Back to top ----------------------------- */

function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="text-sm text-muted-foreground text-center md:text-left">
          © 2026 Sabarish Kumar Srinivasan.
          <span className="block md:inline md:ml-2">Designed & Developed by Sabarish Kumar Srinivasan.</span>
        </div>
        <div className="flex gap-3">
          {[
            { icon: <FaGithub />, href: "https://github.com/au820621104070" },
            { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/sabarish-kumar-srinivasan-91a178273" },
            { icon: <FaEnvelope />, href: "mailto:sabarishsri03@gmail.com" },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl glass hover:text-primary">{s.icon}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500);
    on(); window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-highlight text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)] transition-all ${show ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"}`}
      aria-label="Back to top">
      <FaArrowUp />
    </button>
  );
}

/* ----------------------------- Page ----------------------------- */

function Portfolio() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Services />
        <Experience />
        <Education />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
