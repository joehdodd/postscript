"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "@/app/actions/auth";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await signupUser(email);
    if (result.success) {
      setStatus("Check your email for the magic link to complete signup!");
    } else {
      setStatus(result.error || "Failed to create account.");
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-lg shadow-lg bg-ps-card">
      <h2 className="text-2xl font-bold text-ps-primary mb-2 text-center">
        Get Started
      </h2>
      <p className="text-sm text-ps-text-secondary text-center mb-6">
        Enter your email to create your account
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="email" className="text-ps-text font-medium">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 rounded border border-ps-border bg-ps-input text-ps-text focus:outline-none focus:ring-2 focus:ring-ps-primary transition-colors"
          placeholder="you@example.com"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-ps-primary text-ps-secondary font-semibold py-2 rounded hover:bg-ps-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        {status && (
          <div className="text-center text-ps-success mt-2">{status}</div>
        )}
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-ps-text-secondary hover:text-ps-primary transition-colors"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}
