"use client";

import React from "react";
import { UserPlus, Search, BellRing, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/providers/language.provider";

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
      icon: UserPlus,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
    },
    {
      num: "02",
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
      icon: Search,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      num: "03",
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
      icon: BellRing,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      num: "04",
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
      icon: HeartHandshake,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t.howItWorks.title}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card
                key={idx}
                className="relative overflow-hidden border border-border/80 bg-card hover:shadow-md transition-all duration-300 group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`size-12 rounded-2xl flex items-center justify-center ${step.bg}`}
                    >
                      <Icon className={`size-6 ${step.color}`} />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground pt-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
