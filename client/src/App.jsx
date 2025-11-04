import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import { Check } from "lucide-react";
import CheckHealth from "./pages/CheckHealth";
import ContactUs from "./pages/ContactUs";
import ErrorPage from "./pages/ErrorPage";
import CareAI from "./pages/CareAI";

function App() {
    return (
        <div className="dark:bg-dark-bg bg-light-bg">
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/check-health" element={<CheckHealth />} />
                <Route path="/care-ai" element={<CareAI />} />
                <Route path="/contact-us" element={<ContactUs />} />

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
}

export default App;
