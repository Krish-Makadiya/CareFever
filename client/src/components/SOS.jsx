import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { AlertCircle, MapPin, User, Calendar, Save, Loader2 } from 'lucide-react';

const SOS = () => {
    const { userId } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        lastLocation: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Get user's current location
    const getCurrentLocation = () => {
        setIsLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({
                        ...prev,
                        lastLocation: `${latitude}, ${longitude}`
                    }));
                    setIsLoadingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsLoadingLocation(false);
                    // Fallback to manual entry
                    setFormData(prev => ({
                        ...prev,
                        lastLocation: ''
                    }));
                }
            );
        } else {
            setIsLoadingLocation(false);
            alert('Geolocation is not supported by your browser. Please enter location manually.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.age.trim()) {
            newErrors.age = 'Age is required';
        } else if (isNaN(formData.age) || parseInt(formData.age) < 1 || parseInt(formData.age) > 150) {
            newErrors.age = 'Please enter a valid age (1-150)';
        }
        
        if (!formData.lastLocation.trim()) {
            newErrors.lastLocation = 'Last location is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!userId) {
            alert('Please log in to save your SOS information');
            return;
        }

        setIsSubmitting(true);
        setIsSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/sos-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    sosInfo: {
                        name: formData.name.trim(),
                        age: parseInt(formData.age),
                        lastLocation: formData.lastLocation.trim(),
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save SOS information');
            }

            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving SOS info:', error);
            alert(error.message || 'Failed to save SOS information. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Load existing SOS data if available
    useEffect(() => {
        const loadSOSData = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${userId}`);
                const data = await response.json();

                if (data.success && data.data?.sosInfo) {
                    setFormData({
                        name: data.data.sosInfo.name || '',
                        age: data.data.sosInfo.age?.toString() || '',
                        lastLocation: data.data.sosInfo.lastLocation || '',
                    });
                }
            } catch (error) {
                console.error('Error loading SOS data:', error);
            }
        };

        loadSOSData();
    }, [userId]);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg p-8 border border-light-secondary/10 dark:border-dark-secondary/10"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            SOS Emergency Information
                        </h2>
                        <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                            This information is mandatory and will be used in case of emergencies
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2"
                        >
                            <User className="inline h-4 w-4 mr-2" />
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.name
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-light-secondary/20 dark:border-dark-secondary/20 focus:border-light-primary dark:focus:border-dark-primary'
                            } bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                            placeholder="Enter your full name"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Age Field */}
                    <div>
                        <label
                            htmlFor="age"
                            className="block text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2"
                        >
                            <Calendar className="inline h-4 w-4 mr-2" />
                            Age <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="1"
                            max="150"
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.age
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-light-secondary/20 dark:border-dark-secondary/20 focus:border-light-primary dark:focus:border-dark-primary'
                            } bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                            placeholder="Enter your age"
                            required
                        />
                        {errors.age && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.age}
                            </p>
                        )}
                    </div>

                    {/* Last Location Field */}
                    <div>
                        <label
                            htmlFor="lastLocation"
                            className="block text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2"
                        >
                            <MapPin className="inline h-4 w-4 mr-2" />
                            Last Known Location <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="lastLocation"
                                name="lastLocation"
                                value={formData.lastLocation}
                                onChange={handleChange}
                                className={`flex-1 px-4 py-3 rounded-lg border ${
                                    errors.lastLocation
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-light-secondary/20 dark:border-dark-secondary/20 focus:border-light-primary dark:focus:border-dark-primary'
                                } bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                                placeholder="Enter your location or use current location"
                                required
                            />
                            <motion.button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={isLoadingLocation}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 bg-light-secondary dark:bg-dark-secondary text-white rounded-lg hover:bg-light-secondary-hover dark:hover:bg-dark-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoadingLocation ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <MapPin className="h-5 w-5" />
                                )}
                                <span className="hidden sm:inline">Get Location</span>
                            </motion.button>
                        </div>
                        {errors.lastLocation && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.lastLocation}
                            </p>
                        )}
                        <p className="mt-2 text-xs text-light-secondary-text dark:text-dark-secondary-text">
                            Click "Get Location" to automatically detect your current location, or enter it manually
                        </p>
                    </div>

                    {/* Success Message */}
                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg text-green-700 dark:text-green-400"
                        >
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                <span className="font-semibold">SOS information saved successfully!</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-6 bg-light-primary dark:bg-dark-primary text-white rounded-lg font-semibold hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                <span>Save SOS Information</span>
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default SOS;