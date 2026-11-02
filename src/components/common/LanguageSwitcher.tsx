"use client";

import React from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/providers/language.provider";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  align?: "start" | "center" | "end";
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "icon" | "icon-sm";
  showLabel?: boolean;
}

export function LanguageSwitcher({
  className,
  align = "end",
  variant = "ghost",
  size = "sm",
  showLabel = false,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={variant}
            size={size}
            className={cn("gap-1.5 transition-colors font-medium", className)}
            aria-label="Change language / ভাষা পরিবর্তন"
          >
            <Globe className="size-4 text-muted-foreground" />
            <span className="text-xs uppercase font-semibold">
              {language === "bn" ? "বাং" : "EN"}
            </span>
            {showLabel && (
              <span className="hidden sm:inline text-xs text-muted-foreground ml-1">
                {language === "bn" ? "বাংলা" : "English"}
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align={align} className="min-w-36">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              EN
            </span>
            <span>English</span>
          </div>
          {language === "en" && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage("bn")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              বাং
            </span>
            <span>বাংলা</span>
          </div>
          {language === "bn" && <Check className="size-3.5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
