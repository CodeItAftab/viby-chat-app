import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InvalidTokenMessageProps {
  className?: string;
}

const InvalidTokenMessage = ({ className }: InvalidTokenMessageProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "w-full max-w-md mx-auto shadow-none border-none rounded-4xl",
        className
      )}
    >
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Invalid Reset Link
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          This password reset link is invalid or has expired
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Link Issues
            </h3>
            <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
              <li>• The reset link may have expired (valid for 10 minutes)</li>
              <li>• The link may have already been used</li>
              <li>• The link may be malformed or incomplete</li>
            </ul>
          </div>
          <Button
            onClick={() => navigate("/auth/login", { replace: true })}
            variant="outline"
            className="w-full h-11 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvalidTokenMessage;
