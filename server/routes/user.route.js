const express = require("express");
const { userClerkController, saveProfileController, getUserController, updateUserPersonalInfo, saveEmergencyContacts, getEmergencyContacts, getPastRecords } = require("../controller/user.controller");

const router = express.Router();

router.post("/clerk-user-webhook", userClerkController);
router.post("/save-profile", saveProfileController);
router.post("/personal-info", updateUserPersonalInfo);
router.post("/emergency-contacts", saveEmergencyContacts);
router.get("/:userId/emergency-contacts", getEmergencyContacts);
router.get("/:userId/past-records", getPastRecords);
router.get("/:userId", getUserController);

module.exports = router;
