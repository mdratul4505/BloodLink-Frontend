"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Droplet,
  MoreVertical,
  Search,
  Trash2,
  Eye,
  Hospital,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import { bloodRequestService } from "@/services";
import { IBloodRequest, RequestStatus } from "@/types";
import { toast } from "@/components/ui/toast";
import { useLanguage } from "@/providers/language.provider";

const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

export default function AdminBloodRequestsPage() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [groupFilter, setGroupFilter] = useState<string>("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");

  const [selectedRequest, setSelectedRequest] = useState<IBloodRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-blood-requests", statusFilter, groupFilter, urgencyFilter],
    queryFn: () => {
      const params: any = { limit: 100 };
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (groupFilter !== "ALL") params.bloodGroup = groupFilter;
      if (urgencyFilter !== "ALL") params.urgency = urgencyFilter;
      return bloodRequestService.getRequests(params);
    },
  });

  const requests: IBloodRequest[] = response?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RequestStatus }) =>
      bloodRequestService.updateRequest(id, { status }),
    onSuccess: (_, vars) => {
      toast.add({
        title: language === "bn" ? "স্ট্যাটাস আপডেট হয়েছে" : "Status Updated",
        description: `Request marked as ${vars.status}`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-blood-requests"] });
      if (selectedRequest?.id === vars.id) {
        setSelectedRequest((prev) => (prev ? { ...prev, status: vars.status } : null));
      }
    },
    onError: (err: any) => {
      toast.add({
        title: "Error",
        description: err?.message || "Failed to update status",
        type: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bloodRequestService.deleteRequest(id),
    onSuccess: () => {
      toast.add({
        title: language === "bn" ? "অনুরোধ মুছে ফেলা হয়েছে" : "Request Deleted",
        description: "The blood request has been removed",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-blood-requests"] });
      setDetailsOpen(false);
    },
    onError: (err: any) => {
      toast.add({
        title: "Error",
        description: err?.message || "Failed to delete request",
        type: "error",
      });
    },
  });

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    const patientMatch = (r.patientName || "").toLowerCase().includes(q);
    const hospitalMatch = (r.hospitalName || "").toLowerCase().includes(q);
    const districtMatch = (r.district || "").toLowerCase().includes(q);
    const phoneMatch = (r.contactPhone || "").includes(q);
    return patientMatch || hospitalMatch || districtMatch || phoneMatch;
  });

  const totalCount = requests.length;
  const emergencyCount = requests.filter((r) => r.urgency === "CRITICAL").length;
  const openCount = requests.filter((r) => r.status === "OPEN").length;
  const fulfilledCount = requests.filter((r) => r.status === "FULFILLED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {language === "bn" ? "রক্তের অনুরোধ ব্যবস্থাপনা" : "Blood Requests Management"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {language === "bn"
            ? "প্ল্যাটফর্মের সকল রক্তের অনুরোধ তদারকি, স্ট্যাটাস পরিবর্তন ও পর্যালোচনা করুন।"
            : "Monitor, update status, and manage all blood requests across the platform."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "মোট অনুরোধ" : "Total Requests"}
            </CardTitle>
            <Droplet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Platform requests</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "জরুরি ইমার্জেন্সি" : "Critical Emergency"}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{emergencyCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate match</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "সক্রিয় অনুরোধ" : "Active / Open"}
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{openCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Waiting for donor responses</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "সম্পন্ন হয়েছে" : "Fulfilled / Complete"}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{fulfilledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Successful blood donations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  language === "bn"
                    ? "রোগী, হাসপাতাল, জেলা অথবা ফোন দিয়ে খুঁজুন..."
                    : "Search by patient, hospital, district or phone..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="PARTIALLY_FULFILLED">Partially Fulfilled</SelectItem>
                  <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={groupFilter} onValueChange={(val) => val && setGroupFilter(val)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Groups</SelectItem>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={(val) => val && setUrgencyFilter(val)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Urgencies</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "bn" ? "রোগী ও গ্রুপ" : "Patient & Group"}</TableHead>
                <TableHead>{language === "bn" ? "হাসপাতাল ও জেলা" : "Hospital & District"}</TableHead>
                <TableHead>{language === "bn" ? "জরুরি স্তর" : "Urgency"}</TableHead>
                <TableHead>{language === "bn" ? "প্রয়োজনের তারিখ" : "Needed By"}</TableHead>
                <TableHead>{language === "bn" ? "স্ট্যাটাস" : "Status"}</TableHead>
                <TableHead className="text-right">{language === "bn" ? "অ্যাকশন" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      {language === "bn" ? "অনুরোধ লোড হচ্ছে..." : "Loading requests..."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    {language === "bn" ? "কোনো রক্তের অনুরোধ পাওয়া যায়নি" : "No blood requests found"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="destructive"
                          className="font-bold text-xs px-2 py-0.5"
                        >
                          {req.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                        </Badge>
                        <div>
                          <p className="font-medium text-foreground text-sm">{req.patientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {req.units} {req.units > 1 ? "Units" : "Unit"} needed
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Hospital className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[180px]">{req.hospitalName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {req.district}{req.upazila ? `, ${req.upazila}` : ""}
                      </p>
                    </TableCell>

                    <TableCell>
                      {req.urgency === "CRITICAL" ? (
                        <Badge variant="destructive" className="capitalize text-xs">
                          Critical
                        </Badge>
                      ) : req.urgency === "URGENT" ? (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 capitalize text-xs">
                          Urgent
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="capitalize text-xs">
                          Normal
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <p className="text-xs text-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {new Date(req.neededBy).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(req.neededBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          req.status === "OPEN"
                            ? "default"
                            : req.status === "FULFILLED"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs capitalize"
                      >
                        {req.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(req);
                            setDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => updateStatusMutation.mutate({ id: req.id, status: "OPEN" })}
                              disabled={req.status === "OPEN"}
                            >
                              Mark as Open
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatusMutation.mutate({ id: req.id, status: "PARTIALLY_FULFILLED" })}
                              disabled={req.status === "PARTIALLY_FULFILLED"}
                            >
                              Mark Partially Fulfilled
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatusMutation.mutate({ id: req.id, status: "FULFILLED" })}
                              disabled={req.status === "FULFILLED"}
                            >
                              Mark as Fulfilled
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatusMutation.mutate({ id: req.id, status: "CANCELLED" })}
                              disabled={req.status === "CANCELLED"}
                            >
                              Mark as Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteMutation.mutate(req.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Request
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              {selectedRequest?.patientName} - Blood Request
            </DialogTitle>
            <DialogDescription>
              Request ID: {selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground">Blood Group</span>
                  <p className="font-bold text-destructive text-lg">
                    {selectedRequest.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Required Units</span>
                  <p className="font-semibold">{selectedRequest.units} Bag(s)</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Urgency Level</span>
                  <p className="font-semibold capitalize">{selectedRequest.urgency.toLowerCase()}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Status</span>
                  <p className="font-semibold capitalize">{selectedRequest.status.toLowerCase().replace("_", " ")}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Hospital className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground">Hospital</span>
                    <p className="font-medium text-foreground">{selectedRequest.hospitalName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground">Location</span>
                    <p className="font-medium text-foreground">
                      {selectedRequest.district}{selectedRequest.upazila ? `, ${selectedRequest.upazila}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground">Contact Phone</span>
                    <p className="font-medium text-foreground">{selectedRequest.contactPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground">Needed By</span>
                    <p className="font-medium text-foreground">
                      {new Date(selectedRequest.neededBy).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedRequest.note && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Notes / Medical Condition</span>
                    <p className="mt-1 text-sm bg-muted/30 p-2.5 rounded text-foreground">
                      {selectedRequest.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between gap-2">
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              {selectedRequest?.status !== "FULFILLED" && (
                <Button
                  onClick={() => selectedRequest && updateStatusMutation.mutate({ id: selectedRequest.id, status: "FULFILLED" })}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Mark Fulfilled
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
