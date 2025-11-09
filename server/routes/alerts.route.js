const express = require("express");
const { sendSOSAlert } = require("../controller/alerts.controller");

const router = express.Router();

router.post("/sos", sendSOSAlert);

module.exports = router;


