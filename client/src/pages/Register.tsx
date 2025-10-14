import { useEffect, useState } from "react";
import { User, CheckCircle, Camera } from "lucide-react";
import { TimelineStepper } from "@/components/custom/TimelineStepper";
import { RegistrationForm } from "@/components/custom/RegistrationForm";
import { OtpVerification } from "@/components/custom/Otp-Verification";
import { ProfileSetupForm } from "@/components/custom/ProfileSetupForm";
import { RegistrationSuccess } from "@/components/custom/RegistrationSuccess";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";

// import { RegistrationFooter } from "./components/registration-footer";

const steps = [
  { number: 1, title: "Account", icon: User },
  { number: 2, title: "Verify", icon: CheckCircle },
  { number: 3, title: "Profile", icon: Camera },
  { number: 4, title: "Complete", icon: CheckCircle },
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [profileData, setProfileData] = useState<{
    bio?: string;
    dob?: string;
    avatar?: File;
  } | null>(null);
  const [userData, setUserData] = useState<object | null>(null);

  const {
    SignUp,
    VerifyOTP,
    UpdateProfile,
    CompleteRegistration,
    error: serverError,
    isLoading,
  } = useAuth();

  const handleRegistrationSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await SignUp(data);
    if (res?.success) {
      setRegistrationData(data);
      setCurrentStep(2);
    }
  };

  // const handleRegistrationSubmit = async (data: {
  //   name: string;
  //   email: string;
  //   password: string;
  // }) => {
  //   try {
  //     const res = await SignUp(data);
  //     console.log("Registration response:", res);

  //     if (res?.success) {
  //       setRegistrationData(data);
  //       localStorage.setItem("registrationData", JSON.stringify(data));
  //       setCurrentStep(2);
  //       localStorage.setItem("registrationStep", "2");
  //     } else {
  //       // Handle the case where signup failed
  //       console.error("Registration failed:", res?.message || "Unknown error");
  //       // The error will be shown via the serverError state from useAuth
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error during registration:", error);
  //   }
  // };

  // const handleVerifyOtp = async (otp) => {
  //   const res = await VerifyOTP({ otp, email: registrationData.email });
  //   if (res?.success) setCurrentStep(3);
  // };

  const handleVerifyOtp = async (otp: string) => {
    const res = await VerifyOTP({ otp, email: registrationData.email });
    if (res?.success) {
      setCurrentStep(3);
      localStorage.setItem("registrationStep", "3");
    }
  };

  const handleResendOtp = async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.9) {
          reject(new Error("Failed to resend code. Please try again."));
        } else {
          resolve(true);
        }
      }, 1000);
    });
  };

  const handleProfileSubmit = async (data: {
    bio?: string;
    dob?: string;
    avatar?: File;
  }) => {
    try {
      const res = await UpdateProfile(data);
      console.log(res);
      if (res?.success) {
        setProfileData(data);
        if (res.user) {
          setUserData(res.user); // Store user data for later login
        }
        setCurrentStep(4);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleProfileSubmit = async (data: {
  //   bio?: string;
  //   dob?: string;
  //   avatar?: File;
  // }) => {
  //   try {
  //     await UpdateProfile(data);
  //     setProfileData(data);
  //     setCurrentStep(4);

  //     // Optional: Save if you need this temporarily
  //     localStorage.setItem("profileData", JSON.stringify(data));
  //     localStorage.setItem("registrationStep", "4");

  //     // Clear localStorage when reaching Step 4
  //     localStorage.removeItem("registrationData");
  //     localStorage.removeItem("profileData");
  //     localStorage.removeItem("registrationStep");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleSkipProfile = () => {
  //   setCurrentStep(4);
  // };

  const handleSkipProfile = () => {
    setCurrentStep(4);
    localStorage.setItem("registrationStep", "4");

    // Clear localStorage when reaching Step 4
    localStorage.removeItem("registrationData");
    localStorage.removeItem("profileData");
    localStorage.removeItem("registrationStep");
  };

  // const handleGetStarted = () => {
  //   console.log("User completed registration:", {
  //     registrationData,
  //     profileData,
  //   });
  // };

  const handleGetStarted = async () => {
    console.log("User completed registration:", {
      registrationData,
      profileData,
    });

    // Login the user and redirect to home
    if (userData) {
      await CompleteRegistration(userData);
    }

    // Clean up
    localStorage.removeItem("registrationStep");
    localStorage.removeItem("registrationData");
    localStorage.removeItem("profileData");
  };

  const getInitials = () => {
    if (!registrationData?.name) return "U";
    const names = registrationData.name.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(
        0
      )}`.toUpperCase();
    }
    return registrationData.name.charAt(0).toUpperCase();
  };

  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("wasReloaded", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    return () => {
      const wasReloaded = localStorage.getItem("wasReloaded");

      if (!wasReloaded) {
        // Navigation occurred, clear localStorage
        localStorage.removeItem("registrationData");
        localStorage.removeItem("registrationStep");
        localStorage.removeItem("profileData");
      }

      // Reset flag for future reload detection
      localStorage.removeItem("wasReloaded");
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-screen ">
      <div
        className={cn(
          "h-full  w-full bg-white flex items-center justify-center p-4 pt-10",
          serverError && "pt-16"
        )}
      >
        <div className="w-full h-full max-w-md">
          <TimelineStepper steps={steps} currentStep={currentStep} />

          {currentStep === 1 && (
            <RegistrationForm
              onSubmit={handleRegistrationSubmit}
              isLoading={isLoading}
              serverError={serverError}
              // onErrorClear={clearServerError}
            />
          )}

          {currentStep === 2 && registrationData && (
            <OtpVerification
              email={registrationData.email}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              serverError={serverError}
              isLoading={isLoading}
            />
          )}

          {currentStep === 3 && (
            <ProfileSetupForm
              onSubmit={handleProfileSubmit}
              onSkip={handleSkipProfile}
              isLoading={isLoading}
              serverError={serverError}
              userInitials={getInitials()}
            />
          )}

          {currentStep === 4 && registrationData && (
            <RegistrationSuccess
              userData={{
                name: registrationData.name,
                email: registrationData.email,
                avatar: profileData?.avatar,
                bio: profileData?.bio,
              }}
              userInitials={getInitials()}
              onGetStarted={handleGetStarted}
            />
          )}

          {currentStep == 1 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to={"/auth/login"}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
      {/* <div className="hidden lg:flex lg:w-1/2 bg-gray-50  items-center justify-center p-8"></div> */}
    </div>
  );
}
