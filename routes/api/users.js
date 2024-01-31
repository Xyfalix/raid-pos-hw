const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/users");
const {checkToken} = require("../../config/checkToken")

// POST /api/users
router.get("/", checkToken, usersCtrl.index);
router.post("/", usersCtrl.create);
router.post("/login", usersCtrl.login);

module.exports = router;