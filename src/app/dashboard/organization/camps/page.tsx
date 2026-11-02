"use client";

import React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, PlusCircle, MapPin, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { campService } from "@/services";

export default function ManageCampsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["org-manage-camps"],
    queryFn: () => campService.getCamps({ limit: 20 }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      campService.updateStatus(id, status),
    onSuccess: () => {
      toast.add({
        title: "Camp Status Updated",
        description: "The campaign status has been updated.",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["org-manage-camps"] });
    },
  });

  const camps = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manage Donation Camps
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Organize, schedule, and track status for public voluntary blood donation drives.
          </p>
        </div>
        <Link href="/dashboard/organization/camps/create">
          <Button className="gap-2 font-bold shadow-xs">
            <PlusCircle className="size-4" />
            <span>Create New Camp</span>
          </Button>
        </Link>
      </div>

      <Card className="border border-border shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Camp Title</TableHead>
                <TableHead>Venue & District</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    Loading camps...
                  </TableCell>
                </TableRow>
              ) : camps.length > 0 ? (
                camps.map((camp) => (
                  <TableRow key={camp.id}>
                    <TableCell className="font-bold text-sm text-foreground">
                      {camp.title}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {camp.venue}, {camp.district}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(camp.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          camp.status === "UPCOMING"
                            ? "border-emerald-500 text-emerald-600 text-[10px] font-bold"
                            : camp.status === "ONGOING"
                            ? "bg-amber-600 text-white text-[10px] font-bold"
                            : "text-muted-foreground text-[10px]"
                        }
                      >
                        {camp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/camps/${camp.id}`}>
                        <Button variant="ghost" size="xs">
                          <Eye className="size-3 mr-1" />
                          <span>View</span>
                        </Button>
                      </Link>
                      {camp.status === "UPCOMING" && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => updateStatusMutation.mutate({ id: camp.id, status: "COMPLETED" })}
                          className="text-xs"
                        >
                          Mark Completed
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-xs text-muted-foreground">
                    No donation camps scheduled yet.
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
