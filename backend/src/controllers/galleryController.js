// backend/src/controllers/galleryController.js
import GalleryImage from "../models/GalleryImage.js";

// PUBLIC: customers see active gallery images
export const getActiveGallery = async (req, res) => {
  try {
    const images = await GalleryImage.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ images });
  } catch (e) {
    console.error("getActiveGallery:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: list all
export const adminGetAllGallery = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    return res.json({ images });
  } catch (e) {
    console.error("adminGetAllGallery:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: upload new image
export const adminUploadGalleryImage = async (req, res) => {
  try {
    const { title, category, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // When using multipart/form-data, boolean values arrive as strings ("true"/"false").
    // This parsing ensures the "Active" checkbox actually works.
    let parsedIsActive = true;
    if (typeof isActive === "boolean") {
      parsedIsActive = isActive;
    } else if (typeof isActive === "string") {
      const s = isActive.toLowerCase().trim();
      if (["false", "0", "no"].includes(s)) parsedIsActive = false;
      if (["true", "1", "yes"].includes(s)) parsedIsActive = true;
    }

    const normalizedCategoryRaw = (category ?? "").toString().trim().toLowerCase();
    const normalizedCategory = ["wedding", "birthday", "other"].includes(normalizedCategoryRaw)
      ? normalizedCategoryRaw
      : "other";

    const created = await GalleryImage.create({
      title: (title || "").trim(),
      imageUrl,
      isActive: parsedIsActive,
      category: normalizedCategory,
    });

    return res.status(201).json({ message: "Gallery image uploaded ✅", image: created });
  } catch (e) {
    console.error("adminUploadGalleryImage:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: toggle/update
export const adminUpdateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, isActive } = req.body;

    const img = await GalleryImage.findById(id);
    if (!img) return res.status(404).json({ message: "Image not found." });

    if (title !== undefined) img.title = title;
    if (isActive !== undefined) img.isActive = isActive;
    if (category !== undefined) {
      const normalizedCategoryRaw = (category ?? "").toString().trim().toLowerCase();
      img.category = ["wedding", "birthday", "other"].includes(normalizedCategoryRaw)
        ? normalizedCategoryRaw
        : "other";
    }

    await img.save();
    return res.json({ message: "Gallery image updated ✅", image: img });
  } catch (e) {
    console.error("adminUpdateGalleryImage:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: delete (DB only; file delete can be added later)
export const adminDeleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const img = await GalleryImage.findById(id);
    if (!img) return res.status(404).json({ message: "Image not found." });

    await GalleryImage.deleteOne({ _id: id });
    return res.json({ message: "Gallery image deleted ✅" });
  } catch (e) {
    console.error("adminDeleteGalleryImage:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};
