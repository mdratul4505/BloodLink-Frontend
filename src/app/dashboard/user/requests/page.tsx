"use client";

import React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Droplet, PlusCircle, Calendar, MapPin, Eye, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { bloodRequestService } from "@/services";

export default function MyRequestsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-blood-requests"],
    queryFn: bloodRequestService.getMyRequests,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bloodRequestService.deleteRequest(id),
    onSuccess: () => {
      toast.add({
        title: "Request Cancelled",
        description: "Blood request has been cancelled.",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["my-blood-requests"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Action Failed",
        description: err?.response?.data?.message || "Failed to cancel request.",
        type: "error",
      });
    },
  });

  const requests = data?.data || [];

  const formatBloodGroup = (bg: string) => {
    return bg.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Blood Requests
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track, manage, and coordinate your posted emergency blood requirements.
          </p>
        </div>
        <Link href="/blood-requests/create">
          <Button className="gap-2 font-bold shadow-xs">
            <PlusCircle className="size-4" />
            <span>Create New Request</span>
          </Button>
        </Link>
      </div>

      <Card className="border border-border shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blood Group</TableHead>
                <TableHead>Hospital & Location</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Needed By</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <Badge className="bg-primary text-white font-extrabold text-xs">
                        {formatBloodGroup(req.bloodGroup)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-sm text-foreground">{req.hospitalName}</p>
                        {req.responses && req.responses.length > 0 && (
                          <Badge
                            variant="outline"
                            className="border-amber-500 text-amber-600 bg-amber-500/10 text-[10px] font-bold"
                          >
                            {req.responses.length} {req.responses.length === 1 ? "Offer" : "Offers"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{req.district}</p>
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      {req.unitsFulfilled} / {req.units} Bags
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(req.neededBy).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          req.urgency === "CRITICAL"
                            ? "border-red-500 text-red-600 font-bold text-[10px]"
                            : req.urgency === "URGENT"
                            ? "border-amber-500 text-amber-600 font-bold text-[10px]"
                            : "text-muted-foreground text-[10px]"
                        }
                      >
                        {req.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          req.status === "OPEN"
                            ? "border-emerald-500 text-emerald-600 text-[10px] font-bold"
                            : req.status === "FULFILLED"
                            ? "bg-emerald-600 text-white text-[10px] font-bold"
                            : "text-muted-foreground text-[10px]"
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/blood-requests/${req.id}`}>
                        <Button variant="outline" size="xs" className="gap-1.5 text-xs font-semibold">
                          <Eye className="size-3" />
                          <span>View & Responses</span>
                        </Button>
                      </Link>
                      {req.status === "OPEN" && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            if (confirm("Are you sure you want to cancel this request?")) {
                              deleteMutation.mutate(req.id);
                            }
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                    No requests posted yet. Click &quot;Create New Request&quot; above to start.
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
