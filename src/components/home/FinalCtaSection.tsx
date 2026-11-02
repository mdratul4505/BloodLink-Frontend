"use client";

import React from "react";
import Link from "next/link";
import { Heart, UserPlus, Droplet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language.provider";

export function FinalCtaSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white relative overflow-hidden">
      {/* Subtle decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="size-16 mx-auto rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
          <Heart className="size-8 fill-white" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {t.cta.headline}
          </h2>
          <p className="text-base sm:text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
            {t.cta.subhead}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-red-700 hover:bg-red-50 hover:text-red-800 font-bold shadow-lg"
            >
              <UserPlus className="size-4 mr-2" />
              <span>{t.cta.becomeDonor}</span>
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </Link>

          <Link href="/blood-requests/create" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-white/40 text-white hover:bg-white/10 font-bold"
            >
              <Droplet className="size-4 mr-2 fill-white" />
              <span>{t.cta.requestBlood}</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
