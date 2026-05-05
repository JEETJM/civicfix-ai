const cloudinary = require("../config/cloudinary");

const uploadImageToCloudinary = async (file, folder) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: "image",
  });

  return result;
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file uploaded.");
    }

    const result = await uploadImageToCloudinary(
      req.file,
      "civicfix-ai/complaints"
    );

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

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No profile image uploaded.");
    }

    const result = await uploadImageToCloudinary(
      req.file,
      "civicfix-ai/profile-images"
    );

    req.user.profileImage = result.secure_url;
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      imageUrl: result.secure_url,
      user: req.user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

const removeProfileImage = async (req, res, next) => {
  try {
    req.user.profileImage = "";
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully.",
      user: req.user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  uploadProfileImage,
  removeProfileImage,
};