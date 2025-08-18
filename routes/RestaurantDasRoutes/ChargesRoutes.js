const express = require("express");
const router = express.Router();
const chargesController = require("../../controller/RestaurantDasController/ChargesControllers");
const { authenticateToken } = require("../../controller/DashboardToken/JWT");
router.post("/add-Charges/:id", authenticateToken, chargesController.addCharge);
router.get("/get-Charges/:id", chargesController.getCharges);
router.put(
  "/update-Charges/:id",
  authenticateToken,
  chargesController.updateCharge
);
router.delete(
  "/delete-Charges/:id",
  authenticateToken,
  chargesController.deleteCharge
);

router.get("/delivery-ranges/:id", chargesController.getDeliveryRanges);
router.post(
  "/delivery-ranges/:id",
  authenticateToken,
  chargesController.addDeliveryRange
);
router.put(
  "/delivery-ranges/:id",
  authenticateToken,
  chargesController.updateDeliveryRange
);
router.delete(
  "/delivery-ranges/:id",
  authenticateToken,
  chargesController.deleteDeliveryRange
);
router.patch(
  "/delivery-ranges/:id",
  authenticateToken,
  chargesController.toggleDeliveryRangeStatus
);
router.post(
  "/delivery-ranges/bulk",
  authenticateToken,
  chargesController.bulkCreateUpdateDeliveryRanges
);
router.get(
  "/delivery-ranges/calculate/:distance",
  chargesController.calculateDeliveryFee
);

module.exports = router;
