import { DotBackground } from "@/components/custom/DotBackground";
import React from "react";
import Logo from "@/assets/logo.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/validations";
import InputError from "@/components/custom/InputError";
import { AlertCircle, ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { ResetPasswordSent } from "@/components/custom/ResetPasswordSent";
import type { z } from "zod";

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [status, setStatus] = React.useState<"idle" | "success">("idle");
  const { SendResetLink, error: ServerError, isLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordData) => {
    const res = await SendResetLink(data);
    if (res?.success) {
      setStatus("success");
    }
  };

  const ResendLink = async () => {
    const email = getValues("email");
    const res = await SendResetLink({ email });
    if (res?.success) {
      setStatus("success");
    }
  };

  const email = getValues("email");

  return (
    <DotBackground
      className={" h-screen w-screen flex  items-center justify-center "}
    >
      <div className="flex flex-col items-center justify-center lg:py-0 py-10 col-span-3 bg-white/60 rounded-full ">
        {status === "idle" && (
          <>
            <div className="mx-auto grid lg:w-[420px] w-[360px] px-2 gap-8 mb-6">
              <div className="grid gap-4 text-center mb-4">
                <div className="flex items-center justify-center gap-2">
                  <img src={Logo} alt="logo" />
                  <h1 className="text-2xl">Viby Chat</h1>
                </div>
                <p className="text-balance text-blue-500 leading-none">
                  Enter your email and we'll send you a reset link
                </p>
              </div>
              <form
                className="grid gap-4"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                {ServerError && (
                  <div className="shrink-0 flex w-10/12 mb-8 mx-auto items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className=" w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="shrink-0 text-sm text-red-600">
                      {ServerError}
                    </p>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className={` h-12 bg-white focus-visible:ring-0  ${
                      errors.email
                        ? " border-red-500 bg-red-50 focus-visible:ring-red-500/40 "
                        : "border-slate-600"
                    }`}
                    autoComplete="username"
                    required
                    {...register("email")}
                  />
                  {errors.email && (
                    <InputError message={errors.email.message} />
                  )}
                </div>

                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full h-11 flex items-center justify-center gap-2 mt-6 cursor-pointer bg-black active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4" />
                      <span className="loader">Sending</span>
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </div>
            <div className="mt-8 text-center flex items-center justify-center gap-2">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium transition-colors"
                // disabled={}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </button>
            </div>
          </>
        )}
        {status === "success" && (
          <div className="w-full mx-auto text-center flex items-center justify-center">
            <ResetPasswordSent
              onBackToLogin={() => navigate("/auth/login", { replace: true })}
              email={email}
              onResend={ResendLink}
              isResending={isLoading}
            />
          </div>
        )}
      </div>
    </DotBackground>
  );
};

export default ForgotPassword;
