const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const  {sendAdminTiffinBookingConfirmation}=require("../CustomerNotification/DiningEmailNotify")
const moment = require("moment");
const mongoose = require("mongoose");

const userorder=require("../../models/UserOrderTakeaway")

const connectToMongoDB = require("../../config/database.config");
const Notify = require("../../models/logs/notify");
router.post("/saveOrders", async (req, res) => {
  try {
    const orderData = req.body;
    console.log(orderData, "oderbody");
    const savedOrder = await Order.create(orderData);
    const newNotify = new Notify({
      timestamp: new Date(),
      level: "According to Tiffin Order",
      type: ["admin", "restaurant", "tiffin"],
      message: "A New Tiffin is booking is there check it once..",
      metadata: {
        category: ["tiffin"],
        isViewed: false,
        isAccept: false,
        isReject: true,
      },
    });
    console.log(savedOrder,orderData)
    await newNotify.save();
sendAdminTiffinBookingConfirmation(
  savedOrder.customer,
  savedOrder.email,
  savedOrder?._id,
  savedOrder?.time || savedOrder?.startDate,
  savedOrder?.mealType,
  savedOrder?.total,
  savedOrder?.address,
  savedOrder?.phone?.fullNumber
);
    res.status(201).json({ message: "Order saved successfully", savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    // const orders = req.body;
    const deleteOrders = await Order.deleteMany();
    res
      .status(201)
      .json({ message: "Orders delete successfully", deleteOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save orders" });
  }
});

// Route to fetch all orders
router.get("/getOrdersforHistory/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email: email });
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Route to fetch all orders

router.get("/getOrders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/revenue", async (req, res) => {
  try {
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$total" } },
        },
      },
    ]);

    const totalRevenue = revenueResult[0] ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({ totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate revenue" });
  }
});


module.exports = router;
