"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
  align?: "start" | "center" | "end";
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "icon" | "icon-sm";
}

export function ThemeSwitcher({
  className,
  align = "end",
  variant = "ghost",
  size = "icon-sm",
}: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={variant}
            size={size}
            className={cn("relative transition-colors", className)}
            aria-label="Toggle application theme"
          >
            {/* Smooth transition between light/dark icons */}
            <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-sky-400" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align={align} className="min-w-36">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-amber-500" />
            <span>Light</span>
          </div>
          {mounted && theme === "light" && (
            <Check className="size-3.5 text-primary" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Moon className="size-4 text-sky-400" />
            <span>Dark</span>
          </div>
          {mounted && theme === "dark" && (
            <Check className="size-3.5 text-primary" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Monitor className="size-4 text-muted-foreground" />
            <span>System</span>
          </div>
          {mounted && theme === "system" && (
            <Check className="size-3.5 text-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSwitcher;
