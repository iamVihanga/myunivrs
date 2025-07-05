"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
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
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

import { deleteUser } from "@/features/user-management/actions/update-user";
import { UserTableData } from "@/features/user-management/lib/utils";

interface DeleteUserModalProps {
  user: UserTableData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteUserModal({
  user,
  open,
  onOpenChange,
  onSuccess
}: DeleteUserModalProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const expectedText = `DELETE ${user.email}`;
  const isConfirmationValid = confirmationText === expectedText;

  const handleDeleteUser = async () => {
    if (!isConfirmationValid) {
      toast.error("Please type the confirmation text exactly as shown");
      return;
    }

    try {
      setIsLoading(true);

      await deleteUser(user.id);

      toast.success(`User "${user.name}" deleted successfully!`);
      onSuccess?.();
      onOpenChange(false);

      // Reset form
      setConfirmationText("");
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete User
          </DialogTitle>
          <DialogDescription>
            Permanently delete {user.name} ({user.email}) from the system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-red-800">Permanent Action</h4>
                <p className="text-sm text-red-700">
                  This action cannot be undone. This will permanently delete the
                  user account and remove all associated data from the system.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">
                {expectedText}
              </code>{" "}
              to confirm:
            </Label>
            <Input
              id="confirmation"
              placeholder={expectedText}
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              disabled={isLoading}
              className={
                confirmationText && !isConfirmationValid
                  ? "border-red-300 focus:border-red-500"
                  : ""
              }
            />
            {confirmationText && !isConfirmationValid && (
              <p className="text-sm text-red-600">
                Confirmation text doesn't match
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setConfirmationText("");
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteUser}
            loading={isLoading}
            disabled={!isConfirmationValid}
          >
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
