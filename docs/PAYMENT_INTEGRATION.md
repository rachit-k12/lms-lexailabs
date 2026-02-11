# Payment Integration Guide

Complete guide for the frontend team to integrate Razorpay payments into the LMS platform.

## 1. Overview

The platform uses a **one-time payment model**: users pay once and unlock access to **all published courses**.

### Payment Flow

```
1. Frontend calls GET /payments/status to check current access
2. If no access, user clicks "Upgrade to Premium"
3. Frontend calls POST /payments/create-order
4. Backend creates a Razorpay order and returns orderId + keyId
5. Frontend opens the Razorpay Checkout widget with order details
6. User completes payment on Razorpay's UI
7. Razorpay returns payment details to the frontend handler callback
8. Frontend calls POST /payments/verify with the Razorpay response
9. Backend verifies signature, grants premium access, enrolls in all courses
10. Frontend refreshes UI to show premium access
```

There is also a **webhook safety net** (Step 10b): Razorpay sends a `payment.captured` event to the backend directly. If the frontend verify call fails (e.g., network error), the webhook will still grant access.

## 2. Prerequisites

### Razorpay Checkout Script

Add to your HTML `<head>`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Or load dynamically before opening checkout.

### Authentication

All API calls require cookie-based authentication. Use `credentials: "include"` on all fetch requests:

```typescript
fetch("/api/payments/status", {
  credentials: "include",
});
```

## 3. API Reference

### GET /payments/status

Check the user's current access status. Call this on page load to determine whether to show payment UI.

**Auth required:** Yes (cookie)

**Response 200:**

```typescript
interface PaymentStatus {
  hasAccess: boolean;
  accessType: "premium" | "institution" | null;
  isPremium: boolean;
  organization: string | null;
  latestPayment: {
    status: "created" | "paid" | "failed";
    amount: number; // in paise (49900 = Rs.499)
    createdAt: string; // ISO 8601
  } | null;
}
```

**Response 401:** Not authenticated.

---

### POST /payments/create-order

Initiate a new payment. Creates a Razorpay order on the backend.

**Auth required:** Yes (cookie)

**Request body:** None

**Response 200:**

```typescript
interface CreateOrderResponse {
  orderId: string;   // Razorpay order ID (e.g., "order_N1...")
  amount: number;    // in paise
  currency: "INR";
  keyId: string;     // Razorpay public key for Checkout widget
}
```

**Response 400:**

```typescript
interface CreateOrderError {
  error: "You already have premium access"
       | "You already have access through your institution";
}
```

**Response 401:** Not authenticated.

---

### POST /payments/verify

Verify the payment after Razorpay Checkout completes. On success, the user is granted premium access and enrolled in all published courses.

**Auth required:** Yes (cookie)

**Request body:**

```typescript
interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
```

These three fields come directly from the Razorpay Checkout `handler` callback.

**Response 200:**

```typescript
interface VerifyPaymentResponse {
  success: true;
  message: "Payment verified and access granted" | "Payment already verified";
}
```

**Response 400:**

```typescript
interface VerifyPaymentError {
  error: "Payment verification failed";
}
```

**Response 404:**

```typescript
interface PaymentNotFound {
  error: "Payment not found";
}
```

**Response 401:** Not authenticated.

## 4. Complete Integration Code

### `usePaymentStatus` Hook

```tsx
import { useState, useEffect } from "react";

interface PaymentStatus {
  hasAccess: boolean;
  accessType: "premium" | "institution" | null;
  isPremium: boolean;
  organization: string | null;
  latestPayment: {
    status: string;
    amount: number;
    createdAt: string;
  } | null;
}

export function usePaymentStatus() {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments/status", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch payment status");
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return { status, loading, error, refetch: fetchStatus };
}
```

### `useInitiatePayment` Hook

```tsx
import { useState, useCallback } from "react";

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

        // Step 2: Open Razorpay Checkout
        const razorpayResponse = await new Promise<{
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        } | null>((resolve) => {
          const options: Record<string, unknown> = {
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
            handler: (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              resolve(response);
            },
            modal: {
              ondismiss: () => {
                resolve(null);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        });

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
```

### `PaymentButton` Component

```tsx
import React from "react";
import { usePaymentStatus } from "./usePaymentStatus";
import { useInitiatePayment } from "./useInitiatePayment";

interface PaymentButtonProps {
  userEmail?: string;
  userName?: string;
}

export function PaymentButton({ userEmail, userName }: PaymentButtonProps) {
  const { status, loading: statusLoading, refetch } = usePaymentStatus();
  const { initiatePayment, loading: paymentLoading } = useInitiatePayment();

  if (statusLoading) return <div>Loading...</div>;

  // Already has access
  if (status?.hasAccess) {
    if (status.accessType === "premium") {
      return <span className="badge badge-success">Premium Active</span>;
    }
    if (status.accessType === "institution") {
      return (
        <span className="badge badge-info">
          Provided by {status.organization}
        </span>
      );
    }
  }

  // Determine button label
  let label = "Upgrade to Premium — ₹499";
  if (status?.latestPayment?.status === "created") {
    label = "Complete Payment";
  } else if (status?.latestPayment?.status === "failed") {
    label = "Payment Failed — Try Again";
  }

  const handleClick = async () => {
    const result = await initiatePayment(userEmail, userName);
    if (result.success) {
      await refetch(); // Refresh access status
    } else if (result.error === "Payment cancelled") {
      // User dismissed — no action needed
    } else {
      // Show error to user (toast, alert, etc.)
      alert(result.error || "Something went wrong");
    }
  };

  return (
    <button onClick={handleClick} disabled={paymentLoading}>
      {paymentLoading ? "Processing..." : label}
    </button>
  );
}
```

## 5. Razorpay Checkout Options

Full options reference for the `Razorpay` constructor:

| Option | Type | Description |
|--------|------|-------------|
| `key` | string | Razorpay public key. Use `keyId` from `create-order` response. |
| `amount` | number | Amount in paise. From `create-order` response. |
| `currency` | string | Currency code. From `create-order` response (`"INR"`). |
| `order_id` | string | Razorpay order ID. From `create-order` response (`orderId`). |
| `name` | string | Business/app name displayed in checkout. |
| `description` | string | Purchase description shown to user. |
| `image` | string | Logo URL displayed in checkout widget. |
| `prefill.email` | string | Pre-fill user's email in checkout form. |
| `prefill.name` | string | Pre-fill user's name in checkout form. |
| `prefill.contact` | string | Pre-fill phone number (optional). |
| `theme.color` | string | Brand color for checkout widget (hex). |
| `handler` | function | **Required.** Success callback. Receives `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`. |
| `modal.ondismiss` | function | Called when user closes checkout without paying. |
| `notes` | object | Custom key-value pairs (passed through to Razorpay dashboard). |

## 6. UI Decision Tree

Use the response from `GET /payments/status` to determine what to display:

```
GET /payments/status
  |
  |-- hasAccess: true, accessType: "premium"
  |     -> Show "Premium Active" badge
  |
  |-- hasAccess: true, accessType: "institution"
  |     -> Show "Provided by [organization name]"
  |
  |-- hasAccess: false, latestPayment.status: "created"
  |     -> Show "Complete Payment" button (retry flow)
  |
  |-- hasAccess: false, latestPayment.status: "failed"
  |     -> Show "Payment Failed — Try Again" button
  |
  |-- hasAccess: false, latestPayment: null
        -> Show "Upgrade to Premium — ₹499" button
```

## 7. Error Handling Reference

| Error Message | HTTP Code | Source Endpoint | Frontend Action |
|---------------|-----------|-----------------|-----------------|
| `"You already have premium access"` | 400 | POST /payments/create-order | Refresh status, show premium badge |
| `"You already have access through your institution"` | 400 | POST /payments/create-order | Refresh status, show institution badge |
| `"Payment verification failed"` | 400 | POST /payments/verify | Show "Verification failed, contact support" |
| `"Payment not found"` | 404 | POST /payments/verify | Show "Something went wrong, contact support" |
| `"Unauthorized"` | 401 | Any | Redirect to login |
| `"Payment required to access courses"` | 403 | POST /user/enrollments/:courseId | Show upgrade/payment CTA |

## 8. Webhook Safety Net

If the `POST /payments/verify` call fails due to a network error (user's connection dropped after Razorpay checkout completed), the payment is **not lost**. Razorpay independently sends a `payment.captured` webhook to the backend, which:

1. Verifies the webhook signature
2. Updates the Payment record to `"paid"`
3. Sets `user.isPremium = true`
4. Enrolls the user in all published courses

**Frontend fallback strategy:** If the verify call fails or times out, poll `GET /payments/status` every few seconds for up to 30 seconds. The webhook typically arrives within a few seconds, so the status will update shortly.

```typescript
async function pollForAccess(maxAttempts = 10, intervalMs = 3000): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch("/api/payments/status", { credentials: "include" });
    const data = await res.json();
    if (data.hasAccess) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}
```
