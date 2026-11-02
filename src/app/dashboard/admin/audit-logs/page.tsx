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
  ShieldAlert,
  Search,
  Clock,
  Eye,
  FileCode2,
  Activity,
  User,
  Layers,
} from "lucide-react";
import { adminService } from "@/services";
import { IAuditLog } from "@/types";
import { useLanguage } from "@/providers/language.provider";

export default function AdminAuditLogsPage() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-audit-logs", actionFilter],
    queryFn: () => {
      const params: any = { limit: 100 };
      if (actionFilter !== "ALL") params.action = actionFilter;
      return adminService.getAuditLogs(params);
    },
  });

  const logs: IAuditLog[] = response?.data || [];

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    const actionMatch = (log.action || "").toLowerCase().includes(q);
    const targetMatch = (log.targetType || "").toLowerCase().includes(q) || (log.targetId || "").toLowerCase().includes(q);
    const actorMatch = (log.actor?.name || "").toLowerCase().includes(q) || (log.actor?.email || "").toLowerCase().includes(q);
    return actionMatch || targetMatch || actorMatch;
  });

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("REGISTER") || act.includes("CONFIRM")) {
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">{action}</Badge>;
    }
    if (act.includes("UPDATE") || act.includes("VERIFY") || act.includes("CHANGE")) {
      return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-xs">{action}</Badge>;
    }
    if (act.includes("DELETE") || act.includes("REJECT") || act.includes("CANCEL") || act.includes("SUSPEND")) {
      return <Badge variant="destructive" className="text-xs">{action}</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {language === "bn" ? "সিস্টেম অডিট লগ" : "System Audit Logs"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {language === "bn"
            ? "প্ল্যাটফর্মের নিরাপত্তা ঘটনা, এডমিন কার্যকলাপ এবং ডেটা পরিবর্তনের সম্পূর্ণ লগ।"
            : "Complete audit trail of security events, administrative actions, and data mutations."}
        </p>
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
                    ? "অ্যাকশন, টার্গেট বা ব্যবহারকারী দিয়ে খুঁজুন..."
                    : "Search by action, target, or actor..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={actionFilter} onValueChange={(val) => val && setActionFilter(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Actions</SelectItem>
                <SelectItem value="USER_STATUS_CHANGE">User Status Change</SelectItem>
                <SelectItem value="ORG_VERIFICATION">Org Verification</SelectItem>
                <SelectItem value="BLOOD_REQUEST_CREATE">Blood Request Create</SelectItem>
                <SelectItem value="CAMP_CREATE">Camp Create</SelectItem>
                <SelectItem value="PAYMENT_SUCCESS">Payment Success</SelectItem>
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
                <TableHead>{language === "bn" ? "সময়" : "Timestamp"}</TableHead>
                <TableHead>{language === "bn" ? "অ্যাকশন" : "Action"}</TableHead>
                <TableHead>{language === "bn" ? "কর্তা (Actor)" : "Actor"}</TableHead>
                <TableHead>{language === "bn" ? "টার্গেট অবজেক্ট" : "Target Object"}</TableHead>
                <TableHead className="text-right">{language === "bn" ? "বিস্তারিত" : "Details"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      {language === "bn" ? "অডিট লগ লোড হচ্ছে..." : "Loading audit logs..."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    {language === "bn" ? "কোনো অডিট লগ পাওয়া যায়নি" : "No audit logs found"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getActionBadge(log.action)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {log.actor?.name || "System Automated"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {log.actor?.email || log.actorId || "System"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {log.targetType}
                        </span>
                        {log.targetId && (
                          <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[120px]">
                            #{log.targetId.slice(-6)}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedLog(log);
                          setDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1 text-primary" />
                        <span className="text-xs">JSON</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* JSON Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-primary" />
              Audit Log Event Details
            </DialogTitle>
            <DialogDescription>
              Log ID: {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-lg">
                <div>
                  <span className="text-muted-foreground">Action:</span>
                  <p className="font-semibold text-foreground">{selectedLog.action}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Timestamp:</span>
                  <p className="font-medium text-foreground">{new Date(selectedLog.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Target Type:</span>
                  <p className="font-semibold text-foreground">{selectedLog.targetType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Target ID:</span>
                  <p className="font-mono text-foreground">{selectedLog.targetId || "N/A"}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-muted-foreground mb-1 block">Payload Details (JSON):</span>
                <pre className="text-xs font-mono bg-zinc-950 text-zinc-100 p-3 rounded-lg overflow-x-auto max-h-60 border border-zinc-800">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
