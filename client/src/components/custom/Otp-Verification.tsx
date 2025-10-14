// import type React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

interface OtpVerificationProps {
  email?: string;
  title?: string;
  description?: ReactNode;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  serverError?: string;
  isLoading?: boolean;
  otpLength?: number;
}

export function OtpVerification({
  email,
  title = "Check your email",
  description,
  onVerify,
  onResend,
  serverError = "",
  isLoading = false,
  otpLength = 6,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== otpLength) return;

    setIsVerifying(true);
    setError("");

    try {
      await onVerify(otp);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError("");

    try {
      await onResend();
      setOtp(""); // Clear OTP on resend
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend code. Please try again.";
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (error) {
      setError("");
    }
  };

  const defaultDescription = (
    <>
      We sent a verification code to
      <br />
      <span className="font-medium text-slate-900">{email ?? ""}</span>
    </>
  );

  return (
    <Card className="border-0 shadow-none bg-white">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <Mail className="w-5 h-5 text-slate-600" />
        </div>
        <CardTitle className="text-lg font-semibold text-slate-900">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-500">
          {description || defaultDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          {serverError && (
            <div className="shrink-0 flex w-8/12 mb-8 mx-auto items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className=" w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="shrink-0 text-sm text-red-600">{serverError}</p>
            </div>
          )}
          <div className="flex justify-center">
            <InputOTP
              maxLength={otpLength}
              value={otp}
              onChange={handleOtpChange}
              className="text-slate-800 dark:text-slate-800"
              containerClassName="gap-3"
            >
              {Array.from({ length: otpLength }).map((_, index) => (
                <InputOTPGroup className="gap-3" key={index}>
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="size-12 border-slate-700 text-slate-800 dark:text-slate-800 [&_.animate-caret-blink]:!bg-slate-800 dark:[&_.animate-caret-blink]:!bg-slate-800"
                  />
                </InputOTPGroup>
              ))}
            </InputOTP>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-black hover:bg-slate-800 mt-3 text-white"
            disabled={isLoading || isVerifying || otp.length !== otpLength}
          >
            {isVerifying ? "Verifying..." : "Verify email"}
          </Button>

          <div className="text-center text-slate-600">
            {isResending ? "Sending..." : "Didn't receive the code?"}
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOtp}
              disabled={isLoading || isVerifying || isResending}
              className="text-sm text-blue-500 cursor-pointer hover:bg-transparent focus-visible:bg-transparent"
            >
              Resend
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
