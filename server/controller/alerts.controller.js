const { db } = require("../config/firebase");

// Lazy-init Twilio client to avoid requiring if not configured
let twilioClient = null;
function getTwilioClient() {
    if (twilioClient) return twilioClient;
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) {
        throw new Error("Twilio credentials missing (TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN)");
    }
    // eslint-disable-next-line global-require
    const twilio = require("twilio");
    twilioClient = twilio(sid, token);
    return twilioClient;
}

async function sendSms(toPhone, message) {
    const from = process.env.TWILIO_FROM_NUMBER;
    if (!from) {
        throw new Error("TWILIO_FROM_NUMBER is not set");
    }
    const client = getTwilioClient();
    return client.messages.create({ from, to: toPhone, body: message });
}

// POST /api/alerts/sos
// body: { userId: string, locationText?: string }
const sendSOSAlert = async (req, res) => {
    try {
        const { userId, locationText } = req.body || {};
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        // Fetch basic user info
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const user = userDoc.data();

        // Fetch emergency contacts
        const contactsSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("emergency-contacts")
            .get();

        if (contactsSnapshot.empty) {
            return res.status(400).json({ success: false, message: "No emergency contacts found" });
        }

        const contacts = [];
        contactsSnapshot.forEach((doc) => contacts.push(doc.data()));

        const userDisplayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "CareFever User";
        const locationLine = locationText ? `\nLocation: ${locationText}` : "";
        const header = `SOS Alert from ${userDisplayName}`;
        const body = `${header}${locationLine}\nPlease reach out immediately.`;

        // Send SMS to all contacts (fire in parallel but wait for all)
        const results = await Promise.allSettled(
            contacts
                .filter((c) => c.phone)
                .map((c) => sendSms(c.phone, body))
        );

        const failed = results.filter((r) => r.status === "rejected");
        if (failed.length === results.length) {
            // all failed
            return res.status(500).json({ success: false, message: "Failed to send SOS to all contacts" });
        }

        return res.status(200).json({ success: true, sent: results.length, failed: failed.length });
    } catch (err) {
        console.error("sendSOSAlert error:", err);
        return res.status(500).json({ success: false, message: err.message || "Failed to send SOS" });
    }
};

module.exports = { sendSOSAlert };
