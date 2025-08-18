
const express = require("express");
const router  = express.Router();
const User    = require("../../models/user")
   
router.get("/user-count", async (req, res) => {
  const { groupBy = "daily", start, end } = req.query;

  try {
   
    const match = {};
    if (start || end) {
      match.createdAt = {};
      if (start) match.createdAt.$gte = new Date(start);
      if (end)   match.createdAt.$lte = new Date(end);
    }

    const fmt = groupBy === "monthly" ? "%Y-%m" : "%Y-%m-%d";

   
    const pipeline = [
      ...(Object.keys(match).length ? [{ $match: match }] : []),
      {
        $group: {
          _id: {                    
            $dateToString: {
              format: fmt,
              date: "$createdAt",
              timezone: "Asia/Kolkata",   
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },           
    ];

    const stats = await User.aggregate(pipeline);
    return res.json(stats);            
  } catch (err) {
    console.error("User‑count aggregation failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/user-count/daily", async (req, res) => {
    const days = parseInt(req.query.days, 10) || 7;      
    const timezone = "Asia/Kolkata";
  
    
    const end   = new Date();                               
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));              
  
    try {
      
      const raw = await User.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone }
            },
            count: { $sum: 1 },
          },
        },
      ]);
  

      const map  = new Map(raw.map(i => [i._id, i.count]));
      const full = [];
      const cursor = new Date(start);
  
      while (cursor <= end) {
        const key = cursor.toISOString().split("T")[0];         
        full.push({ date: key, count: map.get(key) || 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
  
      res.json(full);   
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal error" });
    }
  });


 
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username email role createdAt").lean(); // Only fetch required fields
    res.json(users);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
