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
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-32 pb-16">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <motion.div style={{ y }} className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/30 blur-3xl animate-blob" />
      <motion.div style={{ y }} className="pointer-events-none absolute top-40 -right-32 h-[460px] w-[460px] rounded-full bg-highlight/25 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute inset-0">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute block h-1 w-1 rounded-full bg-white/40"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 47) % 100}%`,
              animation: `float ${6 + (i % 5)}s ease-in-out ${i * 0.4}s infinite`,
              boxShadow: "0 0 12px rgba(59,130,246,0.7)",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.15fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for opportunities · 2025 Graduate
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05]">
            Hi, I'm <span className="text-gradient">Sabarish</span>
            <br />
            <span className="text-foreground/90">a </span>
            <span className="relative">
              <span className="text-gradient">{typed || "\u00A0"}</span>
              <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-1 bg-highlight animate-caret" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Building scalable software. Solving real problems. Creating meaningful digital experiences with Java, Spring Boot, and modern web technologies.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-highlight px-6 py-3 font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)] transition-transform hover:scale-[1.03]">
              View Projects <FaChevronRight className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 font-medium hover:bg-white/10">
              <FaDownload /> Download Resume
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium hover:border-primary/60 hover:text-primary">
              Contact Me
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Find me on</span>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-white/20 to-transparent" />
            <div className="flex gap-3">
              {[
                { icon: <FaGithub />, href: "https://github.com/au820621104070" },
                { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/sabarish-kumar-srinivasan-91a178273" },
                { icon: <FaEnvelope />, href: "mailto:sabarishsri03@gmail.com" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  className="grid h-11 w-11 place-items-center rounded-xl glass text-lg transition-all hover:text-primary hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)]">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/40 via-highlight/20 to-transparent blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] glass-strong p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
            <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
              <img src={heroPortrait} alt="Sabarish Kumar Srinivasan" width={1024} height={1280} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </div>
          {/* Floating tags */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-4 top-16 rounded-2xl glass-strong px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <FaJava className="text-lg text-[#f89820]" /> Java · Spring Boot
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
            className="absolute -right-4 bottom-24 rounded-2xl glass-strong px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <FaCode className="text-primary" /> Full Stack
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-4 left-10 rounded-2xl glass-strong px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <FaCloud className="text-highlight" /> Cloud Ready
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------- About ----------------------------- */

function About() {
  const highlights = ["Problem Solver", "Fast Learner", "Team Player", "Analytical Thinker", "Continuous Learner"];
  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-highlight">
            <span className="h-1.5 w-1.5 rounded-full bg-highlight" /> About Me
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Turning ideas into <span className="text-gradient">reliable software</span></h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>My name is Sabarish Kumar Srinivasan. I enjoy turning innovative ideas into reliable software solutions.</p>
            <p>As a passionate Java Full Stack Developer, I focus on creating scalable web applications, clean backend architectures, and intuitive user experiences.</p>
            <p>I enjoy solving real-world challenges through software engineering while continuously expanding my knowledge of modern technologies including Spring Boot, REST APIs, Cloud Computing, and Full Stack Development.</p>
            <p className="text-foreground">I believe continuous learning and problem-solving are the foundations of becoming a great engineer.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <span key={h} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
                <FaCheckCircle className="text-primary" /> {h}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-2 gap-4">
          {[
            { n: 3, s: "+", label: "Projects Completed", icon: <FaProjectDiagram /> },
            { n: 3, s: "+", label: "Training & Internships", icon: <FaBriefcase /> },
            { n: 30, s: "+", label: "Technical Skills", icon: <FaCode /> },
            { n: 7.54, d: 2, label: "CGPA / 10", icon: <FaGraduationCap /> },
          ].map((s, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl glass p-6 transition-transform hover:-translate-y-1">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 to-primary/0 transition-all group-hover:from-primary/10 group-hover:to-highlight/10" />
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-gradient">
                <Counter to={s.n} decimals={s.d ?? 0} suffix={s.s ?? ""} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
          <div className="col-span-2 rounded-2xl glass p-5 text-center">
            <div className="text-sm text-muted-foreground">Graduating</div>
            <div className="text-2xl font-bold text-gradient">Class of 2025</div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ----------------------------- Skills ----------------------------- */

const SKILL_GROUPS: { title: string; icon: React.ReactNode; items: { name: string; level: number; icon?: React.ReactNode }[] }[] = [
  {
    title: "Programming Languages", icon: <FaCode />,
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
      { name: "CRUD Operations", level: 90 },
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
    title: "Tools & Software Engineering", icon: <SiJetpackcompose />,
    items: [
      { name: "Git & GitHub", level: 88, icon: <FaGitAlt /> },
      { name: "Eclipse", level: 85, icon: <SiEclipseide /> },
      { name: "VS Code", level: 90, icon: <VscVscode /> },
      { name: "Vercel", level: 80, icon: <SiVercel /> },
      { name: "Agile / SDLC / DSA", level: 80 },
    ],
  },
];

function SkillBar({ level }: { level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${level}%` } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-primary to-highlight"
      />
    </div>
  );
}

function Skills() {
  return (
    <Section id="skills">
      <SectionHeader eyebrow="Toolkit" title="Skills & Technologies" sub="A modern stack for building scalable, maintainable, high-quality software." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SKILL_GROUPS.map((g, i) => (
          <motion.div key={g.title}
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-3xl glass p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.35)]"
          >
            <div className="absolute -inset-px rounded-3xl opacity-0 transition-opacity group-hover:opacity-100 [background:linear-gradient(135deg,rgba(59,130,246,0.35),rgba(6,182,212,0.25))] [mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] [mask-composite:exclude] [-webkit-mask-composite:xor] p-px" />
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-highlight/25 text-primary text-lg">{g.icon}</div>
              <h3 className="font-semibold">{g.title}</h3>
            </div>
            <div className="space-y-4">
              {g.items.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {s.icon && <span className="text-muted-foreground">{s.icon}</span>}
                      {s.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{s.level}%</span>
                  </div>
                  <SkillBar level={s.level} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl glass p-6">
        <div className="mb-3 text-sm uppercase tracking-widest text-highlight">Core Strengths</div>
        <div className="flex flex-wrap gap-2">
          {["Full Stack Development","API Integration","Clean Code","Problem Solving","Analytical Thinking","Team Collaboration","Adaptability"].map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm">{t}</span>
          ))}
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
      desc: "Develop scalable web applications using Java, Spring Boot, REST APIs, MySQL, HTML, CSS, and JavaScript.",
      tags: ["Spring Boot", "REST", "MySQL"],
    },
    {
      icon: <FaReact />, title: "Frontend Development",
      desc: "Create responsive, modern, user-friendly interfaces focused on performance and user experience.",
      tags: ["HTML/CSS", "JavaScript", "Responsive"],
    },
  ];
  return (
    <Section id="services">
      <SectionHeader eyebrow="What I Do" title="Services" sub="Focused capabilities I bring to every project." />
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((s, i) => (
          <motion.div key={i}
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl glass p-8"
          >
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl transition-all group-hover:bg-primary/30" />
            <div className="relative">
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-highlight text-2xl text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)]">
                {s.icon}
              </div>
              <h3 className="text-2xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-muted-foreground">{s.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">{t}</span>
                ))}
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
    points: ["Core & Advanced Java, SQL, Spring Boot, REST APIs",
             "Built Personal Budget Tracker (Java + MySQL)",
             "Built Employee Management REST API (Spring Boot + JPA)",
             "MVC Architecture · Full Stack Development"],
  },
  {
    role: "Cloud Computing Intern",
    org: "The Mind IT Solution",
    date: "Jul 2024 – Aug 2024",
    points: ["Cloud infrastructure fundamentals",
             "Cost optimization strategies",
             "Secure cloud architecture patterns",
             "Deployment automation basics"],
  },
  {
    role: "Virtual Job Simulations",
    org: "Forage · Wells Fargo · Deloitte · Tata GenAI",
    date: "May 2026 – Jun 2026",
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
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute left-4 md:left-1/2 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-highlight/40 to-transparent md:-translate-x-1/2" />
        <div className="space-y-10">
          {EXPERIENCE.map((e, i) => (
            <motion.div key={i}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
              className={`relative grid md:grid-cols-2 gap-6 md:gap-12 ${i % 2 ? "md:[direction:rtl]" : ""}`}
            >
              <div className="absolute left-4 md:left-1/2 top-6 h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary to-highlight ring-4 ring-background shadow-[0_0_20px_rgba(59,130,246,0.7)]" />
              <div className={`pl-12 md:pl-0 ${i % 2 ? "md:pr-12" : "md:pl-12"} [direction:ltr]`}>
                <div className="rounded-2xl glass p-6">
                  <div className="text-xs uppercase tracking-widest text-highlight">{e.date}</div>
                  <h3 className="mt-2 text-xl font-semibold">{e.role}</h3>
                  <div className="text-sm text-muted-foreground">{e.org}</div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <FaChevronRight className="mt-1 shrink-0 text-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------- Education ----------------------------- */

function Education() {
  return (
    <Section id="education">
      <SectionHeader eyebrow="Academia" title="Education" />
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-highlight/20 blur-3xl" />
          <div className="flex items-start gap-6">
            <motion.div
              animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-highlight text-3xl text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)]"
            >
              <FaGraduationCap />
            </motion.div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-highlight">2021 – 2025</div>
              <h3 className="mt-1 text-2xl font-bold">Bachelor of Engineering</h3>
              <div className="text-muted-foreground">Computer Science and Engineering</div>
              <div className="mt-1 text-sm text-muted-foreground">Arasu Engineering College · Anna University</div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-4">
                  <div className="text-xs text-muted-foreground">CGPA</div>
                  <div className="text-2xl font-bold text-gradient">7.54 / 10</div>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <div className="text-xs text-muted-foreground">Graduation</div>
                  <div className="text-2xl font-bold text-gradient">2025</div>
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
    gradient: "from-primary/40 to-highlight/20",
    icon: "🔐",
  },
  {
    title: "Personal Budget Tracker",
    desc: "Java desktop app with MySQL persistence for CRUD-based expense tracking and monthly reporting — reduced manual tracking effort by 40%.",
    tech: ["Java", "MySQL", "JDBC"],
    features: ["CRUD Operations", "Expense Tracking", "Monthly Reports", "Data Persistence"],
    gradient: "from-highlight/40 to-primary/20",
    icon: "💰",
  },
  {
    title: "Employee Management REST API",
    desc: "Spring Boot REST API using MVC architecture with JPA for employee lifecycle management and optimized database access.",
    tech: ["Spring Boot", "Java", "REST", "MySQL", "JPA", "JDBC"],
    features: ["Employee CRUD", "RESTful APIs", "MVC Architecture", "Database Optimization"],
    gradient: "from-primary/40 to-purple-500/20",
    icon: "🧩",
  },
];

function Projects() {
  return (
    <Section id="projects">
      <SectionHeader eyebrow="Selected Work" title="Featured Projects" sub="A snapshot of what I've built while learning and applying full-stack engineering." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <motion.article key={p.title}
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.08 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl glass transition-all hover:-translate-y-2 hover:shadow-[0_30px_80px_-20px_rgba(59,130,246,0.45)]"
          >
            <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${p.gradient}`}>
              <div className="absolute inset-0 grid-bg opacity-40" />
              <div className="absolute inset-0 grid place-items-center text-7xl">{p.icon}</div>
              <div className="absolute bottom-3 left-3 rounded-full glass-strong px-3 py-1 text-xs">Project 0{i + 1}</div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-4 space-y-1 text-sm">
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
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- Certifications ----------------------------- */

const CERTS = [
  { title: "Java Full Stack Training", org: "QSpiders", color: "from-primary to-highlight" },
  { title: "Cloud Computing Internship", org: "The Mind IT Solution", color: "from-highlight to-primary" },
  { title: "Software Engineering", org: "Wells Fargo · Forage", color: "from-primary to-purple-500" },
  { title: "Data Analytics", org: "Deloitte · Forage", color: "from-emerald-500 to-primary" },
  { title: "GenAI Data Analytics", org: "Tata · Forage", color: "from-highlight to-emerald-400" },
];

function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeader eyebrow="Recognition" title="Certifications" sub="Programs completed to deepen my engineering foundation." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((c, i) => (
          <motion.div key={c.title}
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-3xl glass p-6"
          >
            <div className={`absolute -right-14 -top-14 h-40 w-40 rounded-full bg-gradient-to-br ${c.color} opacity-30 blur-2xl transition-opacity group-hover:opacity-60`} />
            <div className="relative flex items-start gap-4">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-2xl text-primary-foreground shadow-lg`}
              >
                <FaAward />
              </motion.div>
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <div className="text-sm text-muted-foreground">{c.org}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-highlight">
                  Verified <FaCheckCircle />
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
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900);
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
          className="rounded-3xl glass p-8">
          <h3 className="text-xl font-semibold">Contact information</h3>
          <p className="mt-2 text-sm text-muted-foreground">Available for full-time roles, internships, and freelance collaborations.</p>
          <div className="mt-6 space-y-3">
            {details.map((d) => (
              <a key={d.label} href={d.href ?? "#"} target={d.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-primary/40 hover:bg-white/[0.06]">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">{d.icon}</div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.label}</div>
                  <div className="truncate text-sm">{d.value}</div>
                </div>
              </a>
            ))}
          </div>
          <a href="#" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-highlight px-6 py-3 font-medium text-primary-foreground">
            <FaDownload /> Download Resume
          </a>
        </motion.div>

        <motion.form onSubmit={submit}
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="rounded-3xl glass p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Name</span>
              <input required maxLength={100} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" placeholder="Your name" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
              <input required type="email" maxLength={255} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" placeholder="you@company.com" />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Subject</span>
            <input required maxLength={150} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" placeholder="Let's build something great" />
          </label>
          <label className="mt-4 block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Message</span>
            <textarea required maxLength={1000} rows={6} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" placeholder="Tell me about your project or opportunity..." />
          </label>
          <button type="submit" disabled={status !== "idle"}
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary to-highlight px-7 py-3 font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)] transition-transform hover:scale-[1.02] disabled:opacity-70">
            {status === "sent" ? (<><FaCheckCircle /> Message sent</>)
              : status === "sending" ? "Sending..."
              : (<>Send Message <FaPaperPlane className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></>)}
          </button>
        </motion.form>
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
