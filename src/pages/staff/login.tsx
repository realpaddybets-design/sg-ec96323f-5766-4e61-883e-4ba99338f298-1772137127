import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Email:", email);
    
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      console.log("=== SIGN IN RESPONSE ===");
      console.log("Data:", data);
      console.log("Error:", signInError);

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        console.log("✅ Login successful, user:", data.user.email);
        console.log("Redirecting to dashboard with hard navigation...");
        
        // Use window.location for a hard redirect
        window.location.href = "/staff/dashboard";
      } else {
        console.warn("⚠️ No user returned");
        setError("Login failed - no user data returned");
        setLoading(false);
      }
    } catch (err) {
      console.error("=== UNEXPECTED ERROR ===");
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Staff Login - Kelly's Angels Inc."
        description="Staff login portal for Kelly's Angels Inc."
      />
      
      <Navigation />
      
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Staff Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the staff dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@kellysangelsinc.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-4 text-xs text-center text-muted-foreground">
              <p>For staff access only. Contact admin if you need credentials.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}