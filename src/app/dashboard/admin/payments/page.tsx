"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Receipt,
  Eye,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { adminService } from "@/services";
import { IPayment } from "@/types";
import { toast } from "@/components/ui/toast";
import { useLanguage } from "@/providers/language.provider";

export default function AdminPaymentsPage() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-payments-list", statusFilter],
    queryFn: () => {
      const params: any = { limit: 100 };
      if (statusFilter !== "ALL") params.status = statusFilter;
      return adminService.getPayments(params);
    },
  });

  const payments: IPayment[] = response?.data || [];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.add({
      title: "Copied",
      description: "Transaction ID copied to clipboard",
      type: "success",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const invoiceMatch = (p.merchantInvoiceNumber || "").toLowerCase().includes(q);
    const trxMatch = (p.trxId || "").toLowerCase().includes(q);
    const bkashMatch = (p.bkashPaymentId || "").toLowerCase().includes(q);
    const userMatch = (p.user?.name || "").toLowerCase().includes(q) || (p.user?.email || "").toLowerCase().includes(q);
    return invoiceMatch || trxMatch || bkashMatch || userMatch;
  });

  const totalVolume = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const paidCount = payments.filter((p) => p.status === "PAID").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const failedCount = payments.filter((p) => p.status === "FAILED" || p.status === "CANCELLED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {language === "bn" ? "পেমেন্ট ও অনুদান ট্র্যাকিং" : "Payments & Donations Tracking"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {language === "bn"
            ? "প্ল্যাটফর্মের সকল bKash লেনদেন ও জরুরি তহবিলের অডিট পর্যবেক্ষণ করুন।"
            : "Audit and verify all platform bKash transactions, receipts, and emergency fund contributions."}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "মোট সংগৃহীত তহবিল" : "Total Volume"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">৳ {totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully collected (BDT)</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "সফল লেনদেন" : "Completed Payments"}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{paidCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed transactions</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "অপেক্ষমাণ লেনদেন" : "Pending Transactions"}
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting bKash confirmation</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "ব্যর্থ / বাতিল" : "Failed / Cancelled"}
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{failedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Incomplete or aborted</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  language === "bn"
                    ? "ইনভয়েস, TrxID, bKash পেমেন্ট আইডি বা ব্যবহারকারী দিয়ে খুঁজুন..."
                    : "Search by Invoice, TrxID, bKash ID, or User..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PAID">Paid / Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "bn" ? "ইনভয়েস ও TrxID" : "Invoice & TrxID"}</TableHead>
                <TableHead>{language === "bn" ? "ব্যবহারকারী" : "User / Contributor"}</TableHead>
                <TableHead>{language === "bn" ? "পরিমাণ" : "Amount"}</TableHead>
                <TableHead>{language === "bn" ? "পেমেন্ট মাধ্যম" : "Provider"}</TableHead>
                <TableHead>{language === "bn" ? "উদ্দেশ্য" : "Purpose"}</TableHead>
                <TableHead>{language === "bn" ? "স্ট্যাটাস" : "Status"}</TableHead>
                <TableHead className="text-right">{language === "bn" ? "রসিদ" : "Receipt"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      {language === "bn" ? "পেমেন্ট লোড হচ্ছে..." : "Loading payments..."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    {language === "bn" ? "কোনো লেনদেন রেকর্ড পাওয়া যায়নি" : "No payment records found"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((pay) => (
                  <TableRow key={pay.id}>
                    <TableCell>
                      <div>
                        <p className="font-mono text-xs font-semibold text-foreground">
                          {pay.merchantInvoiceNumber}
                        </p>
                        {pay.trxId ? (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {pay.trxId}
                            </span>
                            <button
                              onClick={() => copyToClipboard(pay.trxId!, pay.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {copiedId === pay.id ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">No TrxID yet</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm font-medium text-foreground">
                        {pay.user?.name || "Anonymous Donor"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pay.user?.email || pay.payerMobile || "N/A"}
                      </p>
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-foreground">
                        ৳ {Number(pay.amount).toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">BDT</span>
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-pink-600/10 text-pink-600 dark:text-pink-400 border-pink-500/20 font-semibold text-xs">
                        {pay.provider}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-foreground capitalize">
                        {pay.purpose.toLowerCase().replace("_", " ")}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          pay.status === "PAID"
                            ? "default"
                            : pay.status === "PENDING"
                            ? "outline"
                            : "destructive"
                        }
                        className="text-xs capitalize"
                      >
                        {pay.status.toLowerCase()}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPayment(pay);
                          setReceiptOpen(true);
                        }}
                      >
                        <Receipt className="h-4 w-4 mr-1 text-primary" />
                        <span className="text-xs">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Payment Receipt
            </DialogTitle>
            <DialogDescription>
              Official BloodLink Payment Transaction Record
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4 py-2 text-sm border-t border-b border-border my-2">
              <div className="flex justify-between items-center bg-muted/40 p-3 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground">Paid Amount</span>
                  <div className="text-2xl font-bold text-foreground">
                    ৳ {Number(selectedPayment.amount).toLocaleString()} BDT
                  </div>
                </div>
                <Badge
                  variant={selectedPayment.status === "PAID" ? "default" : "destructive"}
                  className="capitalize"
                >
                  {selectedPayment.status.toLowerCase()}
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Number:</span>
                  <span className="font-mono font-medium text-foreground">
                    {selectedPayment.merchantInvoiceNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">bKash TrxID:</span>
                  <span className="font-mono font-semibold text-primary">
                    {selectedPayment.trxId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">bKash Payment ID:</span>
                  <span className="font-mono text-foreground truncate max-w-[200px]">
                    {selectedPayment.bkashPaymentId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contributor Name:</span>
                  <span className="font-medium text-foreground">
                    {selectedPayment.user?.name || "Anonymous Donor"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contributor Email:</span>
                  <span className="font-medium text-foreground">
                    {selectedPayment.user?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purpose:</span>
                  <span className="font-medium text-foreground capitalize">
                    {selectedPayment.purpose.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium text-foreground">
                    {new Date(selectedPayment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setReceiptOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
