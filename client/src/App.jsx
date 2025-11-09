import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CareAI from "./pages/CareAI";
import CheckHealth from "./pages/CheckHealth";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Homepage from "./pages/Homepage";

function App() {
    return (
        <div className="dark:bg-dark-bg bg-light-bg">
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/dashboard" element={<>
                    <Navbar />
                    <Dashboard />
                </>} />
                <Route
                    path="/check-health"
                    element={
                        <>
                            <Navbar />
                            <CheckHealth />
                        </>
                    }
                />
                <Route
                    path="/care-ai"
                    element={
                        <>
                            <Navbar />
                            <CareAI />
                        </>
                    }
                />
                <Route path="/contact-us" element={<ContactUs />} />

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
}

export default App;
