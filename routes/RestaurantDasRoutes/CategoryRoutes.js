// const Category = require("../models/Category");

// app.get("/api/categories", async (req, res) => {
//   try {
//     const categories = await Category.find({ parentCategory: null }).populate(
//       "subcategories"
//     );
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get a specific category with its subcategories
// app.get("/api/categories/:id", async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id).populate(
//       "subcategories"
//     );

//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.json(category);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new category
// app.post("/api/categories", async (req, res) => {
//   try {
//     const { name, parentCategoryId } = req.body;

//     const newCategory = new Category({
//       name,
//       parentCategory: parentCategoryId || null,
//     });

//     const savedCategory = await newCategory.save();

//     // If this is a subcategory, update the parent
//     if (parentCategoryId) {
//       const parentCategory = await Category.findById(parentCategoryId);
//       if (parentCategory) {
//         parentCategory.subcategories.push(savedCategory._id);
//         parentCategory.subCount += 1;
//         await parentCategory.save();
//       }
//     }

//     res.status(201).json(savedCategory);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Update a category
// app.put("/api/categories/:id", async (req, res) => {
//   try {
//     const { name } = req.body;

//     const updatedCategory = await Category.findByIdAndUpdate(
//       req.params.id,
//       { name },
//       { new: true }
//     );

//     if (!updatedCategory) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.json(updatedCategory);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Delete a category
// app.delete("/api/categories/:id", async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);

//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     // Handle subcategories
//     const deleteSubcategories = async (categoryId) => {
//       const cat = await Category.findById(categoryId);
//       if (cat) {
//         for (const subId of cat.subcategories) {
//           await deleteSubcategories(subId);
//         }
//         await Category.findByIdAndDelete(categoryId);
//       }
//     };

//     // Update parent if this is a subcategory
//     if (category.parentCategory) {
//       const parentCategory = await Category.findById(category.parentCategory);
//       if (parentCategory) {
//         parentCategory.subcategories = parentCategory.subcategories.filter(
//           (subId) => !subId.equals(category._id)
//         );
//         parentCategory.subCount -= 1;
//         await parentCategory.save();
//       }
//     }

//     // Delete the category and all its subcategories
//     await deleteSubcategories(req.params.id);

//     res.json({ message: "Category deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update item count for a category
// app.patch("/api/categories/:id/itemCount", async (req, res) => {
//   try {
//     const { change } = req.body; // Can be positive or negative

//     const category = await Category.findById(req.params.id);

//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     category.itemCount = Math.max(0, category.itemCount + change);
//     await category.save();

//     res.json(category);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  updateItemCount,
  getSubcategories,
} = require("../../controller/RestaurantDasController/categoryController");
const { isAuthenticatedDashboard } = require("../../config/authHandlers");
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
const router = express.Router();
router.get("/subcategories/:id", authenticateToken, getSubcategories);
router.get("/", authenticateToken, getCategories);
router.get("/:id", authenticateToken, getCategoryById);
router.post("/", authenticateToken, createCategory);
router.post("/:id", authenticateToken, createCategory);
router.post("/createsubcategories/:id", authenticateToken, getSubcategories);
router.put("/:id", authenticateToken, updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);
router.patch("/:id/itemCount", authenticateToken, updateItemCount);

module.exports = router;
