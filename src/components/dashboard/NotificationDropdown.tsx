"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Clock, Droplet, Calendar, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notificationService } from "@/services";
import { NotificationType, INotification } from "@/types";

export function NotificationDropdown() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
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
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative"
            aria-label="View notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 size-2 rounded-full bg-red-600 animate-pulse" />
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-[10px] py-0 px-1.5 h-4">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="text-[11px] text-muted-foreground hover:text-foreground gap-1"
            >
              <CheckCheck className="size-3" />
              <span>Mark all read</span>
            </Button>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.isRead) markReadMutation.mutate(item.id);
                }}
                className={`p-3 transition-colors cursor-pointer hover:bg-muted/50 ${
                  !item.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <div className="size-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground leading-tight">
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className="size-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {item.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 pt-0.5">
                      <Clock className="size-2.5" />
                      <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No notifications at this time
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
