const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.route");
const aiRoutes = require("./routes/ai.route");
const alertsRoutes = require("./routes/alerts.route");
const sosRoutes = require("./routes/sos.route");
const { clerkMiddleware } = require("@clerk/express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173", // Development
            "https://care-fever.vercel.app", // Production
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "svix-id",
            "svix-timestamp",
            "svix-signature",
        ],
    })
);
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/user", userRoutes);
app.use("/ai", aiRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/sos", sosRoutes);

// Backward compatibility route for CheckHealth
const { saveProfileController } = require("./controller/user.controller");
app.post("/save-profile", saveProfileController);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
