import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { registrationSchema } from "@/lib/validations";
import logo from "@/assets/logo.svg";
import React from "react";
import type { z } from "zod";

type RegistrationData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
  isLoading?: boolean;
  serverError?: string;
  onErrorClear?: () => void;
}

export function RegistrationForm({
  onSubmit,
  isLoading = false,
  serverError,
  onErrorClear,
}: RegistrationFormProps) {
  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [showNewPassword, setShowNewPassword] = React.useState(false);

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    form.setValue(field, value);
    onErrorClear?.();
  };

  return (
    <Card className="border-0 shadow-none bg-white text-slate-800">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <img src={logo} alt="logo" />
          <h1 className="text-2xl text-slate-800">Viby Chat</h1>
        </CardTitle>
        <CardDescription className="text-blue-500">
          Get started with your free account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {serverError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full name
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                autoComplete="name"
                placeholder="John Doe"
                className="border-slate-700 h-11 focus:border-gray-900 focus:ring-gray-900"
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                autoComplete="username"
                placeholder="john@example.com"
                className="border-slate-700 h-11 focus:border-gray-900 focus:ring-gray-900"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2 overflow-visible">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>
              <div className="relative overflow-visible flex justify-between items-center">
                <Input
                  autoComplete="new-password"
                  id="password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="border-slate-700 h-11 focus:border-gray-900 focus:ring-gray-900"
                  disabled={isLoading}
                  {...form.register("password")}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600  transition-colors active:outline-none focus-visible:outline-none outline-none"
                  disabled={isLoading}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-600" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-black h-11 mt-3 hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Continue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
