import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { ArrowLeft, User, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to access settings.
          </p>
          <Button onClick={() => setLocation("/")}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="min-h-[44px] min-w-[44px] touch-manipulation"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src="/gas-hacks-icon.png" alt="Gas Hacks" className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Settings
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-2xl">
        {/* User Profile */}
        <Card className="p-6 mb-6 glass-card animate-entrance">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Account Management */}
        <Card className="p-6 glass-card animate-entrance animation-delay-1">
          <h3 className="text-lg font-semibold mb-4">Account Management</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Tank History</h4>
              <p className="text-sm text-muted-foreground mb-3">
                View and manage your saved fuel calculations
              </p>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="min-h-[44px] touch-manipulation"
              >
                View History
              </Button>
            </div>

            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="min-h-[44px] touch-manipulation"
                  >
                    Delete My Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Legal Documents */}
        <Card className="p-6 mt-6 glass-card animate-entrance animation-delay-2">
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start min-h-[44px] touch-manipulation"
              onClick={() => window.open("/PRIVACY_POLICY.md", "_blank")}
            >
              Privacy Policy
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start min-h-[44px] touch-manipulation"
              onClick={() => window.open("/TERMS_OF_SERVICE.md", "_blank")}
            >
              Terms of Service
            </Button>
          </div>
        </Card>
      </main>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  );
}

