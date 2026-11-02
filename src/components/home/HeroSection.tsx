"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Droplet,
  Heart,
  Search,
  UserPlus,
  ShieldCheck,
  Activity,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/providers/language.provider";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-red-50/50 via-background to-background dark:from-red-950/20 dark:via-background dark:to-background">
      {/* Subtle background ambient circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold tracking-wide shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              {t.hero.headline.split(",")[0]},
              <span className="text-primary block mt-1">
                {t.hero.headline.split(",")[1] || "Save Lives."}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.hero.subhead}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link href="/donors" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 font-semibold shadow-md shadow-red-500/10">
                  <Search className="size-4" />
                  <span>{t.hero.findDonorBtn}</span>
                  <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 font-semibold border-border hover:bg-muted"
                >
                  <UserPlus className="size-4 text-primary" />
                  <span>{t.hero.becomeDonorBtn}</span>
                </Button>
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 border-t border-border/60 grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">100% OTP</p>
                  <p className="text-[11px] text-muted-foreground">Verified</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Real-time</p>
                  <p className="text-[11px] text-muted-foreground">Alerts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="size-5 text-sky-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">24/7</p>
                  <p className="text-[11px] text-muted-foreground">Emergency</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Blood Donation Interactive Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Decorative background aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-rose-400/10 rounded-3xl blur-2xl transform rotate-3" />

              {/* Elevated interactive graphic card */}
              <div className="relative rounded-3xl border border-border bg-card/90 backdrop-blur-md p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-primary">
                      <Droplet className="size-4 fill-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Emergency Matching</h4>
                      <p className="text-[11px] text-muted-foreground">Active Coordination</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs">
                    Live System
                  </Badge>
                </div>

                {/* Simulated Realtime Emergency Request Card */}
                <div className="rounded-2xl border border-red-200/60 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-red-600 animate-ping inline-block" />
                      Critical Request
                    </span>
                    <Badge className="bg-primary text-white font-extrabold text-xs">
                      O Positive (O+)
                    </Badge>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">Dhaka Medical College Hospital</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">Needed: 2 Units • Immediate Surgery</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-red-200/40 dark:border-red-900/30 text-xs">
                    <span className="text-muted-foreground">Location: Dhaka Central</span>
                    <span className="font-semibold text-primary">3 Donors Responded</span>
                  </div>
                </div>

                {/* Blood Group Quick Grid Selector Preview */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    Compatible Blood Types
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map((grp) => (
                      <div
                        key={grp}
                        className="py-1.5 px-2 rounded-lg border border-border text-xs font-bold bg-muted/40 hover:border-primary hover:text-primary transition-colors cursor-pointer select-none"
                      >
                        {grp}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stat Pill */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Heart className="size-4 text-primary fill-primary" />
                    <span>Every 2 seconds someone needs blood</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
