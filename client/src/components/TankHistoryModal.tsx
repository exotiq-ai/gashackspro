import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface TankHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadHistory?: (history: any) => void;
}

export function TankHistoryModal({
  open,
  onOpenChange,
  onLoadHistory,
}: TankHistoryModalProps) {
  const { data: history, isLoading, refetch } = trpc.tankHistory.list.useQuery(undefined, {
    enabled: open,
  });

  const deleteMutation = trpc.tankHistory.delete.useMutation({
    onSuccess: () => {
      toast.success("History deleted");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete: " + error.message);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Delete this history entry?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleLoad = (entry: any) => {
    if (onLoadHistory) {
      // Convert stored integers back to decimals
      onLoadHistory({
        tankSize: entry.tankSize / 10,
        currentTankLevel: entry.currentTankLevel / 10,
        currentEmix: entry.currentEmix / 10,
        targetEmix: entry.targetEmix / 10,
        pumpGasEthanol: entry.pumpGasEthanol / 10,
        pumpGasOctane: entry.pumpGasOctane,
        ethanolFuelPercent: entry.ethanolFuelPercent / 10,
        ethanolFuelOctane: entry.ethanolFuelOctane,
        vehicleMake: entry.vehicleMake,
        vehicleModel: entry.vehicleModel,
      });
      onOpenChange(false);
      toast.success("History loaded");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Tank History</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Your saved fuel blend calculations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && (!history || history.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No saved history yet</p>
              <p className="text-sm mt-2">
                Save your current calculation to see it here
              </p>
            </div>
          )}

          {history?.map((entry) => (
            <div
              key={entry.id}
              className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {entry.vehicleMake && entry.vehicleModel && (
                      <span className="font-semibold text-sm">
                        {entry.vehicleMake} {entry.vehicleModel}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tank:</span>{" "}
                      <span className="font-medium">
                        {(entry.tankSize / 10).toFixed(1)} gal
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current:</span>{" "}
                      <span className="font-medium">
                        E{entry.currentEmix / 10}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target:</span>{" "}
                      <span className="font-medium">
                        E{entry.targetEmix / 10}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Result:</span>{" "}
                      <span className="font-medium text-orange-500">
                        {(entry.resultingMix / 10).toFixed(1)}% @{" "}
                        {(entry.resultingOctane / 10).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Add:</span>{" "}
                    <span className="font-medium text-orange-500">
                      {(entry.ethanolToAdd / 100).toFixed(2)} gal ethanol
                    </span>
                    {" + "}
                    <span className="font-medium">
                      {(entry.pumpGasToAdd / 100).toFixed(2)} gal pump gas
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoad(entry)}
                  >
                    Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

