const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file uploaded.");
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "civicfix-ai/complaints",
      resource_type: "image",
    });

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
};