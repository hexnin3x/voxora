"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/dashboards");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MagneticCursor magneticFactor={0.3} cursorSize={28} blendMode="exclusion">
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-clip max-w-[100vw]">
        {/* Background glow */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(115,115,115,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-xs space-y-6 relative z-10">
          <div className="space-y-2 text-center">
            <Link href="/" className="inline-flex items-center gap-2.5 no-underline mb-4">
              <Image src="/logo.svg" alt="Voxora" width={48} height={48} className="mx-auto" />
              <span className="text-2xl font-bold text-foreground">Voxora</span>
            </Link>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">Admin Login</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your administrative dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Input
                    id="email"
                    className="peer ps-9 bg-muted border border-border text-foreground rounded-lg py-3 focus-visible:border-ring w-full"
                    placeholder="Enter your email/username"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Mail size={16} aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    className="ps-9 pe-9 bg-muted border border-border text-foreground rounded-lg py-3 focus-visible:border-ring w-full"
                    placeholder="Enter your password"
                    type={isVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Lock size={16} aria-hidden="true" />
                  </div>
                  <button
                    className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-colors outline-none cursor-pointer"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {isVisible ? (
                      <EyeOff size={16} aria-hidden="true" />
                    ) : (
                      <Eye size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember-me" className="text-xs text-muted-foreground cursor-pointer">
                  Remember for 30 days
                </Label>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/25 rounded-lg px-3.5 py-2.5 text-[13px] text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full justify-center gap-2 mt-2">
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </MagneticCursor>
  );
}
