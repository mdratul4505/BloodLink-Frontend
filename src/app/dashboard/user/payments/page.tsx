"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreditCard, Heart, ShieldCheck, ExternalLink, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { paymentService } from "@/services";

export default function UserPaymentsPage() {
  const [amount, setAmount] = useState<number>(500);
  const [purpose, setPurpose] = useState<"PLATFORM_SUPPORT" | "EMERGENCY_FUND">("PLATFORM_SUPPORT");
  const [payerPhone, setPayerPhone] = useState("01770618575");
  const [errorMsg, setErrorMsg] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["my-payments"],
    queryFn: paymentService.getMyPayments,
  });

  const payments = data?.data || [];

  const createPaymentMutation = useMutation({
    mutationFn: paymentService.createBkashPayment,
    onSuccess: (res) => {
      const bkashURL = res.data?.bkashURL;
      if (bkashURL) {
        toast.add({
          title: "bKash Session Created",
          description: "Redirecting to official bKash gateway...",
          type: "success",
        });
        window.location.href = bkashURL;
      } else {
        toast.add({
          title: "Payment Initiated",
          description: "Payment session created.",
          type: "success",
        });
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to initialize bKash payment.";
      setErrorMsg(msg);
      toast.add({
        title: "Payment Error",
        description: msg,
        type: "error",
      });
    },
  });

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!amount || amount < 10) {
      setErrorMsg("Minimum voluntary contribution is 10 BDT.");
      return;
    }

    createPaymentMutation.mutate({
      amount: Number(amount),
      purpose,
      payerReference: payerPhone.trim() || undefined,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Voluntary Platform Support & Donations
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Support the BloodLink life-saving emergency platform operations via secure bKash checkout.
        </p>
      </div>

      {/* Donation Creation Form */}
      <Card className="border border-border shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2.5 text-primary mb-1">
            <Heart className="size-5 fill-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Secure bKash Checkout</span>
          </div>
          <CardTitle className="text-lg font-bold">Make a Voluntary Contribution</CardTitle>
          <CardDescription className="text-xs">
            100% of voluntary funds go toward platform maintenance, SMS/Email OTP costs, and emergency coordination.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMsg && (
            <div className="p-3.5 mb-5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handlePay} className="space-y-5">
            {/* Amount Presets */}
            <div className="space-y-2">
              <Label className="text-xs font-bold">Select Contribution Amount (BDT)</Label>
              <div className="grid grid-cols-4 gap-2.5">
                {[100, 250, 500, 1000].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={amount === preset ? "default" : "outline"}
                    onClick={() => setAmount(preset)}
                    className="font-bold text-xs"
                  >
                    ৳{preset}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="custom-amount" className="text-xs font-bold">
                  Custom Amount (BDT)
                </Label>
                <Input
                  id="custom-amount"
                  type="number"
                  min={10}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="payer-phone" className="text-xs font-bold">
                  bKash Test Wallet / Phone
                </Label>
                <Input
                  id="payer-phone"
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="01770618575"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={createPaymentMutation.isPending}
                className="w-full sm:w-auto font-bold gap-2 shadow-md bg-[#e2136e] hover:bg-[#c0105e] text-white"
              >
                <CreditCard className="size-4" />
                <span>
                  {createPaymentMutation.isPending
                    ? "Connecting to bKash..."
                    : `Pay ৳${amount} with bKash`}
                </span>
                <ExternalLink className="size-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="border border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold">My Contribution History</CardTitle>
          <CardDescription className="text-xs">
            Past payments and platform contributions processed through bKash PGW
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-xs text-muted-foreground">
                    Loading payments...
                  </TableCell>
                </TableRow>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold text-sm text-foreground">
                      ৳{p.amount} {p.currency}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          p.status === "PAID"
                            ? "bg-emerald-600 text-white font-bold text-[10px]"
                            : "text-muted-foreground text-[10px]"
                        }
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {p.trxId || p.merchantInvoiceNumber}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.purpose.replace("_", " ")}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    No payment history recorded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
