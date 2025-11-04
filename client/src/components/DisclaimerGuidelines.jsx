import React from "react";
import { ShieldAlert, Brain, HeartPulse, Scale } from "lucide-react";
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const cardVariant = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const disclaimers = [
    {
        icon: ShieldAlert,
        title: "Medical Notice",
        description: "This AI tool supplements but does not replace professional medical care. Always consult healthcare providers for medical decisions.",
    },
    {
        icon: Brain,
        title: "AI Scope",
        description: "Our AI provides general fever guidance based on data patterns. Individual cases may vary. Verify results with healthcare professionals.",
    },
    {
        icon: HeartPulse,
        title: "Emergency Care",
        description: "For severe symptoms or emergencies, seek immediate medical attention. Don't wait for AI analysis.",
    },
];

const guidelines = [
    "Provide accurate and complete information for better AI analysis",
    "Regularly update your medical history and symptoms",
    "Follow recommended temperature measurement protocols",
    "Do not rely solely on AI suggestions for serious health decisions",
    "Report any adverse reactions or unexpected symptoms promptly",
    "Keep your personal and emergency contact information current",
    "Use the platform's monitoring features consistently for accurate tracking",
];

const DisclaimerGuidelines = () => {
    return (
        <div className="py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header Section */}
                <div className="mx-auto max-w-2xl text-center mb-10">
                    <h2 className="text-base font-semibold leading-7 text-light-primary dark:text-dark-primary">
                        Important Information
                    </h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-light-primary-text dark:text-dark-primary-text sm:text-5xl">
                        Disclaimers & Guidelines
                    </p>
                    <p className="mt-4 text-md text-light-secondary-text text-pretty dark:text-dark-secondary-text">
                        Please review these important notices about using our
                        AI-powered healthcare platform
                    </p>
                </div>

                {/* Disclaimers Grid */}
                <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                    {disclaimers.map((item, index) => (
                        <motion.div
                            key={index}
                            className="relative p-6 rounded-2xl bg-light-surface dark:bg-dark-surface transition-all duration-300 hover:shadow-lg"
                            variants={cardVariant}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-light-primary/10 dark:bg-dark-primary/10">
                                    <item.icon className="h-6 w-6 text-light-primary dark:text-dark-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-light-primary-text dark:text-dark-primary-text">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="text-light-secondary-text dark:text-dark-secondary-text">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Guidelines Section */}
                <motion.div
                    className="relative rounded-2xl bg-linear-to-br from-light-secondary/20 via-light-surface/50 to-light-secondary/10 dark:from-dark-secondary/30 dark:via-dark-surface/50 dark:to-dark-secondary/10 p-8 backdrop-blur-xl"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                >
                    <h3 className="text-2xl font-semibold text-light-primary-text dark:text-dark-primary-text mb-6">
                        Usage Guidelines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {guidelines.map((guideline, index) => (
                            <motion.div key={index} className="flex items-start gap-3" variants={fadeUp}>
                                <div className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-light-primary/10 dark:bg-dark-primary/10">
                                    <div className="h-2.5 w-2.5 rounded-full bg-light-primary dark:bg-dark-primary" />
                                </div>
                                <span className="text-light-secondary-text dark:text-dark-secondary-text">
                                    {guideline}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DisclaimerGuidelines;
