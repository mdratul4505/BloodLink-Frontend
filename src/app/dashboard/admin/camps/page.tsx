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
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Search,
  Eye,
  Building2,
  MapPin,
  Users,
  Tent,
} from "lucide-react";
import { campService } from "@/services";
import { IDonationCamp, CampStatus } from "@/types";
import { toast } from "@/components/ui/toast";
import { useLanguage } from "@/providers/language.provider";

export default function AdminCampsPage() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [selectedCamp, setSelectedCamp] = useState<IDonationCamp | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-camps-list", statusFilter],
    queryFn: () => {
      const params: any = { limit: 100 };
      if (statusFilter !== "ALL") params.status = statusFilter;
      return campService.getCamps(params);
    },
  });

  const camps: IDonationCamp[] = response?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CampStatus }) =>
      campService.updateStatus(id, status),
    onSuccess: (_, vars) => {
      toast.add({
        title: language === "bn" ? "স্ট্যাটাস আপডেট হয়েছে" : "Status Updated",
        description: `Camp marked as ${vars.status}`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-camps-list"] });
      if (selectedCamp?.id === vars.id) {
        setSelectedCamp((prev) => (prev ? { ...prev, status: vars.status } : null));
      }
    },
    onError: (err: any) => {
      toast.add({
        title: "Error",
        description: err?.message || "Failed to update camp status",
        type: "error",
      });
    },
  });

  const filtered = camps.filter((c) => {
    const q = search.toLowerCase();
    const titleMatch = (c.title || "").toLowerCase().includes(q);
    const venueMatch = (c.venue || "").toLowerCase().includes(q);
    const districtMatch = (c.district || "").toLowerCase().includes(q);
    const orgMatch = (c.organization?.name || "").toLowerCase().includes(q);
    return titleMatch || venueMatch || districtMatch || orgMatch;
  });

  const totalCount = camps.length;
  const upcomingCount = camps.filter((c) => c.status === "UPCOMING").length;
  const ongoingCount = camps.filter((c) => c.status === "ONGOING").length;
  const completedCount = camps.filter((c) => c.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {language === "bn" ? "রক্তদান ক্যাম্প ব্যবস্থাপনা" : "Donation Camps Management"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {language === "bn"
            ? "প্ল্যাটফর্মের সকল রক্তদান ক্যাম্প তদারকি, স্ট্যাটাস পরিবর্তন ও নিবন্ধন পর্যালোচনা করুন।"
            : "Monitor, manage statuses, and inspect donor registrations for all platform blood camps."}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "মোট ক্যাম্প" : "Total Camps"}
            </CardTitle>
            <Tent className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Platform-wide donation camps</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "আসন্ন ক্যাম্প" : "Upcoming Camps"}
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{upcomingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled for future dates</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "চলমান ক্যাম্প" : "Ongoing Camps"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{ongoingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Happening right now</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === "bn" ? "সম্পন্ন ক্যাম্প" : "Completed Camps"}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully concluded</p>
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
                    ? "ক্যাম্পের নাম, ভেন্যু, জেলা বা সংস্থা দিয়ে খুঁজুন..."
                    : "Search by camp title, venue, district, or organization..."
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
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
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
                <TableHead>{language === "bn" ? "ক্যাম্প ও সংস্থা" : "Camp & Organization"}</TableHead>
                <TableHead>{language === "bn" ? "স্থান ও জেলা" : "Venue & District"}</TableHead>
                <TableHead>{language === "bn" ? "তারিখ" : "Date"}</TableHead>
                <TableHead>{language === "bn" ? "নিবন্ধিত দাতা" : "Registrations"}</TableHead>
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
                      {language === "bn" ? "ক্যাম্প লোড হচ্ছে..." : "Loading donation camps..."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    {language === "bn" ? "কোনো রক্তদান ক্যাম্প পাওয়া যায়নি" : "No donation camps found"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((camp) => (
                  <TableRow key={camp.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm">{camp.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3 w-3 shrink-0" />
                          {camp.organization?.name || "BloodLink Organization"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-foreground">{camp.venue}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {camp.district}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="text-xs text-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {new Date(camp.date).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(camp.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{camp.registrations?.length || 0} Donors</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          camp.status === "ONGOING"
                            ? "default"
                            : camp.status === "COMPLETED"
                            ? "secondary"
                            : camp.status === "CANCELLED"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs capitalize"
                      >
                        {camp.status.toLowerCase()}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCamp(camp);
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
                              onClick={() => updateStatusMutation.mutate({ id: camp.id, status: "UPCOMING" })}
                              disabled={camp.status === "UPCOMING"}
                            >
                              Mark Upcoming
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatusMutation.mutate({ id: camp.id, status: "ONGOING" })}
                              disabled={camp.status === "ONGOING"}
                            >
                              Mark Ongoing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatusMutation.mutate({ id: camp.id, status: "COMPLETED" })}
                              disabled={camp.status === "COMPLETED"}
                            >
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => updateStatusMutation.mutate({ id: camp.id, status: "CANCELLED" })}
                              disabled={camp.status === "CANCELLED"}
                            >
                              Cancel Camp
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
              <Tent className="h-5 w-5 text-primary" />
              {selectedCamp?.title}
            </DialogTitle>
            <DialogDescription>
              Donation Camp ID: {selectedCamp?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedCamp && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground">Organizer</span>
                  <p className="font-semibold text-foreground">{selectedCamp.organization?.name || "BloodLink Organization"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Camp Status</span>
                  <p className="font-semibold capitalize">{selectedCamp.status.toLowerCase()}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Registered Donors</span>
                  <p className="font-semibold">{selectedCamp.registrations?.length || 0} Registered</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">District</span>
                  <p className="font-semibold">{selectedCamp.district}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground">Venue</span>
                    <p className="font-medium text-foreground">{selectedCamp.venue}, {selectedCamp.district}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground">Schedule</span>
                    <p className="font-medium text-foreground">
                      {new Date(selectedCamp.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedCamp.description && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Campaign Description</span>
                    <p className="mt-1 text-sm bg-muted/30 p-2.5 rounded text-foreground">
                      {selectedCamp.description}
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
              {selectedCamp?.status !== "COMPLETED" && (
                <Button
                  onClick={() => selectedCamp && updateStatusMutation.mutate({ id: selectedCamp.id, status: "COMPLETED" })}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Mark Completed
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
