"use client";

import { Suspense } from "react";
import PaymentCallbackPage from "../callback/page";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <PaymentCallbackPage />
    </Suspense>
  );
}
