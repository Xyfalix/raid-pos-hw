const express = require("express");
const router = express.Router();
const fruitsCtrl = require("../../controllers/api/fruits");
const { checkToken, checkAdminRole } = require("../../config/checkToken");

router.get("/", checkToken, checkAdminRole, fruitsCtrl.getAllFruits);
router.post("/", checkToken, checkAdminRole, fruitsCtrl.addFruit);

module.exports = router;
