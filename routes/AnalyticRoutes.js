const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Adjust path if necessary
const moment = require("moment");
const historyLogRecorder = require("../utils/historyLogRecorder.js");

// Get analytics data for orders
router.get("/order-analytics", async (req, res) => {
  const { timeframe = "daily" } = req.query; // Default timeframe
  try {
    const now = moment();
    let startDate;
    const validTimeframes = ["daily", "weekly", "monthly"];

    if (!validTimeframes.includes(timeframe)) {
      historyLogRecorder(
        req,
        "Order",
        "READ",
        [],
        `Attempted order analytics request with invalid timeframe: ${timeframe}`
      );
      return res.status(400).json({
        error:
          "Invalid timeframe specified. Use 'daily', 'weekly', or 'monthly'.",
      });
    }

    // Set date range based on timeframe
    switch (timeframe) {
      case "daily":
        startDate = moment().subtract(6, "days").startOf("day");
        break;
      case "weekly":
        startDate = moment().subtract(3, "weeks").startOf("week");
        break;
      case "monthly":
        startDate = moment().subtract(11, "months").startOf("month");
        break;
      // No default needed due to validation above
    }

    // Get orders within date range
    const orders = await Order.find({
      time: { $gte: startDate.toDate(), $lte: now.toDate() },
      // Consider adding .lean() if only reading data: .lean()
    });

    // Process data based on timeframe
    let analyticsData = [];
    if (timeframe === "daily") {
      // ... (daily processing logic) ...
      for (let i = 0; i < 7; i++) {
        const date = moment().subtract(i, "days");
        const dayOrders = orders.filter(
          (order) => moment(order.time).isSame(date, "day") // More reliable date comparison
        );
        analyticsData.unshift({
          date: date.format("ddd"), // Consider full date for clarity if needed: date.format("YYYY-MM-DD (ddd)")
          orders: dayOrders.length,
          totalPurchase: dayOrders.reduce(
            (sum, order) =>
              sum +
              parseFloat(String(order.total || "0").replace(/[^0-9.-]+/g, "")),
            0
          ), // Safer parsing
        });
      }
    } else if (timeframe === "weekly") {
      // ... (weekly processing logic) ...
      for (let i = 0; i < 4; i++) {
        const weekStart = moment().subtract(i, "weeks").startOf("week");
        const weekEnd = weekStart.clone().endOf("week");
        const weekOrders = orders.filter(
          (order) =>
            moment(order.time).isBetween(weekStart, weekEnd, "day", "[]") // Inclusive, compare by day
        );
        analyticsData.unshift({
          week: `Week ${moment().week() - i}`, // Display actual week number
          orders: weekOrders.length,
          totalPurchase: weekOrders.reduce(
            (sum, order) =>
              sum +
              parseFloat(String(order.total || "0").replace(/[^0-9.-]+/g, "")),
            0
          ),
        });
      }
    } else if (timeframe === "monthly") {
      // ... (monthly processing logic) ...
      for (let i = 0; i < 12; i++) {
        const monthStart = moment().subtract(i, "months").startOf("month");
        const monthEnd = monthStart.clone().endOf("month");
        const monthOrders = orders.filter((order) =>
          moment(order.time).isBetween(monthStart, monthEnd, "day", "[]")
        );
        analyticsData.unshift({
          month: monthStart.format("MMM YYYY"), // Include year
          orders: monthOrders.length,
          totalPurchase: monthOrders.reduce(
            (sum, order) =>
              sum +
              parseFloat(String(order.total || "0").replace(/[^0-9.-]+/g, "")),
            0
          ),
        });
      }
    }

    historyLogRecorder(
      req,
      "Order",
      "READ",
      [], // Not targeting specific orders
      `Retrieved order analytics data. Timeframe: ${timeframe}. Records processed: ${orders.length}.`
    );

    res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    historyLogRecorder(
      req,
      "Order",
      "READ",
      [],
      `Error retrieving order analytics (Timeframe: ${timeframe}): ${error.message}`
    );
    res.status(500).json({ error: "Failed to fetch order analytics" });
  }
});

// Get meal type analytics
router.get("/mealtype-analytics", async (req, res) => {
  const { timeframe = "Today" } = req.query; // Default timeframe
  try {
    const now = moment();
    let startDate;
    const validTimeframes = ["Today", "This Week", "This Month"]; // Match expected values

    if (!validTimeframes.includes(timeframe)) {
      historyLogRecorder(
        req,
        "Order",
        "READ",
        [],
        `Attempted meal type analytics request with invalid timeframe: ${timeframe}`
      );
      return res.status(400).json({
        error:
          "Invalid timeframe specified. Use 'Today', 'This Week', or 'This Month'.",
      });
    }

    // Set date range based on timeframe
    switch (timeframe) {
      case "Today":
        startDate = moment().startOf("day");
        break;
      case "This Week":
        startDate = moment().startOf("week");
        break;
      case "This Month":
        startDate = moment().startOf("month");
        break;
      // No default needed due to validation
    }

    // Get orders within date range
    const orders = await Order.find({
      time: { $gte: startDate.toDate(), $lte: now.toDate() },
      // Consider adding .lean()
    }).select("mealType quantity"); // Select only needed fields

    // Group orders by meal type and count quantity
    const mealTypeCounts = orders.reduce((acc, order) => {
      const type = order.mealType || "Unknown"; // Handle missing mealType
      const quantity =
        typeof order.quantity === "number" && order.quantity > 0
          ? order.quantity
          : 0; // Ensure quantity is valid
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += quantity;
      return acc;
    }, {});

    // Convert to array format expected by frontend
    const analyticsData = Object.entries(mealTypeCounts).map(
      ([category, count]) => ({
        category,
        count,
      })
    );

    historyLogRecorder(
      req,
      "Order",
      "READ",
      [],
      `Retrieved meal type analytics. Timeframe: ${timeframe}. Records processed: ${orders.length}. Categories found: ${analyticsData.length}.`
    );

    res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching meal type analytics:", error);
    historyLogRecorder(
      req,
      "Order",
      "READ",
      [],
      `Error retrieving meal type analytics (Timeframe: ${timeframe}): ${error.message}`
    );
    res.status(500).json({ error: "Failed to fetch meal type analytics" });
  }
});

// Get today's, weekly, and monthly orders and revenue
router.get("/order-summary", async (req, res) => {
  try {
    const now = moment().toDate(); // Use Date object for Mongoose query
    const startOfToday = moment().startOf("day").toDate();
    const startOfWeek = moment().startOf("week").toDate();
    const startOfMonth = moment().startOf("month").toDate();

    // Fetch orders for different periods concurrently
    const [totalOrders, todayOrders, weeklyOrders, monthlyOrders] =
      await Promise.all([
        Order.find({}, "total").lean(), // Fetch all orders, only total needed
        Order.find({ time: { $gte: startOfToday, $lte: now } }, "total").lean(),
        Order.find({ time: { $gte: startOfWeek, $lte: now } }, "total").lean(),
        Order.find({ time: { $gte: startOfMonth, $lte: now } }, "total").lean(),
      ]);

    // Calculate total revenue safely
    const calculateRevenue = (orders) =>
      orders.reduce(
        (sum, order) =>
          sum +
          parseFloat(String(order.total || "0").replace(/[^0-9.-]+/g, "")),
        0
      );

    const summary = {
      allTime: {
        orders: totalOrders.length,
        revenue: calculateRevenue(totalOrders),
      },
      today: {
        orders: todayOrders.length,
        revenue: calculateRevenue(todayOrders),
      },
      thisWeek: {
        orders: weeklyOrders.length,
        revenue: calculateRevenue(weeklyOrders),
      },
      thisMonth: {
        orders: monthlyOrders.length,
        revenue: calculateRevenue(monthlyOrders),
      },
    };

    historyLogRecorder(
      req,
      "Order",
      "READ",
      [],
      `Retrieved order summary. Today: ${summary.today.orders}, Week: ${summary.thisWeek.orders}, Month: ${summary.thisMonth.orders}, All-Time: ${summary.allTime.orders} orders.`
    );

    res.json(summary);
  } catch (error) {
    console.error("Error fetching order summary:", error);
    historyLogRecorder(
      req,
      "Order",
      "READ",
      [],
      `Error retrieving order summary: ${error.message}`
    );
    res.status(500).json({ error: "Failed to fetch order summary" });
  }
});

// Get total users and unique emails
router.get("/user-summary", async (req, res) => {
  try {
    // Using distinct emails from Orders as a proxy for unique users who ordered
    const uniqueUsers = await Order.distinct("email");

    const summary = {
      totalUsers: uniqueUsers.length, // Length of the distinct email array
    };

    historyLogRecorder(
      req,
      "Order", // Entity is Order as we query the Order collection
      "READ",
      [],
      `Retrieved user summary (distinct emails from orders). Total unique users: ${summary.totalUsers}.`
    );

    res.json(summary);
  } catch (error) {
    console.error("Error fetching user summary:", error);
    historyLogRecorder(
      req,
      "Order", // Or "User" if that's the intended source
      "READ",
      [],
      `Error retrieving user summary: ${error.message}`
    );
    res.status(500).json({ error: "Failed to fetch user summary" });
  }
});

// Get average order value for today, this week, and overall
router.get("/average-order-value", async (req, res) => {
  try {
    const now = moment().toDate();
    const startOfToday = moment().startOf("day").toDate();
    const startOfWeek = moment().startOf("week").toDate();
    const startOfMonth = moment().startOf("month").toDate();

    // Fetch orders concurrently, only selecting total
    const [totalOrders, todayOrders, weeklyOrders, monthlyOrders] =
      await Promise.all([
        Order.find({}, "total").lean(),
        Order.find({ time: { $gte: startOfToday, $lte: now } }, "total").lean(),
        Order.find({ time: { $gte: startOfWeek, $lte: now } }, "total").lean(),
        Order.find({ time: { $gte: startOfMonth, $lte: now } }, "total").lean(),
      ]);

    // Calculate Average Order Value safely
    const calculateAOV = (orders) => {
      if (!orders || orders.length === 0) return 0;
      const revenue = orders.reduce(
        (sum, order) =>
          sum +
          parseFloat(String(order.total || "0").replace(/[^0-9.-]+/g, "")),
        0
      );
      return (revenue / orders.length).toFixed(2); // Format to 2 decimal places
    };

    const aovSummary = {
      todayAOV: parseFloat(calculateAOV(todayOrders)), // Store as number
      thisWeekAOV: parseFloat(calculateAOV(weeklyOrders)),
      thisMonthAOV: parseFloat(calculateAOV(monthlyOrders)),
      allTimeAOV: parseFloat(calculateAOV(totalOrders)),
    };

    historyLogRecorder(
      req,
      "Order",
      "READ",
      [],
      `Retrieved average order value summary. Today: ${aovSummary.todayAOV}, Week: ${aovSummary.thisWeekAOV}, Month: ${aovSummary.thisMonthAOV}, All-Time: ${aovSummary.allTimeAOV}.`
    );

    res.json(aovSummary);
  } catch (error) {
    console.error("Error fetching average order value:", error);
    historyLogRecorder(
      req,
      "Order",
      "READ",
      [],
      `Error retrieving average order value summary: ${error.message}`
    );
    res.status(500).json({ error: "Failed to fetch AOV data" });
  }
});
module.exports = router;
