import { BASE_SERVER_URL } from "@/config/config";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: BASE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/auth";
};

interface PostConfig {
  headers?: Record<string, string>;
  [key: string]: unknown;
}

export const POST = async (
  url: string,
  data: unknown,
  config: PostConfig = {}
): Promise<unknown> => {
  try {
    console.log("🌐 Making POST request to:", `${BASE_SERVER_URL}${url}`);
    console.log("📤 Request data:", data);

    const response = await axiosInstance.post(url, data, {
      ...config,
      withCredentials: true,
    });

    console.log("📥 Response status:", response.status);
    console.log("📄 Response data:", response.data);

    if (response.status === 401) {
      Logout();
      return;
    }

    return response.data;
  } catch (error) {
    console.error("🚨 Axios POST error:", error);
    if (axios.isAxiosError(error)) {
      console.error("📊 Error details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw error;
  }
};

interface GetConfig {
  headers?: Record<string, string>;
  [key: string]: unknown;
}

export const GET = async (
  url: string,
  config: GetConfig = {}
): Promise<unknown> => {
  const response = await axiosInstance.get(url, {
    ...config,
    withCredentials: true,
  });

  if (response.status === 401) {
    Logout();
    return;
  }

  return response.data;
};

interface MultipartPostConfig {
  headers?: Record<string, string>;
  [key: string]: unknown;
}

export const MULTIPART_POST = async (
  url: string,
  data: FormData,
  config: MultipartPostConfig = {}
): Promise<unknown> => {
  const response = await axiosInstance.post(url, data, {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  if (response.status === 401) {
    Logout();
    return;
  }

  return response.data;
};
