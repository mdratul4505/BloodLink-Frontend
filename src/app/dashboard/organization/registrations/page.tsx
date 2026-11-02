"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Calendar, CheckCircle2, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { campService } from "@/services";

export default function CampRegistrationsPage() {
  const { data: campsData, isLoading } = useQuery({
    queryKey: ["org-camps-with-regs"],
    queryFn: () => campService.getCamps({ limit: 10 }),
  });

  const camps = campsData?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Camp Donor Registrations
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review voluntary participants registered for upcoming and past donation campaigns.
        </p>
      </div>

      <Card className="border border-border shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Camp Title</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Registered Donors</TableHead>
                <TableHead>Camp Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    Loading registrations...
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
                    <TableCell className="text-xs font-bold text-foreground">
                      {camp.registrations?.length || 0} Participants
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {camp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-xs text-muted-foreground">
                    No registrations found.
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
