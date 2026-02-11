"use client";

import { useState, useEffect, useCallback } from "react";

interface PaymentStatus {
  hasAccess: boolean;
  accessType: "premium" | "institution" | null;
  isPremium: boolean;
  organization: string | null;
  latestPayment: {
    status: "created" | "paid" | "failed";
    amount: number;
    createdAt: string;
  } | null;
}

export function usePaymentStatus() {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments/status", {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Not authenticated");
        }
        throw new Error("Failed to fetch payment status");
      }
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { status, loading, error, refetch: fetchStatus };
}

// Polling function for webhook fallback
export async function pollForAccess(
  maxAttempts = 10,
  intervalMs = 3000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch("/api/payments/status", { credentials: "include" });
    const data = await res.json();
    if (data.hasAccess) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}
