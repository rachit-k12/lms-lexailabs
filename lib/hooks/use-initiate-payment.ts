"use client";

import { useState, useCallback } from "react";
import { pollForAccess } from "./use-payment-status";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill?: {
    email?: string;
    name?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  notes?: Record<string, string>;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PaymentResult {
  success: boolean;
  message?: string;
  error?: string;
}

export function useInitiatePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(
    async (userEmail?: string, userName?: string): Promise<PaymentResult> => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Create order
        const orderRes = await fetch("/api/payments/create-order", {
          method: "POST",
          credentials: "include",
        });

        if (!orderRes.ok) {
          const err = await orderRes.json();
          setError(err.error);
          return { success: false, error: err.error };
        }

        const { orderId, amount, currency, keyId } = await orderRes.json();

        // Ensure Razorpay is loaded
        if (!window.Razorpay) {
          setError("Payment system not loaded. Please refresh the page.");
          return {
            success: false,
            error: "Payment system not loaded. Please refresh the page.",
          };
        }

        // Step 2: Open Razorpay Checkout
        const razorpayResponse = await new Promise<RazorpayResponse | null>(
          (resolve) => {
            const options: RazorpayOptions = {
              key: keyId,
              amount,
              currency,
              order_id: orderId,
              name: "LexAI LMS",
              description: "Premium Access — All Courses",
              prefill: {
                email: userEmail || "",
                name: userName || "",
              },
              theme: {
                color: "#6366f1",
              },
              handler: (response: RazorpayResponse) => {
                resolve(response);
              },
              modal: {
                ondismiss: () => {
                  resolve(null);
                },
              },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
          }
        );

        // User closed the checkout without paying
        if (!razorpayResponse) {
          setLoading(false);
          return { success: false, error: "Payment cancelled" };
        }

        // Step 3: Verify payment
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(razorpayResponse),
        });

        if (!verifyRes.ok) {
          // Verification failed, but payment might still go through via webhook
          // Poll for access as a fallback
          const hasAccess = await pollForAccess(10, 3000);
          if (hasAccess) {
            return {
              success: true,
              message: "Payment verified via webhook",
            };
          }

          const err = await verifyRes.json();
          setError(err.error);
          return { success: false, error: err.error };
        }

        const result = await verifyRes.json();
        return { success: true, message: result.message };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Payment failed";
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { initiatePayment, loading, error };
}
