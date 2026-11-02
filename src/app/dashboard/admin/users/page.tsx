"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Search, Shield, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { adminService } from "@/services";
import { UserStatus } from "@/types";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users-list", search, role, status],
    queryFn: () =>
      adminService.getUsers({
        search: search.trim() || undefined,
        role: role === "ALL" ? undefined : role,
        status: status === "ALL" ? undefined : status,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      adminService.updateUserStatus(id, status),
    onSuccess: (res) => {
      toast.add({
        title: "User Status Updated",
        description: `User account is now ${res.data?.status || "updated"}.`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Action Failed",
        description: err?.response?.data?.message || "Failed to update user status.",
        type: "error",
      });
    },
  });

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Manage Platform Users
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Search, audit, and regulate user privileges and account suspension statuses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-border shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={role} onValueChange={(val) => val && setRole(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="USER">User / Donor</SelectItem>
                <SelectItem value="ORGANIZATION">Organization</SelectItem>
                <SelectItem value="HOSPITAL">Hospital</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(val) => val && setStatus(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border border-border shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User / Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <p className="font-bold text-sm text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          u.isVerified
                            ? "border-emerald-500 text-emerald-600 font-bold text-[10px]"
                            : "text-muted-foreground text-[10px]"
                        }
                      >
                        {u.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          u.status === "ACTIVE"
                            ? "bg-emerald-600 text-white font-bold text-[10px]"
                            : "bg-destructive text-white font-bold text-[10px]"
                        }
                      >
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.role !== "ADMIN" && (
                        <Button
                          variant={u.status === "ACTIVE" ? "destructive" : "outline"}
                          size="xs"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: u.id,
                              status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                            })
                          }
                          disabled={updateStatusMutation.isPending}
                          className="text-xs font-semibold"
                        >
                          {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    No users found matching search criteria.
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
