"use client";
import { useState } from "react";
import { sendMagicLink } from "@/app/actions/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await sendMagicLink(email);
    if (result.success) {
      setStatus("Check your email for the magic link!");
    } else {
      setStatus(result.error || "Failed to send magic link.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label htmlFor="email" className="text-ps-text font-medium">
        Email Address
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="px-4 py-2 rounded border border-ps-border bg-ps-input text-ps-text focus:outline-none focus:ring-2 focus:ring-ps-primary transition-colors"
        placeholder="you@example.com"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-ps-primary text-ps-secondary font-semibold py-2 rounded hover:bg-ps-primary-dark transition-colors disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Magic Link"}
      </button>
      {status && (
        <div className="text-center text-ps-success mt-2">{status}</div>
      )}
    </form>
  );
}
