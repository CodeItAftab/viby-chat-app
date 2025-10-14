import React, { useEffect } from "react";
import { DotBackground } from "@/components/custom/DotBackground";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/validations";
import { useNavigate, useParams } from "react-router-dom";
import { GET } from "@/lib/axios";
import InvalidTokenMessage from "@/components/custom/InvalidTokenMessage";
import type { z } from "zod";

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

interface TokenValidationResponse {
  success: boolean;
  email: string;
}

const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");
  const [tokenValid, setTokenValid] = React.useState(true);
  const [email, setEmail] = React.useState("");

  const { reset_token: token } = useParams<{ reset_token: string }>();
  const navigate = useNavigate();

  const { ResetPassword, error: ServerError, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = (await GET(
          `/auth/validate-token/${token}`
        )) as TokenValidationResponse;
        if (res.success) {
          setTokenValid(true);
          setEmail(res.email);
        }
      } catch (error) {
        console.log(error);
        setTokenValid(false);
        setSubmitStatus("error");
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    strength = Object.values(checks).filter(Boolean).length;
    if (strength <= 2)
      return { strength, label: "Weak", color: "text-red-500" };
    if (strength <= 3)
      return { strength, label: "Fair", color: "text-yellow-500" };
    if (strength <= 4)
      return { strength, label: "Good", color: "text-blue-500" };
    return { strength, label: "Strong", color: "text-green-500" };
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const passwordStrength = getPasswordStrength(password);

  const handleFormSubmit = async (data: ResetPasswordData) => {
    if (!token) return;
    const res = await ResetPassword(token, data);
    if (res?.success) {
      setSubmitStatus("success");
      reset({ password: "", confirmPassword: "" });
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 5000);
    }
  };

  if (ServerError) {
    setSubmitStatus("error");
  }

  if (!tokenValid) {
    return <InvalidTokenMessage />;
  }

  return (
    <DotBackground
      className={" h-screen w-screen flex  items-center justify-center "}
    >
      <div className="flex flex-col items-center sm:w-[480px] w-screen  justify-center lg:py-0 py-10 col-span-3 bg-white/50 rounded-4xl ">
        <Card
          className={cn(
            "w-full mx-auto shadow-none rounded-4xl bg-white/50 border-none"
          )}
        >
          <CardHeader className="text-center w-full">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <KeyRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              Create a new secure password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className={"w-full"}>
            {submitStatus === "success" && (
              <div className="mb-6 rounded-lg  bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Password Reset Successful
                    </h3>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Your password has been updated. Redirecting to login...
                    </p>
                  </div>
                </div>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Password Reset Failed
                    </h3>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                      The reset link may have expired. Please request a new one.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4 w-full"
            >
              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  value={email || ""}
                  autoComplete="username"
                  tabIndex={-1}
                  readOnly
                  className="sr-only" // or use your own visually-hidden class
                />
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    autoComplete="new-password"
                    id="password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    className={cn(
                      "h-11 pr-10 border-gray-200 dark:border-gray-800 focus:border-gray-900 dark:focus:border-gray-100",
                      errors.password && "border-red-500 focus:border-red-500"
                    )}
                    disabled={isLoading}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {password && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Password strength
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          passwordStrength.color
                        )}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          passwordStrength.strength <= 2 && "bg-red-500",
                          passwordStrength.strength === 3 && "bg-yellow-500",
                          passwordStrength.strength === 4 && "bg-blue-500",
                          passwordStrength.strength === 5 && "bg-green-500"
                        )}
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    autoComplete="new-password"
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    className={cn(
                      "h-11 pr-10 border-gray-200 dark:border-gray-800 focus:border-gray-900 dark:focus:border-gray-100",
                      errors.confirmPassword &&
                        "border-red-500 focus:border-red-500"
                    )}
                    disabled={isLoading}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
                {password && confirmPassword && (
                  <div className="flex items-center mt-2">
                    {password === confirmPassword ? (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        <span className="text-xs">Passwords match</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        <span className="text-xs">Passwords do not match</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-medium transition-colors"
                disabled={isLoading || !isValid || submitStatus === "success"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Password updated
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button
                // onClick={onBackToLogin}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium transition-colors"
                // disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DotBackground>
  );
};

export default ResetPassword;
