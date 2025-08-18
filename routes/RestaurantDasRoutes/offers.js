// Fixed routes/offers.js - Make sure all routes are properly defined
const express = require("express");
const router = express.Router();
const Offer = require("../../models/RestaurantsDasModel/Offer");
const Category = require("../../models/RestaurantsDasModel/categorySubCategory");
const Item = require("../../models/RestaurantsDasModel/item");
const Firm = require("../../models/Firm");
const Notify = require("../../models/logs/notify");
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
// Get all offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find({})
      .populate("items")
      .populate("category")
      .populate("subcategory");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get offer by Id
router.get("/current-offers/:id", async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const id = req.params.id;
    const offers = await Offer.find({
      firm: id,
      adminAccept: true,
      display: true,
      endDate: { $gte: currentDate },
    }).populate("items");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//get offer by Id
router.get("/pendding-offers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pendingOffers = await Offer.find({
      firm: id,
      $or: [{ adminAccept: false, display: true }],
    });

    res.json(pendingOffers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/dining/rest/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const offers = await Offer.find({
      firm: id,
      applicability: { $in: ["dining", "both"] },
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/takeaway/offer/:id", async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const id = req.params.id;
    const offers = await Offer.find({
      firm: id,
      applicability: { $in: ["takeaway", "both"] },
      adminAccept: true,
      display: true, // Condition 1: applicability must be "take away"
      endDate: { $gte: currentDate }, // Condition 2: endDate must be greater than or equal to the current date
    });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/takeaway/cart/apply-offers", async (req, res) => {
  try {
    const { firmId, productIds, subcategoryIds } = req.query;
    const currentDate = new Date();

    if (!firmId || !productIds || !subcategoryIds) {
      return res.status(400).json({
        message: "firmId, productIds, and subcategoryIds are required",
      });
    }

    const productIdList = productIds.split(",");
    const subcategoryIdList = subcategoryIds.split(",");

    // Return all matched offers (no per-item mapping, just raw filtered offers)
    const offers = await Offer.find({
      firm: firmId,
      applicability: { $in: ["takeaway", "both"] },
      adminAccept: true,
      display: true,
      endDate: { $gte: currentDate },
      $or: [
        { items: { $in: productIdList } },
        { subcategoryId: { $in: subcategoryIdList } },
      ],
    });

    res.json(offers);
  } catch (error) {
    console.error("GET /apply-offers error:", error);
    res.status(500).json({ message: "Failed to fetch offers" });
  }
});

//get the offers to accept by admin
router.get("/admin/offer", async (req, res) => {
  try {
    const offers = await Offer.find({ adminAccept: false, display: true })
      .populate("items")
      .populate("category")
      .populate("subcategory");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//get the offers which are accepted by admin
router.get("/das/add", authenticateToken, async (req, res) => {
  try {
    const offers = await Offer.find({ adminAccept: true, display: true })
      .populate("items")
      .populate("category")
      .populate("subcategory");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//accepted by admin
router.put("/admin/accept/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the offer and update it
    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      { adminAccept: true },
      { new: true }
    );
    console.log(updatedOffer);
    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found", updatedOffer });
    }
    const newNotify = new Notify({
      timestamp: new Date(),
      level: "offer_request",
      type: ["restaurant"],
      message: `New offer ${status} approval`,
      metadata: {
        category: ["admin"],
        isViewed: false,
        isAccept: status === true,
        isReject: status !== true,
      },
    });
    await newNotify.save();
    res.json({ message: "Offer accepted successfully", offer: updatedOffer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get subcategories by parent category
router.get(
  "/categories/:parentId/subcategories",
  authenticateToken,
  async (req, res) => {
    try {
      const subcategories = await Category.find({
        parentCategory: req.params.parentId,
      });
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get items by category or subcategory
router.get("/items", authenticateToken, async (req, res) => {
  const { categoryId, subcategoryId } = req.query;
  const query = {};

  if (subcategoryId) {
    query.subcategoryId = subcategoryId;
  } else if (categoryId) {
    query.categoryId = categoryId;
  }

  try {
    const items = await Item.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new offer
router.post("/", authenticateToken, async (req, res) => {
  const offerData = req.body;

  // Ensure required fields are present
  if (!offerData.name || !offerData.code) {
    return res
      .status(400)
      .json({ message: "Name and code are required fields" });
  }

  // Parse dates if they're strings
  if (offerData.startDate && typeof offerData.startDate === "string") {
    offerData.startDate = new Date(offerData.startDate);
  }

  if (offerData.endDate && typeof offerData.endDate === "string") {
    offerData.endDate = new Date(offerData.endDate);
  }

  // Make sure items is an array
  if (offerData.items && !Array.isArray(offerData.items)) {
    offerData.items = [offerData.items];
  }
  // Set defaults if missing
  if (!offerData.applicability) {
    offerData.applicability = "both";
  }
  try {
    const newOffer = new Offer(offerData);
    const savedOffer = await newOffer.save();

    const newNotify = new Notify({
      timestamp: new Date(),
      level: "offer_request",
      message:
        "New offer created by the restaurant admin please check it and approve it",
      type: ["admin"],
      metadata: {
        category: "Restaurant",
        isViewed: false,
        isAccept: false,
        isReject: false,
      },
    });
    await newNotify.save();

    res.status(201).json(savedOffer);
  } catch (error) {
    console.error("Error saving offer:", error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/restaurant/:id", authenticateToken, async (req, res) => {
  const offerData = req.body;
  const restId = req.params.id;
  console.log(offerData, "getting the offers data");
  // Validate restaurant ID
  if (!restId) {
    return res.status(400).json({ message: "Invalid restaurant ID" });
  }

  try {
    // Check if restaurant exists
    const restaurant = await Firm.findById(restId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Ensure required fields are present
    if (!offerData.name || !offerData.code) {
      return res
        .status(400)
        .json({ message: "Name and code are required fields" });
    }

    // Validate items for item scope or bundle offer
    if (
      (offerData.scope === "item" || offerData.offerType === "bundle") &&
      (!offerData.items ||
        !Array.isArray(offerData.items) ||
        offerData.items.length === 0)
    ) {
      return res.status(400).json({
        message:
          "Items array is required and must not be empty for item scope or bundle offer",
      });
    }

    // Parse dates if they're strings
    if (offerData.startDate && typeof offerData.startDate === "string") {
      offerData.startDate = new Date(offerData.startDate);
    }

    if (offerData.endDate && typeof offerData.endDate === "string") {
      offerData.endDate = new Date(offerData.endDate);
    }

    // Make sure items is an array
    if (offerData.items && !Array.isArray(offerData.items)) {
      offerData.items = [offerData.items];
    }

    // Set defaults if missing
    if (!offerData.applicability) {
      offerData.applicability = "both";
    }

    // Save the new offer
    const newOffer = new Offer(offerData);
    const savedOffer = await newOffer.save();

    // Create notification
    const newNotify = new Notify({
      timestamp: new Date(),
      level: "offer_request",
      message:
        "New offer created by the restaurant admin please check it and approve it",
      type: ["admin"],
      metadata: {
        category: "Restaurant",
        isViewed: false,
        isAccept: false,
        isReject: false,
      },
    });
    await newNotify.save();

    res.status(201).json(savedOffer);
  } catch (error) {
    console.error("Error saving offer:", error);
    res.status(400).json({ message: error.message });
  }
});

// Additional route to get a specific offer by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate("items")
      .populate("category")
      .populate("subcategory");

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json(offer);
  } catch (error) {
    console.error("Error fetching offer:", error);
    res.status(500).json({ message: "Failed to fetch offer" });
  }
});

// Update an existing offer
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const offerData = req.body;

    // Parse dates if they're strings
    if (offerData.startDate && typeof offerData.startDate === "string") {
      offerData.startDate = new Date(offerData.startDate);
    }

    if (offerData.endDate && typeof offerData.endDate === "string") {
      offerData.endDate = new Date(offerData.endDate);
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      offerData,
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    const newNotify = new Notify({
      timestamp: new Date(),
      level: "offer_request",
      message: "New offer timeline is change by the restaurant admin",
      type: ["admin"],
      metadata: {
        category: ["Restaurant"],
        isViewed: false,
        isAccept: false,
        isReject: false,
      },
    });
    await newNotify.save();
    res.json(updatedOffer);
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete an offer
router.put("/delete/:id", authenticateToken, async (req, res) => {
  console.log(req.params.id, "getting the id");
  try {
    const offer = await Offer.findById(req.params.id);
    console.log(offer, "getting the offers ");
    if (!offer) {
      return res
        .status(404)
        .json({ message: "Pending offer not found or already live" });
    }

    const deleted = await Offer.findByIdAndUpdate(
      req.params.id,
      { display: false },
      { new: true }
    );

    res.json({ message: "Pending offer soft-deleted", deleted });
  } catch (error) {
    console.error("Error deleting pending offer:", error);
    res.status(500).json({ message: "Failed to delete pending offer" });
  }
});

router.put("/suggestion/:id", authenticateToken, async (req, res) => {
  try {
    const { suggestion } = req.body;
    console.log(req.params, suggestion);
    const { id } = req.params;
    console.log(id);
    if (!id || !suggestion) {
      return res.status(400).json({ message: "id is required.." });
    }
    const find = await Offer.findByIdAndUpdate(
      id,
      { suggestion: suggestion },
      { new: true }
    );
    if (!find) {
      return res.status(404).json({ message: "offer is not found" });
    }
    return res.status(200).json({ message: "suggestion is posted.." });
  } catch (error) {
    return res.status(404).json({ message: error.message, error });
  }
});

// routes/offerRoutes.js
router.post("/validate-offer", async (req, res) => {
  try {
    const { code, cart } = req.body;

    if (!code || !cart || !Array.isArray(cart.items)) {
      return res
        .status(400)
        .json({ message: "Code and cart items are required" });
    }

    const offer = await Offer.findOne({
      code: code.trim(),
      adminAccept: true,
      display: true,
      endDate: { $gte: new Date() },
    });

    if (!offer) {
      return res.status(404).json({ message: "Invalid or expired offer code" });
    }

    const matchedItems = cart.items.filter((item) => {
      if (offer.items?.length > 0) {
        return offer.items.some((id) => id.toString() === item.productId);
      } else if (offer.subcategoryId) {
        return item.subcategoryId === offer.subcategoryId.toString();
      } else if (offer.categoryId) {
        return item.categoryId === offer.categoryId.toString();
      }
      return true; // Global offer
    });

    if (matchedItems.length === 0) {
      return res.status(200).json({
        valid: false,
        message: "Offer does not apply to any items in your cart.",
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Offer applied successfully!",
      _id: offer.id,
      name: offer.name,
      code: offer.code,
      offerType: offer.offerType,
      discountValue: offer.discountValue,
      appliesTo: matchedItems,
    });
  } catch (err) {
    console.error("Error in validate-offer:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
