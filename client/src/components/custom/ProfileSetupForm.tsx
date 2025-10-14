import { useEffect, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, AlertCircle } from "lucide-react";
import { profileSchema } from "@/lib/validations";
import type { z } from "zod";

type ProfileData = z.infer<typeof profileSchema>;

interface ProfileSetupFormProps {
  onSubmit: (data: ProfileData) => void;
  onSkip: () => void;
  isLoading?: boolean;
  serverError?: string;
  onErrorClear?: () => void;
  userInitials?: string;
}

export function ProfileSetupForm({
  onSubmit,
  onSkip,
  isLoading = false,
  serverError,
  onErrorClear,
  userInitials,
}: ProfileSetupFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarURL, setAvatarURL] = useState("./placeholder.svg");

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      dob: "",
    },
  });

  const avatarFile = form.watch("avatar");

  useEffect(() => {
    if (avatarFile && avatarFile instanceof File) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarURL(url);
      // return () => URL.revokeObjectURL(url); // Clean up the URL object
    } else {
      setAvatarURL("./placeholder.svg");
    }
  }, [avatarFile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      form.setValue("avatar", file);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    form.setValue(field, value);
    onErrorClear?.();
  };

  return (
    <Card className="shrink-0 border-0 shadow-none bg-white text-slate-800">
      <CardHeader className="shrink-0 text-center pb-0">
        <CardTitle className="shrink-0 text-lg font-semibold text-gray-900">
          Complete your profile
        </CardTitle>
        <CardDescription className="shrink-0 text-gray-500">
          Add some details to personalize your account
        </CardDescription>
      </CardHeader>
      <CardContent className="shrink-0 pt-0">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="shrink-0 space-y-6"
        >
          {serverError && (
            <div className="shrink-0 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className=" w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="shrink-0 text-sm text-red-600">{serverError}</p>
            </div>
          )}

          {/* Profile Picture */}
          <div className="shrink-0 flex flex-col items-center space-y-3">
            <div className="shrink-0 relative overflow-visible">
              <Avatar className="shrink-0 w-20 h-20 object-cover object-center ">
                <AvatarImage
                  src={avatarURL || "/placeholder.svg"}
                  className={"object-cover object-center"}
                />
                <AvatarFallback className="shrink-0 bg-gray-100 text-gray-600 text-lg font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 absolute -bottom-1 -right-1 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Camera className="shrink-0 w-3 h-3" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="shrink-0 hidden"
            />
            <p className="shrink-0 text-xs text-gray-500">
              Upload a profile picture
            </p>
          </div>

          {/* Bio */}
          <div className="shrink-0 space-y-1">
            <Label
              htmlFor="bio"
              className="shrink-0 text-sm font-medium text-gray-700"
            >
              Bio
            </Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              placeholder="Tell us a bit about yourself..."
              className="shrink-0 border-gray-200 focus:border-gray-900 focus:ring-gray-900 resize-none"
              rows={3}
              onChange={(e) => handleInputChange("bio", e.target.value)}
            />
            {form.formState.errors.bio && (
              <p className="shrink-0 text-sm text-red-600">
                {form.formState.errors.bio.message}
              </p>
            )}
          </div>

          {/* Phone */}
          {/* <div className="shrink-0 space-y-1">
            <Label
              htmlFor="phone"
              className="shrink-0 text-sm font-medium text-gray-700"
            >
              Phone number
            </Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              placeholder="+91 12345 67890"
              className="shrink-0 border-gray-200 h-11 focus:border-gray-900 focus:ring-gray-900"
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            {form.formState.errors.phone && (
              <p className="shrink-0 text-sm text-red-600">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div> */}

          {/* Date of Birth */}
          <div className="shrink-0 space-y-1">
            <Label
              htmlFor="dob"
              className="shrink-0 text-sm font-medium text-gray-700"
            >
              Date of birth
            </Label>
            <Input
              id="dob"
              type="date"
              {...form.register("dob")}
              className="shrink-0 border-gray-200 h-11 focus:border-gray-900 focus:ring-gray-900"
              onChange={(e) => handleInputChange("dob", e.target.value)}
            />
            {form.formState.errors.dob && (
              <p className="shrink-0 text-sm text-red-600">
                {form.formState.errors.dob.message}
              </p>
            )}
          </div>

          <div className="shrink-0 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="shrink-0 flex-1 outline-slate-600 border-2 border-slate-600 z-40 text-gray-600 hover:bg-slate-50 hover:text-slate-500"
              onClick={onSkip}
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              className="shrink-0 flex-1 bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete setup"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
