import { BASE_SERVER_URL } from "@/config/config";
import { GET } from "./axios";
import type { Media } from "@/types/message";

type UploadFileParams = {
  file: File | Blob;
  resourceType?: "auto" | "image" | "video" | "raw" | "audio";
  folder?: string;
  signatureEndpoint?: string; // Your API endpoint to get signature
};

// type CloudinaryUploadResult = {
//   url: string;
//   public_id: string;
//   bytes: number;
//   resource_type: string;
//   duration?: number;
//   format?: string;
//   thumbnail_url?: string;
// };

export async function uploadToCloudinary({
  file,
  resourceType = "auto",
  folder = "media_messages",
}: // }: UploadFileParams): Promise<CloudinaryUploadResult> {
UploadFileParams): Promise<Media> {
  // Detect MIME type and map to Cloudinary-friendly resourceType
  const mimeType = (file as File).type;

  if (mimeType.startsWith("audio/")) {
    resourceType = "video"; // Cloudinary treats audio as video
  }

  const sigRes = await GET(
    `${BASE_SERVER_URL}/cloudinary/get-signature/?folder=${folder}`
  );

  if (!sigRes || typeof sigRes !== "object")
    throw new Error("Failed to get Cloudinary signature");

  const { signature, timestamp, apiKey, cloudName } = sigRes as {
    signature: string;
    timestamp: string;
    apiKey: string;
    cloudName: string;
  };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error?.message || "Cloudinary upload failed");
  }

  const data = await response.json();

  // Generate a thumbnail only for image or video (audio is treated as video)
  let thumbnail_url: string | undefined;
  if (data.resource_type === "video" && !data.is_audio) {
    thumbnail_url = `https://res.cloudinary.com/${cloudName}/video/upload/so_1/${data.public_id}.jpg`;
  } else if (data.resource_type === "image") {
    thumbnail_url = data.secure_url;
  }

  console.log("Cloudinary upload result:", data);

  const isActuallyAudio = data.is_audio;

  return {
    url: data.secure_url,
    public_id: data.public_id,
    bytes: data.bytes,
    duration: data.duration,
    resource_type: isActuallyAudio ? "audio" : data.resource_type, // override for clarity
    format: data.format,
    thumbnail_url: thumbnail_url ?? undefined,
  };
}
