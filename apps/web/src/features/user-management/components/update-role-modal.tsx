"use client";

import { Shield, User } from "lucide-react";
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

import { updateUserRole } from "@/features/user-management/actions/update-user";
import { UserTableData } from "@/features/user-management/lib/utils";

interface UpdateRoleModalProps {
  user: UserTableData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateRoleModal({
  user,
  open,
  onOpenChange,
  onSuccess
}: UpdateRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">(user.role);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (selectedRole === user.role) {
      toast.info("No changes to save");
      onOpenChange(false);
      return;
    }

    try {
      setIsLoading(true);

      await updateUserRole({
        userId: user.id,
        role: selectedRole
      });

      toast.success(`User role updated to ${selectedRole} successfully!`);
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Failed to update role: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update User Role</DialogTitle>
          <DialogDescription>
            Change the role for {user.name} ({user.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) =>
                setSelectedRole(value as "user" | "admin")
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <div>
                      <span className="font-medium">User</span>
                      <p className="text-xs text-muted-foreground">
                        Standard user access
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <div>
                      <span className="font-medium">Admin</span>
                      <p className="text-xs text-muted-foreground">
                        Full system access
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole !== user.role && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Current role:</strong> {user.role}
                <br />
                <strong>New role:</strong> {selectedRole}
              </p>
            </div>
          )}
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
            onClick={handleUpdateRole}
            loading={isLoading}
            disabled={selectedRole === user.role}
          >
            Update Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
