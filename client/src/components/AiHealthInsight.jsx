import React from "react";
import {
    Heart,
    AlertTriangle,
    Leaf,
    Pill,
    AlertCircle,
    Lightbulb,
    Shield,
    CheckCircle2,
    XCircle,
} from "lucide-react";

const AiHealthInsight = ({ aiInsight }) => {
    if (!aiInsight) return null;

    const {
        feverSeverity,
        possibleFeverCauses,
        feverManagementTips,
        otcMedicines,
        urgentCareAlert,
        redFlagsToWatchFor,
        disclaimer,
    } = aiInsight;

    const getHealthStateColor = (state) => {
        switch (state?.toLowerCase()) {
            case "good":
                return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300";
            case "mild":
                return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300";
            case "moderate":
                return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300";
            case "severe":
                return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300";
            default:
                return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300";
        }
    };

    const getHealthStateIcon = (state) => {
        switch (state?.toLowerCase()) {
            case "good":
                return <CheckCircle2 className="w-5 h-5" />;
            case "mild":
                return <AlertCircle className="w-5 h-5" />;
            case "moderate":
                return <AlertTriangle className="w-5 h-5" />;
            case "severe":
                return <XCircle className="w-5 h-5" />;
            default:
                return <Heart className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6 mt-8">
            {/* Health State Overview */}
            <div className="bg-light-bg dark:bg-dark-bg  shadow-md rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-light-primary dark:text-dark-primary" />
                    <h3 className="text-xl font-bold text-light-primary-text dark:text-dark-primary-text">
                        Health Analysis
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold ${getHealthStateColor(
                            feverSeverity
                        )}`}>
                        {getHealthStateIcon(feverSeverity)}
                        {feverSeverity || "Unknown"}
                    </div>
                    <p className="text-light-secondary-text dark:text-dark-secondary-text">
                        Overall health condition assessment
                    </p>
                </div>
            </div>

            {/* Possible Diseases */}
            {possibleFeverCauses && possibleFeverCauses.length > 0 && (
                <div className="bg-light-bg dark:bg-dark-bg  shadow-md rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                        <h3 className="text-xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Possible Conditions
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {possibleFeverCauses.map((disease, index) => (
                            <div
                                key={index}
                                className="bg-light-surface dark:bg-dark-surface rounded-xl p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-light-primary-text dark:text-dark-primary-text text-lg">
                                        {disease.name}
                                    </h4>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                        {disease.confidence}
                                    </span>
                                </div>
                                <p className="text-light-secondary-text dark:text-dark-secondary-text">
                                    {disease.reason}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Remedies */}
            {feverManagementTips && feverManagementTips.length > 0 && (
                <div className="bg-light-bg dark:bg-dark-bg rounded-2xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <Leaf className="w-6 h-6 text-green-600" />
                        <h3 className="text-xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Home Remedies
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        {feverManagementTips.map((remedy, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                                <span className="text-light-primary-text dark:text-dark-primary-text">
                                    {remedy}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* OTC Medicines */}
            {otcMedicines && otcMedicines.length > 0 && (
                <div className="bg-light-bg dark:bg-dark-bg rounded-2xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <Pill className="w-6 h-6 text-purple-600" />
                        <h3 className="text-xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Medicine Suggestions
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        {otcMedicines.map((medicine, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                                <span className="text-light-primary-text dark:text-dark-primary-text">
                                    {medicine}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Urgent Care Alert */}
            {urgentCareAlert && (
                <div
                    className={`rounded-2xl p-6 shadow-lg ${
                        urgentCareAlert.message.toLowerCase().includes("yes") ||
                        urgentCareAlert.message.toLowerCase().includes("urgent")
                            ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    }`}>
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle
                            className={`w-6 h-6 ${
                                urgentCareAlert.message.toLowerCase().includes("yes") ||
                                urgentCareAlert.message.toLowerCase().includes("urgent")
                                    ? "text-red-600"
                                    : "text-blue-600"
                            }`}
                        />
                        <h3
                            className={`text-xl font-bold ${
                                urgentCareAlert.message.toLowerCase().includes("yes") ||
                                urgentCareAlert.message.toLowerCase().includes("urgent")
                                    ? "text-red-800 dark:text-red-200"
                                    : "text-blue-800 dark:text-blue-200"
                            }`}>
                            {urgentCareAlert.message.toLowerCase().includes("yes") ||
                            urgentCareAlert.message.toLowerCase().includes("urgent")
                                ? "Urgent Care Needed"
                                : "Medical Attention"}
                        </h3>
                    </div>
                    <p
                        className={`${
                            urgentCareAlert.message.toLowerCase().includes("yes") ||
                            urgentCareAlert.message.toLowerCase().includes("urgent")
                                ? "text-red-700 dark:text-red-300"
                                : "text-blue-700 dark:text-blue-300"
                        }`}>
                        {urgentCareAlert.message}
                    </p>
                </div>
            )}

            {/* Lifestyle Advice */}
            {redFlagsToWatchFor && redFlagsToWatchFor.length > 0 && (
                <div className="bg-light-bg dark:bg-dark-bg rounded-2xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="w-6 h-6 text-yellow-500" />
                        <h3 className="text-xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Red Flags to Watch For
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        {redFlagsToWatchFor.map((advice, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0"></div>
                                <span className="text-light-primary-text dark:text-dark-primary-text">
                                    {advice}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Disclaimer */}
            {disclaimer && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                                Important Disclaimer
                            </h4>
                            <p className="text-amber-700 dark:text-amber-300 text-sm">
                                {disclaimer}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiHealthInsight;
