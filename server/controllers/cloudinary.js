const { TryCatch } = require("../lib/error");
const cloudinary = require("cloudinary").v2;

const GetSignature = TryCatch(async (req, res, next) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = req.query.folder || "media_messages";

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  res.status(200).json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    message: "Signature generated successfully",
  });
});

module.exports = {
  GetSignature,
};
