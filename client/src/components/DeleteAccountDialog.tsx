import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

interface DeleteAccountDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function DeleteAccountDialog({ open: controlledOpen, onOpenChange }: DeleteAccountDialogProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [confirmText, setConfirmText] = useState("");
  const { logout } = useAuth();
  
  const deleteAccountMutation = trpc.auth.deleteAccount.useMutation({
    onSuccess: () => {
      toast.success("Account deleted successfully");
      logout();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete account: ${error.message}`);
    },
  });

  const handleDelete = () => {
    if (confirmText.toLowerCase() === "delete") {
      deleteAccountMutation.mutate();
    } else {
      toast.error('Please type "DELETE" to confirm');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-zinc-900 to-zinc-950 border-red-500/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Delete Account
            </DialogTitle>
          </div>
          <DialogDescription className="text-zinc-300 space-y-3 text-left pt-4">
            <p className="font-semibold text-red-400">
              This action cannot be undone!
            </p>
            
            <p>
              Deleting your account will permanently remove:
            </p>

            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400 ml-2">
              <li>Your profile information (email, name)</li>
              <li>All saved tank history</li>
              <li>Vehicle preferences and settings</li>
              <li>Cost calculator data</li>
            </ul>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 my-3">
              <p className="text-sm text-zinc-300">
                Your data will be permanently deleted from our servers within 30 days.
              </p>
            </div>

            <div className="pt-2">
              <label className="text-sm text-zinc-400 block mb-2">
                Type <span className="font-bold text-white">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                placeholder="DELETE"
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={confirmText.toLowerCase() !== "delete" || deleteAccountMutation.isPending}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

