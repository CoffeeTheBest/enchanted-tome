import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export function EmailPasswordAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (isSignUp) => {
    setIsSigningUp(isSignUp);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Sign Up Successful",
          description: "Your account has been created. You are now logged in!",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Sign In Successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      console.error("Authentication Error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => handleAuth(true)}
          disabled={isSigningUp}
          className="flex-1"
        >
          {isSigningUp ? "Signing Up..." : "Sign Up"}
        </Button>
        <Button
          onClick={() => handleAuth(false)}
          disabled={isSigningUp}
          variant="outline"
          className="flex-1"
        >
          {isSigningUp ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </div>
  );
}
