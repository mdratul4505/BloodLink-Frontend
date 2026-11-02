"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  clickable?: boolean;
}

export function Logo({
  className,
  size = "md",
  showTagline = false,
  clickable = true,
}: LogoProps) {
  const iconSizes = {
    sm: "size-7",
    md: "size-9",
    lg: "size-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-sm ring-1 ring-red-500/20",
          iconSizes[size]
        )}
      >
        {/* Custom Blood Drop + Connected Link Symbol */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Blood droplet contour */}
          <path
            d="M16 3C16 3 8 13.5 8 19C8 23.4183 11.5817 27 16 27C20.4183 27 24 23.4183 24 19C24 13.5 16 3 16 3Z"
            fill="currentColor"
            fillOpacity="0.25"
          />
          <path
            d="M16 3C16 3 8 13.5 8 19C8 23.4183 11.5817 27 16 27C20.4183 27 24 23.4183 24 19C24 13.5 16 3 16 3Z"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Intertwined link node */}
          <circle cx="16" cy="19" r="3" fill="white" />
          <path
            d="M13 19H7M25 19H19M16 16V10M16 26V22"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={cn("font-bold tracking-tight text-foreground", textSizes[size])}>
            Blood<span className="text-primary">Link</span>
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wide text-muted-foreground font-medium -mt-1">
            Every Drop Connects a Life
          </span>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-flex transition-opacity hover:opacity-95 focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
