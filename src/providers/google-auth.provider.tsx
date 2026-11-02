"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export default function GoogleAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  if (
    !clientId ||
    clientId.includes("placeholder") ||
    clientId.includes("your_google_client_id")
  ) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
