const express = require("express");
const { db } = require("../config/firebase");
const { Webhook } = require("svix");

const userClerkController = async (req, res) => {
    try {
        // Get the raw body as a string
        const rawBody = JSON.stringify(req.body);
        
        const headers = req.headers;

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const evt = wh.verify(rawBody, {
            "svix-id": headers["svix-id"],
            "svix-timestamp": headers["svix-timestamp"],
            "svix-signature": headers["svix-signature"],
        });
        
        const {
            id,
            email_addresses,
            first_name,
            last_name,
            created_at,
            updated_at,
            image_url,
        } = evt.data;

        switch (evt.type) {
            case "user.created":
                await db
                .collection("users")
                    .doc(id)
                    .set({
                        email: email_addresses[0].email_address,
                        firstName: first_name || "",
                        lastName: last_name || "",
                        clerkUserId: id,
                        imageUrl: image_url || "",
                        createdAt: created_at,
                    });
                    break;

            case "user.updated":
                await db
                    .collection("users")
                    .doc(id)
                    .update({
                        email: email_addresses[0].email_address,
                        firstName: first_name || "",
                        lastName: last_name || "",
                        imageUrl: image_url || "",
                        updatedAt: updated_at,
                    });
                break;

            case "user.deleted":
                await db.collection("users").doc(id).delete();
                break;

            default:
                console.log("Unhandled event type:", evt.type);
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Webhook error details:", {
            message: err.message,
            stack: err.stack,
            headers: req.headers,
        });
        res.status(400).json({
            error: "Webhook verification failed",
            details: err.message,
        });
    }
};

const saveProfileController = async(req, res)=>{
    try {
        const {userId, feverSeverity,possibleFeverCauses,feverManagementTips,otcMedicines,urgentCareAlert,redFlagsToWatchFor,symptoms} = req.body;
        if(!userId || !feverSeverity || !possibleFeverCauses || !feverManagementTips || !otcMedicines || !urgentCareAlert || !redFlagsToWatchFor){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        
        const record = await db.collection("users").doc(userId).collection("past-records").add({
            feverSeverity,
            possibleFeverCauses,
            feverManagementTips,
            otcMedicines,
            urgentCareAlert,
            redFlagsToWatchFor,
            symptoms,
            createdAt: new Date(),
        })

        return res.status(200).json({
            success: true,
            message: "Profile saved successfully",
            recordId: record.id,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to save profile",
            error: error.message,
        })
    }
}

const getUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const userDoc = await db.collection("users").doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const userData = userDoc.data();

        return res.status(200).json({
            success: true,
            data: userData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user data",
            error: error.message,
        });
    }
};

const updateUserPersonalInfo = async (req, res) => {
    try {
        const { userId, personalInfo } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Save to main user document (merge with existing data, don't create new document)
        await db.collection("users").doc(userId).set({
            phone: personalInfo.phone || "",
            age: personalInfo.age || "",
            address: personalInfo.address || "",
            currentLocation: personalInfo.currentLocation || "",
            personalInfoCompleted: true,
            updatedAt: new Date(),
        }, { merge: true });

        return res.status(200).json({
            success: true,
            message: "Personal information updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update personal information",
            error: error.message,
        });
    }
};

const saveEmergencyContacts = async (req, res) => {
    try {
        const { userId, contacts } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        if (!contacts || !Array.isArray(contacts)) {
            return res.status(400).json({
                success: false,
                message: "Contacts array is required",
            });
        }

        // Delete existing emergency contacts
        const existingContacts = await db
            .collection("users")
            .doc(userId)
            .collection("emergency-contacts")
            .get();

        const batch = db.batch();
        existingContacts.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Add new emergency contacts
        contacts.forEach((contact) => {
            const docRef = db
                .collection("users")
                .doc(userId)
                .collection("emergency-contacts")
                .doc();
            batch.set(docRef, {
                name: contact.name,
                phone: contact.phone,
                relation: contact.relation,
                location: contact.location || "",
                createdAt: new Date(),
            });
        });

        await batch.commit();

        return res.status(200).json({
            success: true,
            message: "Emergency contacts saved successfully",
        });
    } catch (error) {
        console.error("Error saving emergency contacts:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save emergency contacts",
            error: error.message,
        });
    }
};

const getEmergencyContacts = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const contactsSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("emergency-contacts")
            .get();

        const contacts = [];
        contactsSnapshot.forEach((doc) => {
            contacts.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return res.status(200).json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch emergency contacts",
            error: error.message,
        });
    }
};

const getPastRecords = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit } = req.query;

        console.log("Fetching past records for userId:", userId, "with limit:", limit);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        let query = db
            .collection("users")
            .doc(userId)
            .collection("past-records")
            .orderBy("createdAt", "desc");

        // Apply limit if provided
        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const recordsSnapshot = await query.get();

        console.log("Found records count:", recordsSnapshot.size);

        const records = [];
        recordsSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Record data:", doc.id, data);
            records.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate().toISOString(),
            });
        });

        console.log("Returning records:", records.length);

        return res.status(200).json({
            success: true,
            data: records,
        });
    } catch (error) {
        console.error("Error fetching past records:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch past records",
            error: error.message,
        });
    }
};

module.exports = {
    userClerkController,
    saveProfileController,
    getUserController,
    updateUserPersonalInfo,
    saveEmergencyContacts,
    getEmergencyContacts,
    getPastRecords
};
