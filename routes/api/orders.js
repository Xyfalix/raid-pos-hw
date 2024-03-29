const express = require("express");
const router = express.Router();
const ordersCtrl = require("../../controllers/api/orders");
const { checkToken } = require("../../config/checkToken");

router.get("/", checkToken, ordersCtrl.getAllOrders);
router.get("/getCart", checkToken, ordersCtrl.getCart);
router.patch(
  "/setItemQty/:fruitName/:itemQty",
  checkToken,
  ordersCtrl.setItemQtyInCart,
);
router.post("/:fruitName/:addedQty", checkToken, ordersCtrl.addToCart);
router.delete("/:fruitName", checkToken, ordersCtrl.deleteItemFromCart);
router.patch("/checkout", checkToken, ordersCtrl.checkout);

module.exports = router;