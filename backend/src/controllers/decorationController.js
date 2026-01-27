// backend/src/controllers/decorationController.js
import Decoration from "../models/Decoration.js";

// PUBLIC: customers can view active decorations
export const getActiveDecorations = async (req, res) => {
  try {
    const items = await Decoration.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ decorations: items });
  } catch (e) {
    console.error("getActiveDecorations:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: view all
export const adminGetAllDecorations = async (req, res) => {
  try {
    const items = await Decoration.find().sort({ createdAt: -1 });
    return res.json({ decorations: items });
  } catch (e) {
    console.error("adminGetAllDecorations:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: create
export const adminCreateDecoration = async (req, res) => {
  try {
    const { title, description, priceFrom, tag, isActive } = req.body;

    if (!title || !description || !priceFrom) {
      return res.status(400).json({ message: "title, description, priceFrom are required." });
    }

    const created = await Decoration.create({
      title,
      description,
      priceFrom,
      tag: tag || "",
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({ message: "Decoration created ✅", decoration: created });
  } catch (e) {
    console.error("adminCreateDecoration:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: update
export const adminUpdateDecoration = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priceFrom, tag, isActive } = req.body;

    const dec = await Decoration.findById(id);
    if (!dec) return res.status(404).json({ message: "Decoration not found." });

    if (title !== undefined) dec.title = title;
    if (description !== undefined) dec.description = description;
    if (priceFrom !== undefined) dec.priceFrom = priceFrom;
    if (tag !== undefined) dec.tag = tag;
    if (isActive !== undefined) dec.isActive = isActive;

    await dec.save();
    return res.json({ message: "Decoration updated ✅", decoration: dec });
  } catch (e) {
    console.error("adminUpdateDecoration:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// ADMIN: delete
export const adminDeleteDecoration = async (req, res) => {
  try {
    const { id } = req.params;

    const dec = await Decoration.findById(id);
    if (!dec) return res.status(404).json({ message: "Decoration not found." });

    await Decoration.deleteOne({ _id: id });
    return res.json({ message: "Decoration deleted ✅" });
  } catch (e) {
    console.error("adminDeleteDecoration:", e.message);
    return res.status(500).json({ message: "Server error." });
  }
};
