"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, HeartHandshake, Eye, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import apiClient from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { IApiResponse, IDonorResponse } from "@/types";

export default function MyResponsesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-responses"],
    queryFn: async () => {
      // In BloodLink backend, donor responses are tracked via blood requests responses
      const { data } = await apiClient.get<IApiResponse<IDonorResponse[]>>(
        "/blood-requests/my-responses"
      ).catch(() => ({ data: { data: [] } }));
      return data;
    },
  });

  const responses = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Donor Responses
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          History of emergency requests you have responded to and life-saving donations.
        </p>
      </div>

      <Card className="border border-border shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Response Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    Loading your responses...
                  </TableCell>
                </TableRow>
              ) : responses.length > 0 ? (
                responses.map((resp) => (
                  <TableRow key={resp.id}>
                    <TableCell className="font-bold text-sm text-foreground">
                      {resp.request?.hospitalName || "Emergency Request"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {resp.request?.district || "Bangladesh"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          resp.status === "DONATED"
                            ? "bg-blue-600 text-white font-bold text-[10px]"
                            : resp.status === "CONFIRMED"
                            ? "bg-emerald-600 text-white font-bold text-[10px]"
                            : resp.status === "AVAILABLE"
                            ? "border-amber-500 text-amber-600 dark:text-amber-400 font-bold text-[10px]"
                            : "text-muted-foreground text-[10px]"
                        }
                      >
                        {resp.status === "CONFIRMED"
                          ? "Approved & Confirmed"
                          : resp.status === "AVAILABLE"
                          ? "Pending Approval"
                          : resp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(resp.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {resp.requestId && (
                        <Link href={`/blood-requests/${resp.requestId}`}>
                          <Button variant="ghost" size="xs" className="gap-1 text-xs">
                            <Eye className="size-3" />
                            <span>Details</span>
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-xs text-muted-foreground">
                    <HeartHandshake className="size-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p>You haven&apos;t responded to any blood requests yet.</p>
                    <Link href="/blood-requests" className="inline-block pt-2">
                      <Button size="xs" variant="outline">
                        Browse Emergency Requests
                      </Button>
                    </Link>
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
