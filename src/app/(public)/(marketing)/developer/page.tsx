"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Code2,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Mail,
  Send,
  Layers,
  Terminal,
  Database,
  Cpu,
  Globe,
  Heart,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeveloperPage() {
  const skills = [
    { name: "TypeScript", level: "Advanced", category: "Language", icon: Code2, color: "text-blue-500" },
    { name: "JavaScript", level: "Advanced", category: "Language", icon: Terminal, color: "text-yellow-500" },
    { name: "Next.js", level: "Full-Stack", category: "Framework", icon: Globe, color: "text-neutral-400" },
    { name: "React.js", level: "Frontend", category: "Frontend", icon: Layers, color: "text-cyan-400" },
    { name: "Node.js", level: "Backend", category: "Backend", icon: Cpu, color: "text-green-500" },
    { name: "Express.js", level: "Backend", category: "Backend", icon: Terminal, color: "text-neutral-400" },
    { name: "PostgreSQL", level: "Relational DB", category: "Database", icon: Database, color: "text-sky-500" },
    { name: "Prisma ORM", level: "ORM", category: "Database", icon: Database, color: "text-teal-500" },
    { name: "MongoDB", level: "NoSQL DB", category: "Database", icon: Database, color: "text-emerald-500" },
    { name: "Tailwind CSS", level: "Styling", category: "Frontend", icon: Sparkles, color: "text-teal-400" },
    { name: "HTML5", level: "Foundation", category: "Frontend", icon: Code2, color: "text-orange-500" },
    { name: "CSS3", level: "Styling", category: "Frontend", icon: Code2, color: "text-blue-400" },
    { name: "Git & GitHub", level: "VCS", category: "Tools", icon: Terminal, color: "text-red-500" },
  ];

  const timeline = [
    {
      period: "Diploma in Engineering",
      institution: "Satkhira Polytechnic Institute",
      field: "Computer Science & Technology",
      desc: "Foundational and practical coursework in computer engineering, algorithms, data structures, relational databases, software design, and web technology.",
    },
    {
      period: "Full-Stack Mastery & Architecture",
      institution: "Self-Driven & Open-Source Projects",
      field: "Modern Web & Enterprise Applications",
      desc: "Architected high-throughput REST APIs, multi-tenant databases, transaction management with Prisma and PostgreSQL, tokenized payment flows, and responsive web user interfaces.",
    },
    {
      period: "BloodLink — Healthcare SaaS Platform",
      institution: "Lead Architectural Engineering",
      field: "Emergency Blood Donation Network",
      desc: "Designed and engineered the full backend (56 API endpoints) and complete Next.js 16 + shadcn/ui frontend with real-time donor matching, OTP email verification, and tokenized bKash integration.",
    },
  ];

  return (
    <div className="py-12 sm:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Developer Hero */}
        <div className="relative">
          {/* Subtle background ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-500/10 dark:bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12 text-center md:text-left">
            {/* Developer Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative shrink-0"
            >
              <div className="size-36 sm:size-44 rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 p-1 shadow-2xl">
                <div className="w-full h-full rounded-[22px] bg-card relative overflow-hidden">
                  <Image
                    src="/admin.jpg"
                    alt="MD. Ratul Hasan - Developer"
                    fill
                    className="object-cover object-top rounded-[22px]"
                    priority
                  />
                </div>
              </div>
              <Badge className="absolute -bottom-2 right-2 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 shadow-sm">
                Available for Hire
              </Badge>
            </motion.div>

            {/* Bio Information */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4 max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300 text-xs font-bold">
                <Sparkles className="size-3.5" />
                <span>Full-Stack Software Engineer</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                MD. Ratul Hasan
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <GraduationCap className="size-4 text-primary" />
                  Satkhira Polytechnic Institute
                </span>
                <span>•</span>
                <span>Computer Science & Technology</span>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Passionate software engineer focused on building robust, scalable full-stack applications with TypeScript, Next.js, Node.js, Express, and PostgreSQL. Creator and architect of BloodLink.
              </p>

              {/* Social and Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href="https://github.com/mdratul4505"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="sm" className="gap-2 font-bold shadow-xs">
                    <svg className="size-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub Profile</span>
                    <ExternalLink className="size-3.5" />
                  </Button>
                </a>

                <a
                  href="https://www.linkedin.com/in/md-ratul-hasan/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="sm" variant="outline" className="gap-2 font-bold">
                    <svg className="size-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LinkedIn</span>
                    <ExternalLink className="size-3.5" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Technical Skills Section */}
        <div className="space-y-6 pt-8 border-t border-border">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Technical Expertise & Skills
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Core technologies, frameworks, and database architectures utilized in production codebases.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {skills.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <Card
                  key={idx}
                  className="border border-border/80 bg-card hover:border-primary/50 transition-all duration-200 shadow-xs"
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className={`size-4 ${skill.color}`} />
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                        {skill.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{skill.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{skill.level}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Academic & Learning Timeline */}
        <div className="space-y-6 pt-8 border-t border-border">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Education & Engineering Journey
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Academic diploma background and full-stack software development milestones.
            </p>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-border/60">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative flex gap-6 items-start pl-2">
                <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm z-10">
                  {idx + 1}
                </div>
                <Card className="flex-1 border border-border/80 bg-card shadow-xs">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-base font-bold text-foreground">{item.period}</h3>
                      <Badge variant="outline" className="text-xs text-primary font-semibold self-start sm:self-auto">
                        {item.institution}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground">{item.field}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Project Showcase */}
        <div className="space-y-6 pt-8 border-t border-border">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Featured Project: BloodLink Platform
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A full-stack, enterprise-grade healthcare SaaS system for automated emergency blood donation.
            </p>
          </div>

          <Card className="border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge className="bg-primary text-white text-xs font-bold mb-2">
                    Full-Stack Production System
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">BloodLink SaaS Platform</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automated Blood Donation & Emergency Coordination Architecture
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/">
                    <Button size="sm" variant="outline" className="font-semibold">
                      Explore Home
                    </Button>
                  </Link>
                  <Link href="/blood-requests">
                    <Button size="sm" className="font-semibold">
                      Live Requests
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-xs text-muted-foreground block">Backend Endpoints</span>
                  <span className="text-2xl font-bold text-foreground">56 APIs</span>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-xs text-muted-foreground block">UI Framework</span>
                  <span className="text-2xl font-bold text-foreground">shadcn/ui</span>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-xs text-muted-foreground block">Security</span>
                  <span className="text-2xl font-bold text-foreground">Email OTP</span>
                </div>
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-xs text-muted-foreground block">Payment Gateway</span>
                  <span className="text-2xl font-bold text-foreground">bKash PGW</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="pt-8 border-t border-border text-center space-y-4 max-w-xl mx-auto">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Mail className="size-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Connect with MD. Ratul Hasan</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Interested in collaboration, technical roles, or software engineering inquiries?
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <a href="https://github.com/mdratul4505" target="_blank" rel="noreferrer">
              <Button size="sm" className="font-semibold gap-1.5">
                <span>View GitHub Repositories</span>
                <ExternalLink className="size-3.5" />
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/md-ratul-hasan/" target="_blank" rel="noreferrer">
              <Button size="sm" variant="outline" className="font-semibold gap-1.5">
                <span>Connect on LinkedIn</span>
                <ExternalLink className="size-3.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
