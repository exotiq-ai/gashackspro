import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function SafetyDisclaimer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the disclaimer
    const hasSeenDisclaimer = localStorage.getItem("gas-hacks-disclaimer-seen");
    if (!hasSeenDisclaimer) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("gas-hacks-disclaimer-seen", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-zinc-900 to-zinc-950 border-orange-500/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Important Safety Notice
            </DialogTitle>
          </div>
          <DialogDescription className="text-zinc-300 space-y-3 text-left pt-4">
            <p className="font-semibold text-white">
              Gas Hacks is for informational purposes only.
            </p>
            
            <p>
              The fuel blend calculations provided by this app are <strong>estimates</strong> and should not be considered professional automotive advice.
            </p>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 my-3">
              <p className="font-semibold text-orange-400 mb-2">⚠️ Before modifying your vehicle:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-zinc-300">
                <li>Consult with a qualified automotive professional or tuner</li>
                <li>Understand the risks of alternative fuel blends</li>
                <li>Check your vehicle warranty terms</li>
                <li>Ensure your fuel system can handle ethanol</li>
              </ul>
            </div>

            <p className="text-sm text-zinc-400">
              <strong>Improper fuel blending can cause:</strong> Engine damage, reduced performance, warranty voidance, emissions violations, and safety hazards.
            </p>

            <p className="text-sm text-zinc-400">
              Exotiq Inc. is not responsible for any damage to vehicles or injury resulting from use of this app. You assume all risks.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleAccept}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold"
          >
            I Understand and Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

