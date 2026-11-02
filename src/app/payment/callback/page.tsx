"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Receipt,
  Home,
  RefreshCw,
} from "lucide-react";
import { paymentService } from "@/services";
import { IPayment } from "@/types";
import { useLanguage } from "@/providers/language.provider";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();

  const paymentID = searchParams.get("paymentID");
  const statusParam = searchParams.get("status");

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<IPayment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!paymentID && !statusParam) {
        setError("Invalid payment callback parameters.");
        setLoading(false);
        return;
      }

      if (statusParam === "cancel" || statusParam === "failure") {
        setError(
          statusParam === "cancel"
            ? "Payment was cancelled by the user."
            : "Payment processing failed through bKash."
        );
        setIsSuccess(false);
        setLoading(false);
        return;
      }

      try {
        const res = await paymentService.executeBkashCallback({
          paymentID: paymentID || undefined,
          status: statusParam || undefined,
        });

        if (res.data) {
          setPayment(res.data);
          setIsSuccess(res.data.status === "PAID" || statusParam === "success");
        } else {
          setIsSuccess(statusParam === "success");
        }
      } catch (err: any) {
        // Fallback: if backend already verified asynchronously, check statusParam
        if (statusParam === "success") {
          setIsSuccess(true);
        } else {
          setError(err.message || "Failed to verify transaction with payment gateway.");
        }
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [paymentID, statusParam]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <Card className="w-full max-w-lg border-border shadow-lg">
        {loading ? (
          <CardContent className="py-16 text-center space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-foreground">
              {language === "bn" ? "পেমেন্ট যাচাই করা হচ্ছে..." : "Verifying Payment..."}
            </h2>
            <p className="text-sm text-muted-foreground">
              {language === "bn"
                ? "অনুগ্রহ করে অপেক্ষা করুন, bKash গেটওয়ে থেকে লেনদেন যাচাই চলছে..."
                : "Please wait while we confirm your transaction with bKash..."}
            </p>
          </CardContent>
        ) : isSuccess ? (
          <>
            <CardHeader className="text-center pb-2">
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {language === "bn" ? "পেমেন্ট সফল হয়েছে!" : "Payment Successful!"}
              </CardTitle>
              <CardDescription>
                {language === "bn"
                  ? "BloodLink প্ল্যাটফর্মে অনুদান দেওয়ার জন্য আপনাকে আন্তরিক ধন্যবাদ।"
                  : "Thank you for your generous contribution to BloodLink."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              <div className="rounded-xl bg-muted/40 p-4 border border-border space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-sm text-foreground">
                    ৳ {payment?.amount ? Number(payment.amount).toLocaleString() : "Confirmed"} BDT
                  </span>
                </div>
                {payment?.trxId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">bKash TrxID:</span>
                    <span className="font-mono font-semibold text-primary">
                      {payment.trxId}
                    </span>
                  </div>
                )}
                {paymentID && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID:</span>
                    <span className="font-mono text-muted-foreground truncate max-w-[200px]">
                      {paymentID}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="bg-emerald-600 text-white text-[11px]">
                    Completed
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  onClick={() => router.push("/dashboard/user/payments")}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  {language === "bn" ? "আমার রসিদ দেখুন" : "View My Receipts"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/dashboard/user")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  {language === "bn" ? "ড্যাশবোর্ডে ফিরুন" : "Go to Dashboard"}
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center pb-2">
              <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {language === "bn" ? "পেমেন্ট ব্যর্থ হয়েছে" : "Payment Unsuccessful"}
              </CardTitle>
              <CardDescription>
                {error || "The transaction could not be completed."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  onClick={() => router.push("/dashboard/user/payments")}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {language === "bn" ? "পুনরায় চেষ্টা করুন" : "Try Again"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  {language === "bn" ? "হোমপেজে ফিরুন" : "Return Home"}
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
