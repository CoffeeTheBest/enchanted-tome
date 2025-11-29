import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmailPasswordAuth } from "@/components/EmailPasswordAuth";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { BookOpen } from "lucide-react";

export function AuthModal({ isOpen, onClose }) {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose(); // Close modal on successful sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error);
      // Optionally show a toast notification for the error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Enter the Tome</DialogTitle>
          <DialogDescription className="font-serif">
            Sign in or create an account to unlock hidden chapters.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <EmailPasswordAuth />
          <div className="relative w-full text-center">
            <span className="inline-block px-2 bg-background text-muted-foreground text-sm">
              OR
            </span>
            <div className="absolute inset-y-1/2 left-0 right-0 -z-10 border-t border-border" />
          </div>
          <Button onClick={handleGoogleSignIn} size="lg" className="font-serif gap-2 text-lg px-8 w-full">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
            Sign Up with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
