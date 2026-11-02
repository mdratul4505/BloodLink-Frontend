import Link from "next/link";
import { Button } from "@/components/ui/button";
import BloodLinkLogo from "@/components/common/Logo";
import { Droplet, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mb-2">
          <BloodLinkLogo size="lg" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
            <Droplet className="h-3.5 w-3.5 fill-destructive" />
            404 Error — Page Not Found
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Lost in the Stream?
          </h1>
          <p className="text-sm text-muted-foreground">
            The page you are looking for might have been moved, removed, or doesn&apos;t exist in the BloodLink platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-sm font-medium transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/donors"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background hover:bg-muted text-foreground h-9 px-4 text-sm font-medium transition-all"
          >
            <Search className="h-4 w-4" />
            <span>Search Donors</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Need urgent blood donation assistance? Contact emergency services or call platform hotline.
          </p>
        </div>
      </div>
    </div>
  );
}
