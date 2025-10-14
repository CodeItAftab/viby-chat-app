import { useDispatch, useSelector } from "react-redux";
import { login, logout, setIsLoading } from "@/store/slices/auth";
import { MULTIPART_POST, POST } from "@/lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  RootState,
  ApiResponse,
  ApiError,
  LoginData,
  SignUpData,
  VerifyOTPData,
  UpdateProfileData,
  ResetPasswordData,
  ChangePasswordData,
} from "@/types";

export const useAuth = () => {
  const { isLoggedIn, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const disptach = useDispatch();

  const setLoading = (loading: boolean) => {
    disptach(setIsLoading(loading));
  };

  //   Login

  const Login = async (data: LoginData) => {
    setError("");
    if (isLoggedIn) {
      return;
    }

    // Login logic

    try {
      setLoading(true);
      const res = (await POST("/auth/login", data)) as ApiResponse;
      if (res.success) {
        disptach(login({ user: res.user }));
        navigate("/", { replace: true });
        console.log(res);
      }
    } catch (error) {
      const apiError = error as ApiError;
      const ok = apiError.response?.data?.success;
      const message =
        apiError.response?.data?.message || "Something went wrong";
      if (!ok) {
        console.log(message);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const SignUp = async (data: SignUpData) => {
    if (isLoggedIn) {
      return { success: false, message: "Already logged in" };
    }

    try {
      setError("");
      setLoading(true);
      const res = (await POST("/auth/register", data)) as ApiResponse;
      console.log("SignUp response:", res);
      if (res.success) {
        return res;
      } else {
        // Handle case where request succeeds but success is false
        const message = res.message || "Registration failed";
        setError(message);
        return { success: false, message };
      }
    } catch (error) {
      console.error("SignUp error:", error);
      const apiError = error as ApiError;
      const message =
        apiError.response?.data?.message ||
        "Network error. Please check if the server is running.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const VerifyOTP = async (data: VerifyOTPData) => {
    try {
      setLoading(true);
      setError("");
      console.log(data);
      const res = (await POST("/auth/verify-otp", data)) as ApiResponse;
      if (res.success) {
        console.log(res);
        // Don't login immediately - let the registration flow complete first
        // disptach(login({ user: res.user }));
        return res;
      }
    } catch (error) {
      console.log(error);
      const apiError = error as ApiError;
      const ok = apiError.response?.data?.success;
      const message =
        apiError.response?.data?.message || "Something went wrong";
      if (!ok) {
        console.log(message);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const UpdateProfile = async (data: UpdateProfileData | FormData) => {
    try {
      setLoading(true);
      setError("");
      console.log(data);

      const res = (await MULTIPART_POST(
        "/user/update-profile",
        data as FormData
      )) as ApiResponse;

      console.log("useauth update profile response:", res);

      if (res?.success) {
        // Don't login immediately - let the success page show first
        // disptach(login({ user: res.user }));
        return res;
      } else {
        // Handle case where request succeeds but success is false
        const message = res?.message || "Profile update failed";
        setError(message);
        return { success: false, message };
      }
    } catch (error) {
      console.log(error);
      const apiError = error as ApiError;
      const message =
        apiError.response?.data?.message || "Something went wrong";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const SendResetLink = async (data: ResetPasswordData) => {
    try {
      setLoading(true);
      setError("");
      const res = (await POST("/auth/reset-password", data)) as ApiResponse;
      if (res?.success) {
        console.log(res);
        return res;
      }
    } catch (error) {
      console.log(error);
      const apiError = error as ApiError;
      const ok = apiError.response?.data?.success;
      const message =
        apiError.response?.data?.message || "Something went wrong";
      if (!ok) {
        console.log(message);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const ResetPassword = async (token: string, data: ChangePasswordData) => {
    try {
      setLoading(true);
      setError("");
      const res = (await POST(
        `/auth/change-password/${token} `,
        data
      )) as ApiResponse;
      if (res?.success) {
        console.log(res);
        return res;
      }
    } catch (error) {
      console.log(error);
      const apiError = error as ApiError;
      const ok = apiError.response?.data?.success;
      const message =
        apiError.response?.data?.message || "Something went wrong";
      if (!ok) {
        console.log(message);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const CompleteRegistration = async (userData: object) => {
    try {
      setLoading(true);
      // Login the user with the stored user data
      disptach(login({ user: userData }));
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const Logout = () => {
    disptach(logout());
  };

  return {
    isLoggedIn,
    Login,
    SignUp,
    VerifyOTP,
    UpdateProfile,
    CompleteRegistration,
    SendResetLink,
    ResetPassword,
    Logout,
    isLoading,
    error,
    user,
  };
};
