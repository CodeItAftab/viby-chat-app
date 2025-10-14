import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ResetPasswordSentProps {
  email: string;
  onBackToLogin: () => void;
  onResend: () => Promise<void>;
  isResending: boolean;
}

export function ResetPasswordSent({
  email,
  onBackToLogin,
  onResend,
  isResending,
}: ResetPasswordSentProps) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const time = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(time);
    }
  }, [countdown]);

  return (
    <div className=" w-[320px] mx-4 sm:w-[400px] sm:mx-auto text-center bg-white/60 rounded-4xl ">
      <div className="mb-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-8 w-8 text-green-700 dark:text-green-700" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Check your email
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          We sent a password reset link to
          <br />
          <span className="font-medium text-gray-900 dark:text-white">
            {email}
          </span>
        </p>
      </div>

      <div className="space-y-4 w-full">
        <div className="rounded-lg bg-gray-100 dark:bg-gray-900/50 p-4 py-8 text-left">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
            What's next?
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• &nbsp; Check your email inbox</li>
            <li>• &nbsp; Click the reset link in the email</li>
            <li>• &nbsp; Create a new password</li>
            <li>• &nbsp; Sign in with your new password</li>
          </ul>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the email?{" "}
            {countdown > 0 ? (
              <span className="text-gray-500 dark:text-gray-500">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                onClick={async () => {
                  await onResend();
                  setCountdown(30);
                }}
                disabled={isResending}
                className="font-medium text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend"}
              </button>
            )}
          </p>

          <Button
            onClick={onBackToLogin}
            disabled={isResending}
            variant="outline"
            className="w-full h-11 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
