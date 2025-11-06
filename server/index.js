const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.route");
const aiRoutes = require("./routes/ai.route");
const { clerkMiddleware } = require("@clerk/express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const app = express();

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/user", userRoutes);
app.use("/ai", aiRoutes);

// Backward compatibility route for CheckHealth
const { saveProfileController } = require("./controller/user.controller");
app.post("/save-profile", saveProfileController);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
