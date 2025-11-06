// ...existing code...
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { User, Phone, MapPin, Mail, Calendar, AlertCircle, Save, Loader2, Edit } from "lucide-react";
import EmergencyContacts from "../components/EmergencyContacts";
import PastRecords from "../components/PastRecords";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
    const { userId } = useAuth();
    const { user } = useUser();

    const initialPersonal = {
        name: "",
        email: "",
        phone: "",
        age: "",
        address: "",
        currentLocation: "San Francisco, CA, USA", // dummy default
    };

    const initialEmergency = [
        { name: "", phone: "", relationship: "" },
    ];

    const [personalDetails, setPersonalDetails] = useState(initialPersonal);
    const [emergencyContacts, setEmergencyContacts] = useState(initialEmergency);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hasPersonalInfo, setHasPersonalInfo] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmergencyChange = (index, e) => {
        const { name, value } = e.target;
        setEmergencyContacts((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [name]: value };
            return copy;
        });
    };

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId || !user) {
                setIsLoading(false);
                return;
            }

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
                const response = await fetch(`${API_BASE_URL}/api/user/${userId}`);
                const data = await response.json();

                if (data.success && data.data) {
                    console.log("User data from Firebase:", data.data);
                    
                    // Auto-fill form with data from Clerk and Firebase
                    setPersonalDetails({
                        name: `${data.data.firstName || ""} ${data.data.lastName || ""}`.trim() || user.fullName || "",
                        email: data.data.email || user.primaryEmailAddress?.emailAddress || "",
                        phone: data.data.phone || "",
                        age: data.data.age || "",
                        address: data.data.address || "",
                        currentLocation: data.data.currentLocation || "San Francisco, CA, USA",
                    });
                    
                    // Check if personal info is complete (strict check for non-empty values)
                    const isComplete = data.data.personalInfoCompleted === true && 
                                      data.data.phone?.trim() && 
                                      data.data.age?.toString().trim() && 
                                      data.data.address?.trim();
                    
                    console.log("Personal info complete check:", {
                        personalInfoCompleted: data.data.personalInfoCompleted,
                        phone: data.data.phone,
                        age: data.data.age,
                        address: data.data.address,
                        isComplete
                    });
                    
                    if (isComplete) {
                        setHasPersonalInfo(true);
                        setIsEditing(false);
                    } else {
                        setHasPersonalInfo(false);
                        setIsEditing(true);
                    }
                } else {
                    // If no Firebase data, use Clerk data
                    setPersonalDetails(prev => ({
                        ...prev,
                        name: user.fullName || "",
                        email: user.primaryEmailAddress?.emailAddress || "",
                    }));
                    setIsEditing(true);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Fallback to Clerk data on error
                setPersonalDetails(prev => ({
                    ...prev,
                    name: user.fullName || "",
                    email: user.primaryEmailAddress?.emailAddress || "",
                }));
                setIsEditing(true);
            } finally{
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userId, user]);

    const handleSave = async () => {
        if (!userId) {
            toast.error("Please log in to save your information");
            return;
        }

        // Validate required fields
        if (!personalDetails.name || !personalDetails.email || !personalDetails.phone || !personalDetails.age || !personalDetails.address) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSaving(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(`${API_BASE_URL}/api/user/personal-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    personalInfo: {
                        phone: personalDetails.phone,
                        age: personalDetails.age,
                        address: personalDetails.address,
                        currentLocation: personalDetails.currentLocation,
                    },
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Personal information saved successfully!");
                setHasPersonalInfo(true);
                setIsEditing(false);
            } else {
                toast.error(data.message || "Failed to save information");
            }
        } catch (error) {
            console.error("Error saving personal info:", error);
            toast.error("Failed to save information. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen dark:bg-dark-bg bg-light-bg">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-light-primary dark:text-dark-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-dark-bg bg-light-bg">
            <Toaster position="top-right" />
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-light-primary-text dark:text-dark-primary-text mb-2">
                        Dashboard
                    </h1>
                    <p className="text-light-secondary-text dark:text-dark-secondary-text">
                        Your personal information and emergency details
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Details + Current Location Card - inputs always editable and required */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-light-primary/20 dark:bg-dark-primary/20 rounded-lg">
                                    <User className="h-6 w-6 text-light-primary dark:text-dark-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                                    Personal Details
                                </h2>
                            </div>
                            {!isEditing && hasPersonalInfo ? (
                                <motion.button
                                    onClick={() => setIsEditing(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span>Edit</span>
                                </motion.button>
                            ) : (
                                <div className="text-sm text-red-600">
                                    * All fields are required
                                </div>
                            )}
                        </div>

                        {!isEditing && hasPersonalInfo ? (
                            // View Mode - Display saved data
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                    <div className="flex-1">
                                        <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                            Full Name
                                        </label>
                                        <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                            {personalDetails.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                    <div className="flex-1">
                                        <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                            Email
                                        </label>
                                        <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                            {personalDetails.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                    <div className="flex-1">
                                        <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                            Phone
                                        </label>
                                        <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                            {personalDetails.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                    <div className="flex-1">
                                        <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                            Age
                                        </label>
                                        <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                            {personalDetails.age}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                    <div className="flex-1">
                                        <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                            Address
                                        </label>
                                        <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                            {personalDetails.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                    <div className="flex-1">
                                        <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                            Current Location
                                        </label>
                                        <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                            {personalDetails.currentLocation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode - Show form
                            <>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                <div className="flex-1">
                                    <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={personalDetails.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                        aria-required="true"
                                        className="w-full p-2 mt-1 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white border border-light-secondary/20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                <div className="flex-1">
                                    <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={personalDetails.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                        aria-required="true"
                                        className="w-full p-2 mt-1 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white border border-light-secondary/20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                <div className="flex-1">
                                    <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                        Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={personalDetails.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        required
                                        aria-required="true"
                                        className="w-full p-2 mt-1 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white border border-light-secondary/20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                <div className="flex-1">
                                    <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                        Age <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={personalDetails.age}
                                        onChange={handleChange}
                                        placeholder="Enter your age"
                                        required
                                        aria-required="true"
                                        className="w-full p-2 mt-1 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white border border-light-secondary/20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                <div className="flex-1">
                                    <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={personalDetails.address}
                                        onChange={handleChange}
                                        placeholder="Enter your address"
                                        required
                                        aria-required="true"
                                        className="w-full p-2 mt-1 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white border border-light-secondary/20"
                                    />
                                </div>
                            </div>

                            {/* Current Location merged into Personal Details */}
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-light-secondary dark:text-dark-secondary mt-2" />
                                <div className="flex-1">
                                    <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                        Current Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="currentLocation"
                                        value={personalDetails.currentLocation}
                                        onChange={handleChange}
                                        placeholder="Enter your current location"
                                        required
                                        aria-required="true"
                                        className="w-full p-2 mt-1 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white border border-light-secondary/20"
                                    />
                                    <p className="text-xs text-light-secondary-text dark:text-dark-secondary-text mt-1">
                                        You can edit the default location above.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <motion.button
                            onClick={handleSave}
                            disabled={isSaving}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-6 py-3 px-6 bg-light-primary dark:bg-dark-primary text-white rounded-lg font-semibold hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    <span>Save Personal Details</span>
                                </>
                            )}
                        </motion.button>
                        </>
                        )}
                    </motion.div>

                    {/* Emergency Contacts Card */}
                    <EmergencyContacts />
                </div>

                {/* Past Records Section - Full Width */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-6"
                >
                    <PastRecords />
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;