import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { DotBackground } from "@/components/custom/DotBackground";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <DotBackground className="min-h-screen">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto text-center rounded-full bg-white/40">
          {/* Illustration */}
          <div className="mb-8">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                      404
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg rounded-br-sm opacity-60"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-5 bg-gray-300 dark:bg-gray-600 rounded-lg rounded-bl-sm opacity-40"></div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center border-2 border-red-200 dark:border-red-800">
                <Search className="h-4 w-4 text-red-500 dark:text-red-400" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Oops! We couldn't find the page you're looking for.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              The page you're looking for doesn't exist or may have been moved.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-4 mb-8">
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex-1 h-11 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Link to="/" className="flex-1">
                <Button className="w-full h-11 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>

          {/* Help Section */}
          {/* <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Still having trouble? Try refreshing the page or{" "}
              <Link
                to="/support"
                className="text-gray-700 dark:text-gray-300 hover:underline font-medium"
              >
                contact support
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    </DotBackground>
  );
}
