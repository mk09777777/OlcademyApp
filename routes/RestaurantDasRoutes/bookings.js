const express = require("express");
const router = express.Router();
const Booking = require("../../models/RestaurantsDasModel/Booking");
const Notify = require("../../models/logs/notify");
const {
  sendConfirmationEmail,
  sendCancelationEmail,
  sendPendingConfirmationEmail,
} = require("../../routes/CustomerNotification/DiningEmailNotify");
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
//changes here pratik
router.post("/create", async (req, res) => {
  try {
    const firmId = req.query.id;
    const userId = req.session.user.id;
    if(!userId){
      return res.status(404).json({message:"Un authorization"});
    }
    const {
      date,
      timeSlot,
      guests,
      meal,
      offerId,
      username,
      email,
      mobileNumber,

    } = req.body;
    const newBooking = new Booking({
      ScheduleDate:date,
      orderDate:Date.now(),
      timeSlot,
      guests,
      meal,
      offerId: offerId || null,
      firm: firmId,
      username,
      email,
      mobileNumber,
      userId,
    });
    const savedBooking = await newBooking.save();
    const newNotify = new Notify({
      timestamp: new Date(),
      level: "According to Dining",
      type: ["admin", "restaurant"],
      message: "A new dining booking has been made. Please review the details.",
      metadata: {
        category: ["dining", "Customer"],
        status: "pending",
        isViewed: false,
        isAccept: false,
        isReject: false,
      },
    });
    // const OrderHistory =
    const userEmail = email;
    const bookingDate = date;
    const offerName = offerId;
    sendPendingConfirmationEmail(
      userEmail,
      username,
      bookingDate,
      timeSlot,
      offerName
    );
    await newNotify.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({ message: error.message });
  }
});
router.get("/rest/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const Bookings = await Booking.find({
      history: false,
      firm: id,
    })
      .populate({
        path: "offerId",
        model: "RestaurantOffers",
        select: "name code offerType discountValue",
      })
      .populate({
        path: "firm",
        model: "Firm",
        select: "restaurantInfo.name",
      })
      .sort({ createdAt: -1 }); // 🔽 descending order (newest first);
    res.status(200).json(Bookings);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({ message: error.message });
  }
});


router.get("/", authenticateToken, async (req, res) => {

  try {
    const Bookings = await Booking.find({ history: false })
      .populate({
        path: "offerId",
        model: "RestaurantOffers",
        select: "name code offerType discountValue",
      })
      .populate({
        path: "firm",
        model: "Firm",
        select: "restaurantInfo.name",
      });
    res.status(200).json(Bookings);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({ message: error.message });
  }
});



router.get("/userId", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const userid = req.session.user.id || "7ee0bd23cf5e5dd298fa263";

    console.log(req.session.user);

    // Pagination parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 12; // Default to 12 bookings per page

    const skip = (page - 1) * limit;

    // Get total count of documents matching the criteria
    const totalBookings = await Booking.countDocuments({ userId: userid, history: false });
    const totalPages = Math.ceil(totalBookings / limit);

    const Bookings = await Booking.find({ userId: userid, history: false })
      .populate({
        path: "offerId",
        model: "RestaurantOffers",
        select: "name code offerType discountValue",
      })
      .populate({
        path: "firm",
        model: "Firm",
        select: "restaurantInfo.name restaurantInfo.address restaurantInfo.deliveryCity image_urls ",
      })
      .sort({ orderDate: -1 }) // Sort by orderDate in descending order (latest first)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: Bookings,
      currentPage: page,
      totalPages: totalPages,
      totalBookings: totalBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/cancel/:id", async (req, res) => {
  const { id } = req.params; 
  const { reason } = req.body; 
  try {
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "user_cancel", // Set main status to 'user_cancel'
        cancellationReason: reason, // Store the main cancellation reason
        cancelledAt: new Date(), // Store the cancellation timestamp
        $push: { // Use $push to add a new element to the subStatus array
          subStatus: {
            date: new Date(),
            statue: "user_cancel", // Use 'user_cancel' for subStatus entry
            reason: reason 
          }
        }
      },
      { new: true } 
    );

    if (!booking) {
      // historyLogRecorder(req, "Booking", "UPDATE", [], `Attempted to cancel non-existent booking ID: ${id}`);
      return res.status(404).json({ message: "Booking not found." });
    }

    // historyLogRecorder(req, "Booking", "UPDATE", [booking._id], `Booking ${id} cancelled by user. Reason: ${reason}`);

    res.status(200).json({ message: "Booking cancelled successfully.", booking });
  } catch (error) {
    // historyLogRecorder(req, "Booking", "UPDATE", [], `Error cancelling booking ${id}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

    
router.post("/:id", authenticateToken, async (req, res) => {

  const { status } = req.body;

  try {
    const { id } = req.params;


    const subStatusEntry = {
      date: new Date(),
      statue: status,
    };

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: status,
        $push: {
          subStatus: subStatusEntry,
        },
      },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Assuming offer details are accessible from the booking or offerId
    const offer = await booking.populate({
      path: "offerId",
      model: "RestaurantOffers",
      select: "name code offerType discountValue",
    });
    console.log(offer); // If offer details are in a related Offer document.
    const offerName = offer?.offerId?.name || "N/A";
    const offerCode = offer?.offerId?.code || "N/A";
    const offerPercentage = offer?.offerId?.discountValue || 0;
    const moreInfo = offer?.offerId?.description || "N/A";
    const timeSlot = booking.timeSlot;
    const bookingDate = booking.date;
    const username = booking.username;
    const userEmail = booking.email;

    if (status === "accepted") {
      await sendConfirmationEmail(
        userEmail,
        username,
        bookingDate,
        timeSlot,
        offerName,
        offerCode,
        offerPercentage,
        moreInfo
      );
      const newNotify = new Notify({
        timestamp: new Date(),
        level: "According to Dining",
        type: ["admin", "restaurant"],
        message:
          "A dining booking is accepted by admin. Please review the details.",
        metadata: {
          category: ["dining"],
          isViewed: false,
          isAccept: true,
          isReject: false,
        },
      });
      await newNotify.save();
    } else if (status === "canceled") {
      await sendCancelationEmail(
        userEmail,
        username,
        bookingDate,
        timeSlot,
        offerName,
        offerCode,
        offerPercentage,
        moreInfo
      );
      const newNotify = new Notify({
        timestamp: new Date(),
        level: "According to Dining",
        type: ["admin", "restaurnat"],
        message:
          "A dining booking is canceled by admin. Please review the details.",
        metadata: {
          category: ["dining"],
          isViewed: false,
          isAccept: false,
          isReject: true,
        },
      });
      await newNotify.save();
    }

    res.status(200).json({ message: "Updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
