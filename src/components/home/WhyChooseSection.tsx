"use client";

import React from "react";
import { Search, ShieldCheck, Building2, BellRing, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/providers/language.provider";

export function WhyChooseSection() {
  const { t } = useLanguage();

  const features = [
    {
      title: t.whyChoose.feat1Title,
      desc: t.whyChoose.feat1Desc,
      icon: Search,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
    },
    {
      title: t.whyChoose.feat2Title,
      desc: t.whyChoose.feat2Desc,
      icon: ShieldCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: t.whyChoose.feat3Title,
      desc: t.whyChoose.feat3Desc,
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: t.whyChoose.feat4Title,
      desc: t.whyChoose.feat4Desc,
      icon: BellRing,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: t.whyChoose.feat5Title,
      desc: t.whyChoose.feat5Desc,
      icon: HeartHandshake,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t.whyChoose.title}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {t.whyChoose.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                className="border border-border/80 bg-card hover:shadow-sm transition-all duration-200"
              >
                <CardContent className="p-6 space-y-3">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center ${feat.bg}`}
                  >
                    <Icon className={`size-6 ${feat.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground pt-1">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.desc}
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
