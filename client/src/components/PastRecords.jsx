import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Calendar, Thermometer, AlertTriangle, Pill, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PastRecords = () => {
    const { userId } = useAuth();
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [expandedRecord, setExpandedRecord] = useState(null);

    // Helper function to safely render any field (string, array, or object)
    const renderField = (field) => {
        if (!field) return 'N/A';
        if (typeof field === 'string') return field;
        if (Array.isArray(field)) {
            // Handle array of objects or strings
            return field.map((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    // Extract all values from the object
                    const values = Object.values(item).filter(v => v && typeof v !== 'object');
                    return values.length > 0 ? values.join(': ') : `Item ${index + 1}`;
                }
                return String(item);
            }).join(', ');
        }
        if (typeof field === 'object') {
            // Handle single object - extract all values
            const values = Object.values(field).filter(v => v && typeof v !== 'object');
            return values.length > 0 ? values.join(': ') : 'N/A';
        }
        return String(field);
    };

    useEffect(() => {
        const fetchRecords = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                const limit = showAll ? '' : '2';
                const url = `${API_BASE_URL}/api/user/${userId}/past-records${limit ? `?limit=${limit}` : ''}`;
                
                console.log('Fetching past records from:', url);
                
                const response = await fetch(url);
                const data = await response.json();

                console.log('Past records response:', data);

                if (data.success && data.data) {
                    // Log the first record to see structure
                    if (data.data.length > 0) {
                        console.log('First record structure:', data.data[0]);
                        console.log('Possible causes type:', typeof data.data[0].possibleFeverCauses);
                        console.log('Possible causes value:', data.data[0].possibleFeverCauses);
                    }
                    setRecords(data.data);
                } else {
                    console.error('Failed to fetch records:', data.message);
                    // Don't show error toast if there are just no records
                    if (!data.success && data.message !== 'No records found') {
                        toast.error(data.message || 'Failed to load past records');
                    }
                }
            } catch (error) {
                console.error('Error fetching past records:', error);
                toast.error('Failed to load past records');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords();
    }, [userId, showAll]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleExpand = (recordId) => {
        setExpandedRecord(expandedRecord === recordId ? null : recordId);
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg p-6"
            >
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-light-primary dark:text-dark-primary" />
                </div>
            </motion.div>
        );
    }

    if (records.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Past Records
                        </h2>
                        <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                            Your health check history
                        </p>
                    </div>
                </div>
                <div className="text-center py-8">
                    <History className="h-16 w-16 mx-auto text-light-secondary dark:text-dark-secondary opacity-50 mb-4" />
                    <p className="text-light-secondary-text dark:text-dark-secondary-text">
                        No past records found. Use the Check Health feature to create your first record.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                        Past Records
                    </h2>
                    <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                        Your health check history ({records.length} record{records.length !== 1 ? 's' : ''})
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {records.map((record, index) => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-light-secondary/20 dark:border-dark-secondary/20 rounded-lg overflow-hidden"
                        >
                            {/* Summary View */}
                            <div className="p-4 bg-light-bg dark:bg-dark-bg">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="h-4 w-4 text-light-secondary dark:text-dark-secondary" />
                                            <span className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                                {formatDate(record.createdAt)}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            {/* Fever Severity */}
                                            <div className="flex items-center gap-2">
                                                <Thermometer className="h-4 w-4 text-orange-500" />
                                                <div>
                                                    <p className="text-xs text-light-secondary-text dark:text-dark-secondary-text">
                                                        Fever Severity
                                                    </p>
                                                    <p className="text-sm font-semibold text-light-primary-text dark:text-dark-primary-text">
                                                        {renderField(record.feverSeverity)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Symptoms */}
                                            {record.symptoms && (
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                    <div>
                                                        <p className="text-xs text-light-secondary-text dark:text-dark-secondary-text">
                                                            Symptoms
                                                        </p>
                                                        <p className="text-sm font-semibold text-light-primary-text dark:text-dark-primary-text">
                                                            {Array.isArray(record.symptoms) 
                                                                ? `${record.symptoms.slice(0, 2).join(', ')}${record.symptoms.length > 2 ? ` +${record.symptoms.length - 2} more` : ''}`
                                                                : typeof record.symptoms === 'string' 
                                                                    ? record.symptoms 
                                                                    : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Urgent Care Alert */}
                                        {record.urgentCareAlert && (
                                            <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                                                <p className="text-xs text-red-700 dark:text-red-300 line-clamp-2">
                                                    {renderField(record.urgentCareAlert)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <motion.button
                                        onClick={() => toggleExpand(record.id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="ml-4 p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg transition-colors"
                                    >
                                        {expandedRecord === record.id ? (
                                            <ChevronUp className="h-5 w-5 text-light-primary dark:text-dark-primary" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-light-primary dark:text-dark-primary" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {expandedRecord === record.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t border-light-secondary/20 dark:border-dark-secondary/20"
                                    >
                                        <div className="p-4 space-y-4">
                                            {/* Possible Causes */}
                                            {record.possibleFeverCauses && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2">
                                                        Possible Causes
                                                    </h4>
                                                    {Array.isArray(record.possibleFeverCauses) ? (
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {record.possibleFeverCauses.map((cause, idx) => (
                                                                <li key={idx} className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                                                    {typeof cause === 'object' ? Object.values(cause).filter(v => v).join(': ') : cause}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                                            {renderField(record.possibleFeverCauses)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Management Tips */}
                                            {record.feverManagementTips && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2">
                                                        Management Tips
                                                    </h4>
                                                    <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                                        {renderField(record.feverManagementTips)}
                                                    </p>
                                                </div>
                                            )}

                                            {/* OTC Medicines */}
                                            {record.otcMedicines && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-light-primary-text dark:text-dark-primary-text mb-2 flex items-center gap-2">
                                                        <Pill className="h-4 w-4" />
                                                        OTC Medicines
                                                    </h4>
                                                    <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                                        {renderField(record.otcMedicines)}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Red Flags */}
                                            {record.redFlagsToWatchFor && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        Red Flags to Watch For
                                                    </h4>
                                                    <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                                                        {renderField(record.redFlagsToWatchFor)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* See More / See Less Button */}
                {records.length >= 2 && (
                    <motion.button
                        onClick={() => setShowAll(!showAll)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-6 border-2 border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary rounded-lg font-semibold hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 transition-colors flex items-center justify-center gap-2"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp className="h-5 w-5" />
                                <span>Show Less</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-5 w-5" />
                                <span>See More Records</span>
                            </>
                        )}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default PastRecords;
