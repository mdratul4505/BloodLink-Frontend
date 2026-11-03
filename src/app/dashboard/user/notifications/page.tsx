"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Clock, Droplet, Heart, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notificationService } from "@/services";
import { NotificationType, INotification } from "@/types";

export default function UserNotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const rawData: any = data?.data;
  const notifications: INotification[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.notifications)
    ? rawData.notifications
    : [];
  const unreadCount =
    typeof rawData?.unreadCount === "number"
      ? rawData.unreadCount
      : notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "NEW_MATCHING_REQUEST":
        return <Droplet className="size-4 text-red-600 fill-red-600" />;
      case "DONOR_RESPONDED":
      case "RESPONSE_CONFIRMED":
        return <Heart className="size-4 text-rose-500 fill-rose-500" />;
      case "CAMP_UPDATE":
        return <Calendar className="size-4 text-emerald-500" />;
      case "PAYMENT_UPDATE":
        return <ShieldCheck className="size-4 text-blue-500" />;
      default:
        return <Bell className="size-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Stay informed about emergency requests, donor responses, and campaign updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="gap-2 text-xs font-semibold"
          >
            <CheckCheck className="size-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </Button>
        )}
      </div>

      <Card className="border border-border shadow-xs">
        <CardContent className="p-0 divide-y divide-border/60">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.isRead) markReadMutation.mutate(item.id);
                }}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-muted/40 ${
                  !item.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="size-3" />
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.isRead && (
                  <span className="size-2 rounded-full bg-primary shrink-0 self-center" />
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <Bell className="size-10 mx-auto text-muted-foreground/40 mb-2" />
              <p>You have no notifications right now.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
