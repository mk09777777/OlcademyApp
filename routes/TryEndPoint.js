const express = require("express");
const LogNotification = require("../logger/notification/dataLogConfig");
const router = express.Router();

const data = require("../testData/data");

router.get("/res", (req, res) => {
  LogNotification("info", data.restaurantMeta1.remarks, data.restaurantMeta1);
  LogNotification("info", data.restaurantMeta2.remarks, data.restaurantMeta2);
  LogNotification("info", data.restaurantMeta3.remarks, data.restaurantMeta3);
  LogNotification("info", data.restaurantMeta4.remarks, data.restaurantMeta4);
  LogNotification("info", data.restaurantMeta5.remarks, data.restaurantMeta5);
  res.send("Yay you got it 5!");
});

router.get("/order", (req, res) => {
  LogNotification("info", data.orderMeta1.remarks, data.orderMeta1);
  LogNotification("warn", data.orderMeta2.remarks, data.orderMeta2);
  LogNotification("info", data.orderMeta3.remarks, data.orderMeta3);
  LogNotification("warn", data.orderMeta4.remarks, data.orderMeta4);
  LogNotification("info", data.orderMeta5.remarks, data.orderMeta5);

  res.send("Yay you got it!");
});

router.get("/flag", (req, res) => {
  LogNotification("info", data.flagMeta1.remarks, data.flagMeta1);
  LogNotification("info", data.flagMeta2.remarks, data.flagMeta2);
  LogNotification("info", data.flagMeta3.remarks, data.flagMeta3);
  LogNotification("warn", data.flagMeta4.remarks, data.flagMeta4);
  LogNotification("info", data.flagMeta5.remarks, data.flagMeta5);
  res.send("Yay you got it!");
});

router.get("/comments", (req, res) => {
  LogNotification("info", data.commentsMeta1.remarks, data.commentsMeta1);
  LogNotification("info", data.commentsMeta2.remarks, data.commentsMeta2);
  LogNotification("info", data.commentsMeta3.remarks, data.commentsMeta3);
  LogNotification("info", data.commentsMeta4.remarks, data.commentsMeta4);
  LogNotification("info", data.commentsMeta5.remarks, data.commentsMeta5);
  res.send("Yay you got it!");
});

router.get("/market", (req, res) => {
  LogNotification("info", data.marketMeta1.remarks, data.marketMeta1);
  LogNotification("info", data.marketMeta2.remarks, data.marketMeta2);
  LogNotification("info", data.marketMeta3.remarks, data.marketMeta3);
  LogNotification("info", data.marketMeta4.remarks, data.marketMeta4);
  LogNotification("info", data.marketMeta5.remarks, data.marketMeta5);
  res.send("Yay you got it!");
});

router.get("/chat", (req, res) => {
  LogNotification("info", data.chatsMeta1.remarks, data.chatsMeta1);
  LogNotification("info", data.chatsMeta2.remarks, data.chatsMeta2);
  LogNotification("info", data.chatsMeta3.remarks, data.chatsMeta3);
  LogNotification("info", data.chatsMeta4.remarks, data.chatsMeta4);
  LogNotification("info", data.chatsMeta5.remarks, data.chatsMeta5);
  res.send("Yay you got it!");
});

router.get("/tiffin", (req, res) => {
  LogNotification("info", data.tiffinMeta1.remarks, data.tiffinMeta1);
  LogNotification("info", data.tiffinMeta2.remarks, data.tiffinMeta2);
  LogNotification("info", data.tiffinMeta3.remarks, data.tiffinMeta3);
  LogNotification("info", data.tiffinMeta4.remarks, data.tiffinMeta4);
  LogNotification("info", data.tiffinMeta5.remarks, data.tiffinMeta5);
  res.send("Yay you got it!");
});

router.get("/event", (req, res) => {
  LogNotification("info", data.eventMeta1.remarks, data.eventMeta1);
  LogNotification("info", data.eventMeta2.remarks, data.eventMeta2);
  LogNotification("info", data.eventMeta3.remarks, data.eventMeta3);
  LogNotification("info", data.eventMeta4.remarks, data.eventMeta4);
  LogNotification("info", data.eventMeta5.remarks, data.eventMeta5);
  res.send("Yay you got it!");
});

router.get("/modrator", (req, res) => {
  LogNotification("info", data.commentsMeta1.remarks, data.commentsMeta1);
  LogNotification("info", data.commentsMeta2.remarks, data.commentsMeta2);
  LogNotification("info", data.commentsMeta3.remarks, data.commentsMeta3);
  LogNotification("info", data.commentsMeta4.remarks, data.commentsMeta4);
  LogNotification("info", data.commentsMeta5.remarks, data.commentsMeta5);
  res.send("Yay you got it!");
});

// router.get("/system",()=>{})

module.exports = router;
