// // routes/offers.js
// const express = require('express');
// const router = express.Router();
// const Tiffin = require('../models/Tiffin');
// const moment = require('moment');

// // Get all offers for a tiffin
// router.get('/:mail/offers', async (req, res) => {
//     try {
//         const tiffin = await Tiffin.findOne({ ownerMail: req.params.mail });
//         if (!tiffin) {
//             return res.status(404).json({ message: 'tiffin not found' });
//         }
//         res.json(tiffin.offers);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Create a new offer
// router.post('/:mail/offers', async (req, res) => {
//     try {
//         const tiffin = await Tiffin.findOne({ ownerMail: req.params.mail });
//         if (!tiffin) {
//             return res.status(404).json({ message: 'tiffin not found' });
//         }

//         const {
//             name,
//             code,
//             discount,
//             scope,
//             mealTypes,
//             mealPlans,
//             startDate,
//             endDate,
//             type
//         } = req.body;

//         // Validate dates
//         if (moment(endDate).isBefore(startDate)) {
//             return res.status(400).json({ message: 'End date must be after start date' });
//         }

//         // Create new offer object
//         const newOffer = {
//             name,
//             code: code.toUpperCase(),
//             discount,
//             scope,
//             type,
//             mealTypes: scope === 'MealType-specific' ? mealTypes : [],
//             mealPlans: scope === 'MealPlan-Specific' ? mealPlans : [],
//             startDate,
//             endDate,
//             active: true,
//             createdAt: Date.now(),
//             updatedAt: Date.now()
//         };

//         // Check for duplicate code
//         const existingOffer = tiffin.offers.find(offer =>
//             offer.code === newOffer.code
//         );
//         if (existingOffer) {
//             return res.status(400).json({ message: 'Offer code already exists' });
//         }

//         tiffin.offers.push(newOffer);
//         await tiffin.save();

//         res.status(201).json(newOffer);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Update an offer
// router.put('/:mail/offers/:offerId', async (req, res) => {
//     try {
//         const tiffin = await Tiffin.findOne({ ownerMail: req.params.mail });
//         if (!tiffin) {
//             return res.status(404).json({ message: 'tiffin not found' });
//         }

//         const offerIndex = tiffin.offers.findIndex(
//             offer => offer._id.toString() === req.params.offerId
//         );

//         if (offerIndex === -1) {
//             return res.status(404).json({ message: 'Offer not found' });
//         }

//         const {
//             name,
//             code,
//             discount,
//             scope,
//             mealTypes,
//             mealPlans,
//             startDate,
//             endDate,
//             active,
//             type
//         } = req.body;

//         // Validate dates
//         if (moment(endDate).isBefore(startDate)) {
//             return res.status(400).json({ message: 'End date must be after start date' });
//         }

//         // Check for duplicate code if code is being changed
//         if (code !== tiffin.offers[offerIndex].code) {
//             const existingOffer = tiffin.offers.find(offer =>
//                 offer.code === code.toUpperCase() &&
//                 offer._id.toString() !== req.params.offerId
//             );
//             if (existingOffer) {
//                 return res.status(400).json({ message: 'Offer code already exists' });
//             }
//         }

//         // Update offer
//         tiffin.offers[offerIndex] = {
//             ...tiffin.offers[offerIndex].toObject(),
//             name,
//             code: code.toUpperCase(),
//             discount,
//             scope,
//             type,
//             mealTypes: scope === 'MealType-specific' ? mealTypes : [],
//             mealPlans: scope === 'MealPlan-Specific' ? mealPlans : [],
//             startDate,
//             endDate,
//             active,
//             updatedAt: Date.now()
//         };

//         await tiffin.save();
//         res.json(tiffin.offers[offerIndex]);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Delete an offer
// router.delete('/:mail/offers/:offerId', async (req, res) => {
//     try {
//         const tiffin = await Tiffin.findOne({ ownerMail: req.params.mail });
//         if (!tiffin) {
//             return res.status(404).json({ message: 'tiffin not found' });
//         }

//         const offerIndex = tiffin.offers.findIndex(
//             offer => offer._id.toString() === req.params.offerId
//         );

//         if (offerIndex === -1) {
//             return res.status(404).json({ message: 'Offer not found' });
//         }

//         tiffin.offers.splice(offerIndex, 1);
//         await tiffin.save();

//         res.json({ message: 'Offer deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.patch('/:mail/offers/update-status', async (req, res) => {
//     try {
//         const tiffin = await Tiffin.findOne({ ownerMail: req.params.mail });
//         if (!tiffin) {
//             return res.status(404).json({ message: 'Tiffin not found' });
//         }

//         const currentDate = moment();

//         // Update each offer's active status
//         tiffin.offers.forEach(offer => {
//             const startDate = moment(offer.startDate);
//             const endDate = moment(offer.endDate);

//             // Check if today's date is within the offer's start and end date
//             offer.active = currentDate.isBetween(startDate, endDate, null, '[]');
//         });

//         await tiffin.save();
//         res.json({ message: 'Offer statuses updated successfully', offers: tiffin.offers });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // // Toggle offer active status
// // router.patch('/:mail/offers/:offerId/toggle', async (req, res) => {
// //     try {
// //         const tiffin = await Tiffin.findOne({ ownerMail: req.params.mail });
// //         if (!tiffin) {
// //             return res.status(404).json({ message: 'tiffin not found' });
// //         }

// //         const offer = tiffin.offers.id(req.params.offerId);
// //         if (!offer) {
// //             return res.status(404).json({ message: 'Offer not found' });
// //         }

// //         offer.active = !offer.active;
// //         offer.updatedAt = Date.now();

// //         await tiffin.save();
// //         res.json(offer);
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // });

// module.exports = router;

// routes/offers.js

const express = require("express");
const router = express.Router();
const Tiffin = require("../models/Tiffin"); // Adjust path if necessary
const moment = require("moment");
const historyLogRecorder = require("../utils/historyLogRecorder.js");
const mongoose = require("mongoose"); // Import mongoose for ID validation
const { authenticateToken } = require("../controller/DashboardToken/JWT");
const Notify = require("../models/logs/notify");
// Get all offers for a tiffin
// router.get("/mail/offers",authenticateToken, async (req, res) => {
//   const ownerMail = req.user.email;
//   try {
//     const tiffin = await Tiffin.findOne({ ownerMail: ownerMail }).lean();
//     if (!tiffin) {
//       historyLogRecorder(
//         req,
//         "Tiffin",
//         "READ",
//         [],
//         `Attempted to get offers for non-existent Tiffin (Owner: ${ownerMail})`
//       );
//       return res
//         .status(404)
//         .json({ message: "Tiffin service not found for this owner." });
//     }
//     historyLogRecorder(
//       req,
//       "Tiffin",
//       "READ",
//       [tiffin._id],
//       `Retrieved all offers (${tiffin.offers?.length || 0} found) for Tiffin '${
//         tiffin.tiffinName || tiffin._id
//       }' (Owner: ${ownerMail})`
//     );
//     res.json(tiffin.offers || []); // Return offers array or empty array
//   } catch (error) {
//     historyLogRecorder(
//       req,
//       "Tiffin",
//       "READ",
//       [],
//       `Error retrieving offers for Tiffin (Owner: ${ownerMail}): ${error.message}`
//     );
//     res.status(500).json({ message: error.message });
//   }
// });

router.get("/mail/offers", authenticateToken, async (req, res) => {
  const ownerMail = req.user.email;
  try {
    const tiffin = await Tiffin.findOne({ ownerMail: ownerMail }).lean();

    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Attempted to get offers for non-existent Tiffin (Owner: ${ownerMail})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }

    const acceptedOffers = tiffin.offers.filter(
      (offer) => offer.accept === true
    );

    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [tiffin._id],
      `Retrieved all accepted offers (${
        acceptedOffers.length || 0
      } found) for Tiffin '${
        tiffin.tiffinName || tiffin._id
      }' (Owner: ${ownerMail})`
    );

    res.json(acceptedOffers || []);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [],
      `Error retrieving offers for Tiffin (Owner: ${ownerMail}): ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
});

router.get("/mail/offers/admin", async (req, res) => {
  try {
    // Modify the query to filter offers where 'accept' is false
    const tiffin = await Tiffin.find({ "offers.accept": false }).select(
      "offers"
    );

    if (!tiffin || tiffin.length === 0) {
      // Check for empty array as well
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Admin is trying to read all tiffin offers, specifically those not yet accepted.`
      );
      return res
        .status(404)
        .json({
          message: "No unaccepted offers found or Tiffin service not found.",
        });
    }

    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      tiffin.map((item) => item._id),
      `Retrieved unaccepted offers for Tiffin services.`
    );

    res.json(tiffin);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [],
      `Error retrieving unaccepted offers for Tiffin: ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
});

router.put("/mail/admin/accept/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tiffin = await Tiffin.findOneAndUpdate(
      { "offers._id": id },
      { $set: { "offers.$.accept": true } },
      { new: true, runValidators: true }
    );

    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to accept offer for non-existent offer ID: ${id}`
      );
      return res
        .status(404)
        .json({
          message:
            "Offer not found or Tiffin service not found for this offer.",
        });
    }

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffin._id],
      `Offer with ID ${id} accepted by Admin for Tiffin ${tiffin._id}`
    );
    const newNotify = new Notify({
      timestamp: new Date(),
      level: "Offer is Accepted by Admin ",
      type: ["tiffin"],
      message: `A Offer is Accepted by the admin id:${tiffin?._id}. Please check it.`,
      metadata: {
        category: ["Admin", "Tiffin"],
        isViewed: false,
        isAccept: false,
        isReject: false,
        orderId: tiffin._id.toString(),
      },
    });
    await newNotify.save();
    res.json(tiffin);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [],
      `Error accepting offer with ID ${id} for Tiffin: ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
});

router.get("/tiffin/offers/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const tiffin = await Tiffin.findById(id).lean(); // Pass id directly, and added .lean() for performance
    console.log(tiffin);

    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "READ",
        [],
        `Attempted to get offers for non-existent tiffin ID: ${id}` // Added id to log for better debugging
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }

    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [tiffin._id],
      `Retrieved all offers (${tiffin.offers?.length || 0} found) for Tiffin '${
        tiffin.tiffinName || tiffin._id
      }')`
    );

    const acceptedOffers = tiffin.offers.filter(
      (offer) => offer.accept === true
    );
    res.json(acceptedOffers || []);
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "READ",
      [],
      `Error retrieving offers for Tiffin ID: ${req.params.id}. Error: ${error.message}` // Added id and error message for better logging
    );
    res.status(500).json({ message: error.message });
  }
});

// Create a new offer
router.post("/mail/offers", authenticateToken, async (req, res) => {
  const ownerMail = req.user.email;
  let tiffinId = null;
  let offerCode = "Unknown";
  try {
    const tiffin = await Tiffin.findOne({ ownerMail: ownerMail });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE", // Action is UPDATE because we modify the Tiffin doc
        [],
        `Attempted to create offer for non-existent Tiffin (Owner: ${ownerMail})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id; // Get Tiffin ID for logging

    const {
      name,
      code,
      discount,
      scope,
      mealTypes,
      mealPlans,
      startDate,
      endDate,
      type,
    } = req.body;

    // Basic Validation
    if (
      !name ||
      !code ||
      discount === undefined ||
      !scope ||
      !type ||
      !startDate ||
      !endDate
    ) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to create offer for Tiffin ID ${tiffinId} with missing required fields.`
      );
      return res.status(400).json({
        message:
          "Missing required offer fields (name, code, discount, scope, type, startDate, endDate).",
      });
    }
    offerCode = code.toUpperCase(); // Store for potential error logs

    // Validate dates
    if (moment(endDate).isBefore(startDate)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to create offer '${name}' (Code: ${offerCode}) for Tiffin ID ${tiffinId} with end date before start date.`
      );
      return res
        .status(400)
        .json({ message: "End date must be on or after the start date" });
    }

    // Check for duplicate code within this Tiffin's offers
    const existingOffer = tiffin.offers.find(
      (offer) => offer.code === offerCode
    );
    if (existingOffer) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to create offer for Tiffin ID ${tiffinId} with duplicate code '${offerCode}'.`
      );
      return res.status(400).json({
        message: `Offer code '${offerCode}' already exists for this Tiffin service.`,
      });
    }

    // Create new offer object (Mongoose assigns _id upon push)
    const newOfferData = {
      name,
      code: offerCode,
      discount,
      scope,
      type,
      mealTypes: scope === "MealType-specific" ? mealTypes || [] : [],
      mealPlans: scope === "MealPlan-Specific" ? mealPlans || [] : [],
      startDate: moment(startDate).toDate(), // Store as Date objects
      endDate: moment(endDate).toDate(),
      active: moment().isBetween(startDate, endDate, null, "[]"), // Initial active status
      // createdAt and updatedAt are managed by timestamps: true in schema usually
    };

    tiffin.offers.push(newOfferData);
    await tiffin.save();

    // Find the newly added offer to get its _id for the response/log (most recent one added)
    const addedOffer = tiffin.offers[tiffin.offers.length - 1];

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Created new offer '${addedOffer.name}' (Code: ${
        addedOffer.code
      }, OfferID: ${addedOffer._id}) within Tiffin '${
        tiffin.tiffinName || tiffinId
      }' (ID: ${tiffinId})`
    );

    const newNotify = new Notify({
      timestamp: new Date(),
      level: "Offer is Accepted by Admin ",
      type: ["tiffin", "admin"],
      message: `A Offer is Created please check it to update  id:${tiffin?._id}. Please check it.`,
      metadata: {
        category: ["Admin", "Tiffin"],
        isViewed: false,
        isAccept: false,
        isReject: false,
        orderId: tiffin._id.toString(),
      },
    });
    await newNotify.save();

    res.status(201).json(addedOffer); // Return the newly created offer object with its _id
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error creating offer (Code: ${offerCode}) for Tiffin (Owner: ${ownerMail}): ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
});

// Update an offer
router.put("/mail/offers/:offerId", authenticateToken, async (req, res) => {
  const ownerMail = req.user.email;

  const offerId = req.params.offerId;
  let tiffinId = null;
  let offerName = "Unknown"; // For logging context
  try {
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted offer update with invalid Offer ID format: ${offerId} (Owner: ${ownerMail})`
      );
      return res.status(400).json({ message: "Invalid offer ID format." });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: ownerMail });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to update offer for non-existent Tiffin (Owner: ${ownerMail})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;
    console.log(tiffin);
    console.log(tiffin.offers);
    const offerIndex = tiffin.offers.findIndex(
      (offer) => offer._id.toString() === offerId
    );

    if (offerIndex === -1) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to update non-existent offer ID ${offerId} within Tiffin ID ${tiffinId}`
      );
      return res
        .status(404)
        .json({ message: "Offer not found within this Tiffin service." });
    }
    offerName = tiffin.offers[offerIndex].name; // Store name for logging
    const {
      name,
      code,
      discount,
      scope,
      mealTypes,
      mealPlans,
      startDate,
      endDate,
      active,
      type,
    } = req.body;
    console.log(req.body, "this is body");
    // Basic Validation for required fields during update
    if (
      name === undefined ||
      code === undefined ||
      discount === undefined ||
      scope === undefined ||
      type === undefined ||
      startDate === undefined ||
      endDate === undefined ||
      active === undefined
    ) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to update offer '${offerName}' (OfferID: ${offerId}) for Tiffin ID ${tiffinId} with missing required fields.`
      );
      return res.status(400).json({
        message:
          "Missing required offer fields for update (name, code, discount, scope, type, startDate, endDate, active).",
      });
    }
    const newCode = code.toUpperCase();

    // Validate dates
    if (moment(endDate).isBefore(startDate)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to update offer '${offerName}' (OfferID: ${offerId}) for Tiffin ID ${tiffinId} with end date before start date.`
      );
      return res
        .status(400)
        .json({ message: "End date must be on or after the start date" });
    }

    // Check for duplicate code if code is being changed
    if (newCode !== tiffin.offers[offerIndex].code) {
      const existingOffer = tiffin.offers.find(
        (offer) => offer.code === newCode && offer._id.toString() !== offerId
      );
      if (existingOffer) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Attempted to update offer '${offerName}' (OfferID: ${offerId}) for Tiffin ID ${tiffinId} with duplicate code '${newCode}'.`
        );
        return res.status(400).json({
          message: `Offer code '${newCode}' already exists for this Tiffin service.`,
        });
      }
    }

    // Update offer directly in the array
    tiffin.offers[offerIndex].name = name;
    tiffin.offers[offerIndex].code = newCode;
    tiffin.offers[offerIndex].discount = discount;
    tiffin.offers[offerIndex].scope = scope;
    tiffin.offers[offerIndex].type = type;
    tiffin.offers[offerIndex].mealTypes =
      scope === "MealType-specific" ? mealTypes || [] : [];
    tiffin.offers[offerIndex].mealPlans =
      scope === "MealPlan-Specific" ? mealPlans || [] : [];
    tiffin.offers[offerIndex].startDate = moment(startDate).toDate();
    tiffin.offers[offerIndex].endDate = moment(endDate).toDate();
    tiffin.offers[offerIndex].active = active; // Use the provided active status
    tiffin.offers[offerIndex].updatedAt = Date.now(); // Manually update if timestamps not enabled on subdoc

    await tiffin.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      [tiffinId],
      `Updated offer '${
        tiffin.offers[offerIndex].name
      }' (OfferID: ${offerId}) within Tiffin '${
        tiffin.tiffinName || tiffinId
      }' (ID: ${tiffinId})`
    );

    res.json(tiffin.offers[offerIndex]); // Return the updated offer subdocument
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error updating offer '${offerName}' (OfferID: ${offerId}) for Tiffin (Owner: ${ownerMail}): ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
});

// Delete an offer
router.delete("/mail/offers/:offerId", authenticateToken, async (req, res) => {
  const ownerMail = req.user.email;
  const offerId = req.params.offerId;
  let tiffinId = null;
  let offerName = "Unknown";
  try {
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE", // Action is UPDATE as we modify the Tiffin doc
        [],
        `Attempted offer deletion with invalid Offer ID format: ${offerId} (Owner: ${ownerMail})`
      );
      return res.status(400).json({ message: "Invalid offer ID format." });
    }

    const tiffin = await Tiffin.findOne({ ownerMail: ownerMail });
    if (!tiffin) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [],
        `Attempted to delete offer for non-existent Tiffin (Owner: ${ownerMail})`
      );
      return res
        .status(404)
        .json({ message: "Tiffin service not found for this owner." });
    }
    tiffinId = tiffin._id;

    const offerIndex = tiffin.offers.findIndex(
      (offer) => offer._id.toString() === offerId
    );

    if (offerIndex === -1) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        [tiffinId],
        `Attempted to delete non-existent offer ID ${offerId} within Tiffin ID ${tiffinId}`
      );
      return res
        .status(404)
        .json({ message: "Offer not found within this Tiffin service." });
    }
    offerName = tiffin.offers[offerIndex].name; // Get name before splicing

    // Remove the offer subdocument
    tiffin.offers.splice(offerIndex, 1);
    await tiffin.save();

    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE", // Action is UPDATE as we modify the Tiffin doc
      [tiffinId],
      `Deleted offer '${offerName}' (OfferID: ${offerId}) from Tiffin '${
        tiffin.tiffinName || tiffinId
      }' (ID: ${tiffinId})`
    );

    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    historyLogRecorder(
      req,
      "Tiffin",
      "UPDATE",
      tiffinId ? [tiffinId] : [],
      `Error deleting offer '${offerName}' (OfferID: ${offerId}) for Tiffin (Owner: ${ownerMail}): ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
});

router.patch(
  "/mail/offers/update-status",
  authenticateToken,
  async (req, res) => {
    const ownerMail = req.user.email;
    let tiffinId = null;
    try {
      const tiffin = await Tiffin.findOne({ ownerMail: ownerMail });
      if (!tiffin) {
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [],
          `Attempted bulk offer status update for non-existent Tiffin (Owner: ${ownerMail})`
        );
        return res.status(404).json({ message: "Tiffin not found" });
      }
      tiffinId = tiffin._id;

      const currentDate = moment();
      let changesMade = 0;

      // Update each offer's active status based on dates
      tiffin.offers.forEach((offer) => {
        const startDate = moment(offer.startDate);
        const endDate = moment(offer.endDate);
        const shouldBeActive = currentDate.isBetween(
          startDate,
          endDate,
          "day",
          "[]"
        ); // Inclusive check by day

        // Only mark as changed if the status actually flips
        if (offer.active !== shouldBeActive) {
          offer.active = shouldBeActive;
          offer.updatedAt = Date.now(); // Manually update if timestamps not enabled on subdoc
          changesMade++;
        }
      });

      // Only save if any status actually changed
      if (changesMade > 0) {
        await tiffin.save();
        historyLogRecorder(
          req,
          "Tiffin",
          "UPDATE",
          [tiffinId],
          `Bulk updated active status for offers within Tiffin '${
            tiffin.tiffinName || tiffinId
          }' (ID: ${tiffinId}). ${changesMade} statuses changed.`
        );
        res.json({
          message: `Offer statuses updated successfully (${changesMade} changed)`,
          offers: tiffin.offers,
        });
      } else {
        historyLogRecorder(
          req,
          "Tiffin",
          "READ", // Arguably a read operation if no changes were made
          [tiffinId],
          `Checked offer statuses for Tiffin '${
            tiffin.tiffinName || tiffinId
          }' (ID: ${tiffinId}). No status changes required.`
        );
        res.json({
          message: "Offer statuses checked, no updates required.",
          offers: tiffin.offers,
        });
      }
    } catch (error) {
      historyLogRecorder(
        req,
        "Tiffin",
        "UPDATE",
        tiffinId ? [tiffinId] : [],
        `Error during bulk offer status update for Tiffin (Owner: ${ownerMail}): ${error.message}`
      );
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
