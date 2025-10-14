const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("../config/config");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const UploadAvatar = async (file) => {
  try {
    const res = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "viby/avatars",
      resource_type: "image",
      transformation: [
        { gravity: "face", width: 800, height: 800, crop: "fill" },
      ],
    });

    return {
      url: res.secure_url,
      public_id: res.public_id,
    };
  } catch (error) {
    console.log("Error uploading avatar:", error);
  }
};

const generateVideoThumbnail = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: "video",
    format: "jpg",
    transformation: [
      { width: 400, height: 300, crop: "fill" },
      { start_offset: "2" }, // Get thumbnail from 2 seconds into the video
    ],
  });
};

const UploadOnCloudinary = async (files) => {
  const isMultiple = Array.isArray(files);

  try {
    if (isMultiple) {
      const uploadPromises = files.map(async (file) => {
        const res = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "viby/messages",
          resource_type: "auto",
          use_filename: true,
          unique_filename: false,
          public_id: file.name ? file.name.split(".")[0] : undefined,
          // For videos, enable thumbnail generation
          ...(file.mimetype?.startsWith("video/") && {
            eager: [
              {
                width: 400,
                height: 300,
                crop: "fill",
                format: "jpg",
                start_offset: "2",
              },
            ],
            eager_async: false, // Wait for eager transformations to complete
          }),
        });

        // Generate thumbnail URL for videos
        let thumbnailUrl = res.thumbnail_url;
        if (res.resource_type === "video" && !thumbnailUrl) {
          thumbnailUrl = generateVideoThumbnail(res.public_id);
        }

        return {
          public_id: res.public_id,
          url: res.secure_url,
          resource_type: res.is_audio ? "audio" : res.resource_type,
          bytes: res.bytes, // Fixed typo from "byes"
          name: file.name || file.originalname || res.original_filename || "",
          format: res.format,
          duration: res.duration,
          thumbnail_url: thumbnailUrl,
          // Add eager transformation URLs if available
          thumbnails: res.eager
            ? res.eager.map((eager) => eager.secure_url)
            : [],
        };
      });

      return Promise.all(uploadPromises);
    }

    const res = await cloudinary.uploader.upload(files.tempFilePath, {
      folder: "viby/messages",
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
      public_id: files.name ? files.name.split(".")[0] : undefined,
      // For videos, enable thumbnail generation
      ...(files.mimetype?.startsWith("video/") && {
        eager: [
          {
            width: 400,
            height: 300,
            crop: "fill",
            format: "jpg",
            start_offset: "2",
          },
        ],
        eager_async: false, // Wait for eager transformations to complete
      }),
    });

    console.log("Single file upload response:", res);

    // Generate thumbnail URL for videos
    let thumbnailUrl = res.thumbnail_url;
    if (res.resource_type === "video" && !thumbnailUrl) {
      thumbnailUrl = generateVideoThumbnail(res.public_id);
    }

    return {
      public_id: res.public_id,
      url: res.secure_url,
      resource_type: res.is_audio ? "audio" : res.resource_type,
      bytes: res.bytes, // Fixed typo from "byes"
      name: files.name || files.originalname || res.original_filename || "",
      format: res.format,
      duration: res.duration,
      thumbnail_url: thumbnailUrl,
      // Add eager transformation URLs if available
      thumbnails: res.eager ? res.eager.map((eager) => eager.secure_url) : [],
    };
  } catch (error) {
    console.log("Error uploading files:", error);
    throw new Error("Failed to upload files");
  }
};

// Helper function to generate thumbnail on demand
const getVideoThumbnail = (publicId, options = {}) => {
  const defaultOptions = {
    width: 400,
    height: 300,
    crop: "fill",
    format: "jpg",
    start_offset: "2",
  };

  return cloudinary.url(publicId, {
    resource_type: "video",
    transformation: [{ ...defaultOptions, ...options }],
  });
};

module.exports = {
  UploadAvatar,
  UploadOnCloudinary,
  getVideoThumbnail,
};
