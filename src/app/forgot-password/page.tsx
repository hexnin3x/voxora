"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message || "A recovery link has been generated and logged.");
      } else {
        setError(data.message || "Something went wrong. Please check your email and try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MagneticCursor magneticFactor={0.3} cursorSize={28} blendMode="exclusion">
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-clip max-w-[100vw]">
        {/* Background glow */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(115,115,115,0.12)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10">
          {/* Logo */}
          <div className="text-center mb-8 sm:mb-10">
            <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
              <Image src="/logo.svg" alt="Voxora" width={28} height={28} />
              <span className="text-xl font-semibold text-foreground">Voxora</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-xl">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Reset Password
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-8">
              Enter your email and we will send you a password recovery link.
            </p>

            <form onSubmit={handleRequestReset} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none transition-colors duration-200 focus:border-ring font-sans w-full"
                />
              </div>

              {/* Error Info */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/25 rounded-lg px-3.5 py-2.5 text-[13px] text-destructive">
                  {error}
                </div>
              )}

              {/* Success Info */}
              {message && (
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3.5 py-2.5 text-[13px] text-emerald-400">
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                id="forgot-submit"
                type="submit"
                disabled={loading}
                className={`border-none rounded-lg px-6 py-3.5 text-sm font-semibold cursor-pointer transition-opacity duration-200 font-sans tracking-wide ${
                  loading
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {loading ? "Sending link…" : "Send Reset Link"}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-foreground font-medium no-underline hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </MagneticCursor>
  );
}
