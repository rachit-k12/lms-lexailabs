"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Text, Button } from "@/components";
import { useAuth } from "@/lib/contexts/auth-context";
import { getGoogleLoginUrl, getErrorMessage } from "@/lib/api";
import { toast } from "sonner";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(true);
      toast.success(response.message || "Account created! Please check your email to verify.");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = getGoogleLoginUrl();
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="size-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <Text variant="heading-lg" className="mb-3">
            Check your email
          </Text>
          <Text variant="body-md" tone="secondary" className="mb-8">
            We&apos;ve sent a verification link to <strong>{formData.email}</strong>.
            Click the link in the email to verify your account.
          </Text>
          <Link href="/login">
            <Button variant="primary" size="lg">
              Go to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Form (50%) - Scrollable */}
      <div className="w-full overflow-y-auto lg:w-1/2">
        <div className="flex min-h-full flex-col justify-center px-8 py-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-md">
            {/* Logo */}
            <Link href="/" className="mb-10 inline-block">
              <div className="flex items-center gap-3">
                <Image
                  src="/lexai-logo.png"
                  alt="LexAI Labs"
                  width={40}
                  height={40}
                  className="size-10"
                />
                <span className="text-xl font-semibold text-gray-900">Lex AI</span>
              </div>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <Text variant="heading-lg" className="mb-2">
                Create your account
              </Text>
              <Text variant="body-md" tone="secondary">
                Start your AI learning journey today
              </Text>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignup}
              className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-400">or sign up with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-lms-primary-500 focus:outline-none focus:ring-1 focus:ring-lms-primary-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-lms-primary-500 focus:outline-none focus:ring-1 focus:ring-lms-primary-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-lms-primary-500 focus:outline-none focus:ring-1 focus:ring-lms-primary-500"
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  width="full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>

              <p className="text-center text-xs text-gray-400">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-lms-primary-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-lms-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>

            {/* Sign in link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-lms-primary-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image (50%) - Fixed */}
      <div className="relative hidden h-full lg:block lg:w-1/2">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-lms-primary-50" />

        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-section-bg.png"
            alt=""
            fill
            className="object-cover opacity-30"
          />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          {/* Tagline at top */}
          <div className="mb-8 text-center">
            <Text variant="heading-md" className="text-gray-800 mb-2">
              Master AI Skills
            </Text>
            <Text variant="body-md" tone="secondary">
              Join 10,000+ professionals learning with LexAI Labs
            </Text>
          </div>

          {/* Course preview image */}
          <div className="relative max-w-lg w-full">
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-lms-primary-200/40 via-purple-100/30 to-lms-coral-200/40 blur-2xl" />

            {/* Image container */}
            <div className="relative rounded-2xl bg-white/90 p-2 shadow-2xl backdrop-blur-sm border border-white/50">
              <div className="overflow-hidden rounded-xl">
                <Image
                  src="/course-page-image.png"
                  alt="LexAI Labs Platform"
                  width={600}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
