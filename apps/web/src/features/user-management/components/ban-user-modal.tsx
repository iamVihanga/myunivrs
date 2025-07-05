"use client";

import { Calendar, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@repo/ui/components/dialog";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";

import { banUser } from "@/features/user-management/actions/update-user";
import { UserTableData } from "@/features/user-management/lib/utils";

interface BanUserModalProps {
  user: UserTableData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const banDurations = [
  { label: "1 Hour", value: 60 * 60 },
  { label: "1 Day", value: 60 * 60 * 24 },
  { label: "1 Week", value: 60 * 60 * 24 * 7 },
  { label: "1 Month", value: 60 * 60 * 24 * 30 },
  { label: "Permanent", value: null }
];

export function BanUserModal({
  user,
  open,
  onOpenChange,
  onSuccess
}: BanUserModalProps) {
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState<number | null>(60 * 60 * 24); // Default to 1 day
  const [isLoading, setIsLoading] = useState(false);

  const handleBanUser = async () => {
    if (!banReason.trim()) {
      toast.error("Please provide a reason for the ban");
      return;
    }

    try {
      setIsLoading(true);

      await banUser({
        userId: user.id,
        banReason: banReason.trim(),
        ...(banDuration && { banExpiresIn: banDuration })
      });

      const durationText = banDuration
        ? banDurations.find((d) => d.value === banDuration)?.label ||
          "Custom duration"
        : "permanently";

      toast.success(`User banned ${durationText} successfully!`);
      onSuccess?.();
      onOpenChange(false);

      // Reset form
      setBanReason("");
      setBanDuration(60 * 60 * 24);
    } catch (error: any) {
      toast.error(`Failed to ban user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <UserX className="h-5 w-5" />
            Ban User
          </DialogTitle>
          <DialogDescription>
            Ban {user.name} ({user.email}) from the system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="banReason">Reason for Ban *</Label>
            <Textarea
              id="banReason"
              placeholder="Enter the reason for banning this user..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banDuration">Ban Duration</Label>
            <Select
              value={banDuration?.toString() || "permanent"}
              onValueChange={(value) =>
                setBanDuration(value === "permanent" ? null : parseInt(value))
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {banDurations.map((duration) => (
                  <SelectItem
                    key={duration.value?.toString() || "permanent"}
                    value={duration.value?.toString() || "permanent"}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {duration.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action will immediately prevent the
              user from accessing the system.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleBanUser}
            loading={isLoading}
          >
            Ban User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
