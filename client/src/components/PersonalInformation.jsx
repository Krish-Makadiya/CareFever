import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, Loader2, AlertCircle } from 'lucide-react';

const PersonalInformation = () => {
    const { userId } = useAuth();
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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
        
        if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        
        if (formData.emergencyPhone && !/^[\d\s\-\+\(\)]+$/.test(formData.emergencyPhone)) {
            newErrors.emergencyPhone = 'Please enter a valid phone number';
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
            alert('Please log in to save your personal information');
            return;
        }

        setIsSubmitting(true);
        setIsSuccess(false);

        try {            
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/personal-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    personalInfo: {
                        phone: formData.phone.trim(),
                        address: formData.address.trim(),
                        emergencyContact: formData.emergencyContact.trim(),
                        emergencyPhone: formData.emergencyPhone.trim(),
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save personal information');
            }

            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving personal info:', error);
            alert(error.message || 'Failed to save personal information. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Load existing personal data if available
    useEffect(() => {
        const loadPersonalData = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${userId}`);
                const data = await response.json();

                if (data.success && data.data?.personalInfo) {
                    setFormData({
                        phone: data.data.personalInfo.phone || '',
                        address: data.data.personalInfo.address || '',
                        emergencyContact: data.data.personalInfo.emergencyContact || '',
                        emergencyPhone: data.data.personalInfo.emergencyPhone || '',
                    });
                }
            } catch (error) {
                console.error('Error loading personal data:', error);
            }
        };

        loadPersonalData();
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
                    <div className="p-2 bg-light-primary/20 dark:bg-dark-primary/20 rounded-lg">
                        <User className="h-6 w-6 text-light-primary dark:text-dark-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Personal Information
                        </h2>
                        <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                            Update your personal details and emergency contact information
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Phone Field */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2"
                        >
                            <Phone className="inline h-4 w-4 mr-2" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.phone
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-light-secondary/20 dark:border-dark-secondary/20 focus:border-light-primary dark:focus:border-dark-primary'
                            } bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                            placeholder="Enter your phone number"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Address Field */}
                    <div>
                        <label
                            htmlFor="address"
                            className="block text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2"
                        >
                            <MapPin className="inline h-4 w-4 mr-2" />
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 focus:border-light-primary dark:focus:border-dark-primary bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all resize-none"
                            placeholder="Enter your address"
                        />
                    </div>

                    {/* Emergency Contact Field */}
                    <div>
                        <label
                            htmlFor="emergencyContact"
                            className="block text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2"
                        >
                            <User className="inline h-4 w-4 mr-2" />
                            Emergency Contact Name
                        </label>
                        <input
                            type="text"
                            id="emergencyContact"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 focus:border-light-primary dark:focus:border-dark-primary bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                            placeholder="Enter emergency contact name"
                        />
                    </div>

                    {/* Emergency Phone Field */}
                    <div>
                        <label
                            htmlFor="emergencyPhone"
                            className="block text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2"
                        >
                            <Phone className="inline h-4 w-4 mr-2" />
                            Emergency Contact Phone
                        </label>
                        <input
                            type="tel"
                            id="emergencyPhone"
                            name="emergencyPhone"
                            value={formData.emergencyPhone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.emergencyPhone
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-light-secondary/20 dark:border-dark-secondary/20 focus:border-light-primary dark:focus:border-dark-primary'
                            } bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                            placeholder="Enter emergency contact phone"
                        />
                        {errors.emergencyPhone && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.emergencyPhone}
                            </p>
                        )}
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
                                <span className="font-semibold">Personal information saved successfully!</span>
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
                                <span>Save Personal Information</span>
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default PersonalInformation;