import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/index";
import { Toaster } from "@/components/ui/toast";
import EmergencyFloatingButton from "@/components/common/EmergencyFloatingButton";

export const metadata: Metadata = {
  title: "BloodLink — Every Drop Connects a Life",
  description: "Automated Blood Donation & Emergency Coordination Platform. Connect voluntary blood donors, patients, hospitals, and blood banks.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
          <EmergencyFloatingButton />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
