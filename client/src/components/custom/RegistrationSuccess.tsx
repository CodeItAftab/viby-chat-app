import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  bio?: string;
  avatar?: File;
}

interface RegistrationSuccessProps {
  userData: UserData;
  userInitials: string;
  onGetStarted: () => void;
}

export function RegistrationSuccess({
  userData,
  userInitials,
  onGetStarted,
}: RegistrationSuccessProps) {
  return (
    <Card className="border-0 shadow-none mt-4  bg-white text-slate-800 overflow-hidden">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Welcome aboard!
        </CardTitle>
        <CardDescription className="text-gray-500">
          Your account is ready to use
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {/* Profile Summary */}
        <div className="bg-slate-100 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 object-cover object-center">
              <AvatarImage
                src={
                  userData.avatar
                    ? URL.createObjectURL(userData.avatar)
                    : "/placeholder.svg"
                }
                className={"object-cover object-center"}
              />
              <AvatarFallback className="bg-white text-gray-600 text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{userData.name}</p>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>
          </div>
          {userData.bio && (
            <p className="text-sm text-gray-600 bg-white rounded p-2">
              {userData.bio}
            </p>
          )}
        </div>

        <Button
          onClick={onGetStarted}
          className="w-full bg-black hover:bg-gray-800 text-white"
        >
          Get started
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            You can always update your profile later in settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
