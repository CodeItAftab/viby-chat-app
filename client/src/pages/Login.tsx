import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.svg";
import InputError from "@/components/custom/InputError";
import { useAuth } from "@/hooks/auth";
import { Eye, EyeOff, X } from "lucide-react";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { Login, isLoading, error: LoginError } = useAuth();

  const [showError, setShowError] = React.useState(true);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  interface LoginFormInputs {
    email: string;
    password: string;
  }

  const onSubmit = async (data: LoginFormInputs): Promise<void> => {
    setShowError(false);
    await Login(data);
  };

  return (
    <div className="w-full flex h-full items-center justify-center justify-items-center bg-white/60 p-6 ">
      <div className="flex items-center justify-center  lg:py-0 py-10 ">
        <div className="mx-auto grid lg:w-[420px] w-[360px] px-2 gap-8 mb-6">
          <div className="grid gap-4 text-center mb-4">
            <div className="flex items-center justify-center gap-2">
              <img src={Logo} alt="logo" />
              <h1 className="text-2xl text-slate-800">Viby Chat</h1>
            </div>
            <p className="text-balance text-blue-500 leading-none">
              Login to your account
            </p>
          </div>
          {LoginError && showError && (
            <div className="bg-red-50 border w-full border-red-500/20 text-red-500 p-1 rounded-md flex items-center justify-between">
              <span className="px-2">{LoginError}</span>
              <Button
                className={
                  "border-0 bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none"
                }
                onClick={() => setShowError(false)}
              >
                <X className="text-red-500" />
              </Button>
            </div>
          )}
          <form
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-2">
              <Label className="text-slate-600" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className={` h-12 text-slate-800 bg-white focus-visible:ring-0  ${
                  errors.email
                    ? " border-red-500 bg-red-50 focus-visible:ring-red-500/40 "
                    : "border-slate-600"
                }`}
                {...register("email")}
                autoComplete="username"
              />
              {errors.email && <InputError message={errors?.email.message} />}
            </div>
            {/* <div className="grid gap-2">
              <div className="flex items-center">
                <Label className="text-slate-600" htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                className={` h-12 text-slate-800 bg-white focus-visible:ring-0 ${
                  errors.password
                    ? " border-red-500 bg-red-50 focus-visible:ring-red-500/40 "
                    : "border-slate-600"
                }`}
                placeholder="Password"
                {...register("password")}
                autoComplete="current-password"
              />
              {errors.password && (
                <InputError message={errors.password.message} />
              )}
            </div> */}
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-600 "
              >
                Password
              </Label>
              <div className="relative overflow-visible flex justify-between items-center">
                <Input
                  autoComplete="current-password"
                  id="password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  // className="border-slate-700 h-11 focus:border-gray-900 focus:ring-gray-900"
                  className={` h-12 text-slate-800 bg-white focus-visible:ring-0 ${
                    errors.password
                      ? " border-red-500 bg-red-50 focus-visible:ring-red-500/40 "
                      : "border-slate-600"
                  }`}
                  disabled={isLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors active:outline-none focus-visible:outline-none outline-none"
                  disabled={isLoading}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <InputError message={errors.password.message} />
              )}
            </div>
            <Link
              to="/auth/forgot-password"
              className=" inline-block text-sm underline text-blue-600"
            >
              Forgot your password?
            </Link>
            <Button
              type="submit"
              className="w-full h-11 flex items-center justify-center gap-2 cursor-pointer bg-black active:scale-[0.98] text-white hover:bg-gray-800 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? " Please wait" : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to={"/auth/register"} className="underline text-blue-500">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
