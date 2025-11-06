import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { AlertCircle, User, Phone, MapPin, Save, Loader2, Plus, Trash2, Users, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const EmergencyContacts = () => {
    const { userId } = useAuth();
    const [contacts, setContacts] = useState([
        { name: '', phone: '', relation: '', location: '' }
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hasContacts, setHasContacts] = useState(false);

    // Fetch existing emergency contacts
    useEffect(() => {
        const fetchContacts = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                const response = await fetch(`${API_BASE_URL}/api/user/${userId}/emergency-contacts`);
                const data = await response.json();

                if (data.success && data.data && data.data.length > 0) {
                    setContacts(data.data.map(contact => ({
                        name: contact.name || '',
                        phone: contact.phone || '',
                        relation: contact.relation || '',
                        location: contact.location || ''
                    })));
                    setHasContacts(true);
                    setIsEditing(false);
                } else {
                    setIsEditing(true);
                }
            } catch (error) {
                console.error('Error fetching emergency contacts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, [userId]);

    const handleChange = (index, field, value) => {
        const newContacts = [...contacts];
        newContacts[index][field] = value;
        setContacts(newContacts);
    };

    const addContact = () => {
        if (contacts.length < 4) {
            setContacts([...contacts, { name: '', phone: '', relation: '', location: '' }]);
        } else {
            toast.error('Maximum 4 emergency contacts allowed');
        }
    };

    const removeContact = (index) => {
        if (contacts.length > 1) {
            const newContacts = contacts.filter((_, i) => i !== index);
            setContacts(newContacts);
        } else {
            toast.error('At least 1 emergency contact is required');
        }
    };

    const validateContacts = () => {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            if (!contact.name.trim()) {
                toast.error(`Contact ${i + 1}: Name is required`);
                return false;
            }
            if (!contact.phone.trim()) {
                toast.error(`Contact ${i + 1}: Phone is required`);
                return false;
            }
            if (!/^[\d\s\-\+\(\)]+$/.test(contact.phone)) {
                toast.error(`Contact ${i + 1}: Invalid phone number`);
                return false;
            }
            if (!contact.relation.trim()) {
                toast.error(`Contact ${i + 1}: Relation is required`);
                return false;
            }
        }
        return true;
    };

    const handleSave = async () => {
        if (!userId) {
            toast.error('Please log in to save emergency contacts');
            return;
        }

        if (!validateContacts()) {
            return;
        }

        setIsSaving(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE_URL}/api/user/emergency-contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    contacts: contacts.map(contact => ({
                        name: contact.name.trim(),
                        phone: contact.phone.trim(),
                        relation: contact.relation.trim(),
                        location: contact.location.trim()
                    }))
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Emergency contacts saved successfully!');
                setHasContacts(true);
                setIsEditing(false);
            } else {
                toast.error(data.message || 'Failed to save emergency contacts');
            }
        } catch (error) {
            console.error('Error saving emergency contacts:', error);
            toast.error('Failed to save emergency contacts. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg p-6"
            >
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-light-primary dark:text-dark-primary" />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Emergency Contacts
                        </h2>
                        <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                            {!isEditing && hasContacts ? 'Your emergency contacts' : 'Add 1-4 emergency contacts who can be reached in case of emergency'}
                        </p>
                    </div>
                </div>
                {!isEditing && hasContacts && (
                    <div className="flex gap-2">
                        <motion.button
                            onClick={() => setIsEditing(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                        </motion.button>
                    </div>
                )}
            </div>

            {!isEditing && hasContacts ? (
                // View Mode - Display saved contacts
                <div className="space-y-4">
                    {contacts.map((contact, index) => (
                        <div
                            key={index}
                            className="p-4 border border-light-secondary/20 dark:border-dark-secondary/20 rounded-lg"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="h-5 w-5 text-light-primary dark:text-dark-primary" />
                                <h3 className="font-semibold text-light-primary-text dark:text-dark-primary-text">
                                    Contact {index + 1}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                        Name
                                    </label>
                                    <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                        {contact.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                        Phone
                                    </label>
                                    <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                        {contact.phone}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                        Relation
                                    </label>
                                    <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                        {contact.relation}
                                    </p>
                                </div>
                                {contact.location && (
                                    <div>
                                        <label className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                            Location
                                        </label>
                                        <p className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mt-1">
                                            {contact.location}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {/* Add Contact Button in View Mode */}
                    {contacts.length < 4 && (
                        <motion.button
                            onClick={() => setIsEditing(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 px-6 border-2 border-dashed border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary rounded-lg font-semibold hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Another Contact</span>
                        </motion.button>
                    )}
                </div>
            ) : (
                // Edit Mode - Show form
                <div className="space-y-6">
                {contacts.map((contact, index) => (
                    <div
                        key={index}
                        className="p-4 border border-light-secondary/20 dark:border-dark-secondary/20 rounded-lg space-y-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-light-primary dark:text-dark-primary" />
                                <h3 className="font-semibold text-light-primary-text dark:text-dark-primary-text">
                                    Contact {index + 1}
                                </h3>
                            </div>
                            {contacts.length > 1 && (
                                <button
                                    onClick={() => removeContact(index)}
                                    className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-light-primary-text dark:text-dark-primary-text mb-2">
                                    <User className="inline h-4 w-4 mr-1" />
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={contact.name}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    placeholder="Enter contact name"
                                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-light-primary-text dark:text-dark-primary-text mb-2">
                                    <Phone className="inline h-4 w-4 mr-1" />
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={contact.phone}
                                    onChange={(e) => handleChange(index, 'phone', e.target.value)}
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                />
                            </div>

                            {/* Relation */}
                            <div>
                                <label className="block text-sm font-medium text-light-primary-text dark:text-dark-primary-text mb-2">
                                    <Users className="inline h-4 w-4 mr-1" />
                                    Relation <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={contact.relation}
                                    onChange={(e) => handleChange(index, 'relation', e.target.value)}
                                    placeholder="e.g., Father, Mother, Friend"
                                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-light-primary-text dark:text-dark-primary-text mb-2">
                                    <MapPin className="inline h-4 w-4 mr-1" />
                                    Location (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={contact.location}
                                    onChange={(e) => handleChange(index, 'location', e.target.value)}
                                    placeholder="Enter location"
                                    className="w-full px-4 py-2 rounded-lg border border-light-secondary/20 dark:border-dark-secondary/20 bg-light-bg dark:bg-dark-bg text-light-primary-text dark:text-dark-primary-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Contact Button */}
                {contacts.length < 4 && (
                    <motion.button
                        onClick={addContact}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-6 border-2 border-dashed border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary rounded-lg font-semibold hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Another Contact</span>
                    </motion.button>
                )}

                {/* Save Button */}
                <motion.button
                    onClick={handleSave}
                    disabled={isSaving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 bg-light-primary dark:bg-dark-primary text-white rounded-lg font-semibold hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            <span>Save Emergency Contacts</span>
                        </>
                    )}
                </motion.button>
                </div>
            )}
        </motion.div>
    );
};

export default EmergencyContacts;
