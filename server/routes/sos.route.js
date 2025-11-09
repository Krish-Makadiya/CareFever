// routes/sos.route.js
const express = require("express");
const router = express.Router();
const twilio = require("twilio");

// Load Twilio credentials from .env.local
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MSG_SERVICE_SID;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// POST route to send SOS
router.post("/send", async (req, res) => {
  try {
    const { phone, message } = req.body;

    const msg = await client.messages.create({
      body: message || "🚨 SOS Alert! Help is needed immediately!",
      messagingServiceSid,
      to: phone || "+18777804236", // Default number
    });

    res.status(200).json({ success: true, sid: msg.sid });
  } catch (error) {
    console.error("Error sending SOS:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
