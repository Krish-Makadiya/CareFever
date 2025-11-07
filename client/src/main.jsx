import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ThemeProvider>
            <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                <App />
                <Toaster position="top-right" reverseOrder={false} />
            </ClerkProvider>
        </ThemeProvider>
    </BrowserRouter>
);
