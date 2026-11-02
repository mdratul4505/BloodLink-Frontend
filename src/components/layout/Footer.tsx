"use client";

import React from "react";
import Link from "next/link";
import { Heart, Droplet, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/providers/language.provider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-border bg-card/60 backdrop-blur-sm text-foreground transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm pt-2">
              {t.footer.about}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/mdratul4505"
                target="_blank"
                rel="noreferrer"
                className="size-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="GitHub Profile"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/md-ratul-hasan/"
                target="_blank"
                rel="noreferrer"
                className="size-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="LinkedIn Profile"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/donors" className="hover:text-primary transition-colors">
                  {t.common.findDonors}
                </Link>
              </li>
              <li>
                <Link href="/blood-requests" className="hover:text-primary transition-colors">
                  {t.common.bloodRequests}
                </Link>
              </li>
              <li>
                <Link href="/organizations" className="hover:text-primary transition-colors">
                  {t.common.organizations}
                </Link>
              </li>
              <li>
                <Link href="/camps" className="hover:text-primary transition-colors">
                  {t.common.camps}
                </Link>
              </li>
              <li>
                <Link href="/developer" className="hover:text-primary transition-colors">
                  {t.common.developer}
                </Link>
              </li>
            </ul>
          </div>

          {/* Blood Groups Fast Access */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              {t.common.bloodGroup}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <Link href="/donors?group=A_POSITIVE" className="hover:text-primary transition-colors">
                A Positive (A+)
              </Link>
              <Link href="/donors?group=A_NEGATIVE" className="hover:text-primary transition-colors">
                A Negative (A-)
              </Link>
              <Link href="/donors?group=B_POSITIVE" className="hover:text-primary transition-colors">
                B Positive (B+)
              </Link>
              <Link href="/donors?group=B_NEGATIVE" className="hover:text-primary transition-colors">
                B Negative (B-)
              </Link>
              <Link href="/donors?group=O_POSITIVE" className="hover:text-primary transition-colors">
                O Positive (O+)
              </Link>
              <Link href="/donors?group=O_NEGATIVE" className="hover:text-primary transition-colors">
                O Negative (O-)
              </Link>
              <Link href="/donors?group=AB_POSITIVE" className="hover:text-primary transition-colors">
                AB Positive (AB+)
              </Link>
              <Link href="/donors?group=AB_NEGATIVE" className="hover:text-primary transition-colors">
                AB Negative (AB-)
              </Link>
            </div>
          </div>

          {/* Emergency & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              {t.footer.contact}
            </h4>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                <span className="text-xs">OTP Verified Donors</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-primary shrink-0" />
                <span className="text-xs">support@bloodlink.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-primary shrink-0" />
                <span className="text-xs">Hotline: +880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary shrink-0" />
                <span className="text-xs">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BloodLink. {t.footer.allRights}</p>
          <div className="flex items-center gap-2">
            <span>Built by</span>
            <Link
              href="/developer"
              className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              MD. Ratul Hasan
            </Link>
            <span>• Full-Stack Engineer</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="ghost" size="sm" />
            <ThemeSwitcher variant="ghost" size="icon-sm" />
          </div>
        </div>
      </div>
    </footer>
  );
}
