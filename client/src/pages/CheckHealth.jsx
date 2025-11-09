import React, { useMemo, useState } from "react";
import {
    Stethoscope,
    HeartPulse,
    AlertTriangle,
    Leaf,
    Pill,
    Clock,
    Mic,
    X,
    Plus,
    RefreshCcw,
    CheckCircle2,
    Languages,
    Save,
    Info,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import AiHealthInsight from "../components/AiHealthInsight";
import Loader from "../components/Loader";

const COMMON_SYMPTOMS = [
    // Core fever symptoms (from previous list)
    "Chills",
    "Sweating",
    "Body Aches",
    "Headache",
    "Fatigue",
    "Weakness",
    "Loss of Appetite",

    // Symptoms from common causes (respiratory/digestive)
    "Cough",
    "Sore Throat",
    "Runny Nose",
    "Stuffy Nose",
    "Nausea",
    "Vomiting",
    "Diarrhea",
];

function SymptomTag({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm">
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="hover:opacity-80"
                aria-label={`Remove ${label}`}>
                <X className="w-3.5 h-3.5" />
            </button>
        </span>
    );
}

const CheckHealth = () => {
    const [input, setInput] = useState("");
    const [symptoms, setSymptoms] = useState([]);
    const [language, setLanguage] = useState("en");
    const [recording, setRecording] = useState(false);
    const [aiInsight, setAiInsight] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [privateData, setPrivateData] = useState({
        gender: "",
        age: "",
    });

    const { user, isLoaded } = useUser();

    const canSubmit = useMemo(
        () => symptoms.length > 0 || input.trim().length > 0,
        [symptoms, input]
    );

    const addSymptom = (label) => {
        const normalized = label.trim();
        if (!normalized) return;
        setSymptoms((prev) =>
            prev.includes(normalized) ? prev : [...prev, normalized]
        );
        setInput("");
    };

    const removeSymptom = (label) => {
        setSymptoms((prev) => prev.filter((s) => s !== label));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSymptom(input);
        }
    };

    const handleCommonClick = (label) => addSymptom(label);

    const handleClear = () => {
        setSymptoms([]);
        setInput("");
        setAiInsight(null);
        setPrivateData({
            gender: "",
            age: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        const prompt = `
        You are "CareFever," an AI-based fever assistant (not a doctor).
        Your primary role is to analyze a user's fever and related symptoms to provide clear, structured, and simple health insights.
        You must be empathetic and use non-technical, easy-to-understand language.

        ### User Input:
        - Full Name: Krish Makadiya
        - Age: 20
}
        - Gender: Male
        - Previous Medical History: N/A
        - Fever Temperature: 102°F
        - Fever Duration: 2 days
        - Reported Symptoms: ${
            Array.isArray(symptoms) && symptoms.length
                ? symptoms.join(", ")
                : "N/A"
        } (e.g., "cough, body ache, sore throat, headache")
        - Description of Feelings: ${input.trim() || "N/A"}

        ### Your Tasks (Fever-Specific):
        1. Fever Severity Analysis: Provide an overall assessment of the fever's state: Mild / Moderate / High-Risk. Base this on temperature, age, duration, and other symptoms.
        2. Possible Fever Causes: List 2-3 possible *types* of causes (not specific diseases). Give a confidence percentage and a simple reason. Focus on common causes like viral or bacterial infections.
        3. Fever Management Tips: Provide safe, non-medical home remedies specifically for fever comfort.
        4. Fever Reducer Suggestions: Suggest appropriate over-the-counter (OTC) medicines for fever (e.g., paracetamol, ibuprofen). **Crucially, add warnings** (e.g., "Always follow package dosing," "Do not give Aspirin to children").
        5. Urgent Care Red Flags: This is the most important task. Analyze the input for specific red flags associated with fever. Clearly state if immediate medical attention is needed.
        6. Supportive Care Advice: Suggest general actions to help the body recover (hydration, rest).
        7. Medical Disclaimer: Always end with the required disclaimer.

        ### Output Format (JSON only):
        {
          "feverSeverity": "Mild | Moderate | High-Risk",
          "possibleFeverCauses": [
            {
              "name": "e.g., Viral Infection (like Flu or Common Cold)",
              "confidence": "e.g., 80%",
              "reason": "e.g., Fever with body aches and a cough often points to a virus."
            },
            {
              "name": "e.g., Bacterial Infection (like Strep Throat)",
              "confidence": "e.g., 60%",
              "reason": "e.g., High fever and a very sore throat could be a bacterial issue."
            }
          ],
          "feverManagementTips": [
            "Take a lukewarm (not cold) sponge bath to help cool your body.",
            "Wear light, breathable clothing and use only a light blanket.",
            "Place a cool, damp cloth on your forehead."
          ],
          "otcMedicines": [
            "Paracetamol (Acetaminophen) can help reduce fever and relieve aches. Always follow the instructions on the package and do not take more than the recommended dose.",
            "Ibuprofen can also help with fever and inflammation. Do not take it on an empty stomach.",
            "Important: Do not give Aspirin to children or teenagers, as it can cause a rare but serious condition called Reye's syndrome."
          ],
          "urgentCareAlert": {
            "trigger": "Yes | No",
            "message": "e.g., 'Yes, your reported stiff neck and high fever are serious signs. Please seek emergency medical care immediately.' OR 'No, your symptoms sound manageable at home for now, but watch for these red flags.'"
          },
          "redFlagsToWatchFor": [
            "Fever above 104°F (40°C) that doesn't come down with medicine",
            "Fever lasting more than 3 days",
            "Severe headache or a stiff neck",
            "Difficulty breathing or chest pain",
            "Confusion, extreme sleepiness, or difficulty waking up",
            "A skin rash that looks like small bruises",
            "Seizures or convulsions",
            "Any high fever in a baby less than 3 months old"
          ],
          "supportiveCare": [
            "Drink plenty of fluids like water, clear broths, or electrolyte drinks to prevent dehydration.",
            "Get as much rest as possible. Your body needs energy to fight the infection."
          ],
          "disclaimer": "This is not a medical diagnosis. I am an AI assistant, not a doctor. Please consult a licensed doctor for professional advice."
        }
        `.trim();

        if (!canSubmit) return;

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/ai/generate-remedy`,
                {
                    params: {
                        prompt,
                    },
                }
            );
            console.log(res.data);
            setAiInsight(res.data);

            return res.data;
        } catch (e) {
            console.log(e);
        } finally {
            setButtonLoading(false);
        }
    };

    const toggleVoice = () => {
        setRecording((r) => !r);
    };

    const saveProfileHandler = async (e) => {
        e.preventDefault();

        await toast.promise(
            (async () => {
                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_SERVER_URL}/save-profile`,
                        {
                            userId: user.id,
                            ...aiInsight,
                            input,
                            symptoms,
                        }
                    );
                    console.log(res.data);

                    setInput("");
                    setSymptoms([]);
                    setAiInsight(null);
                } catch (error) {
                    console.log(error);
                }
            })(),
            {
                loading: "Saving your health profile...",
                success: (data) => `Profile saved successfully!`,
                error: (err) => `Failed to save profile.`,
            }
        );
    };

    if (isLoading || !isLoaded) {
        return <Loader />;
    }

    return (
        <div className="w-full max-w-6xl mx-auto min-h-screen py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Card */}
                <div className="lg:col-span-2 bg-light-surface dark:bg-dark-surface rounded-2xl shadow p-5">
                    <div className="flex items-start gap-2 mb-6">
                            <HeartPulse className="w-7 h-7 text-light-primary dark:text-dark-primary" />
                            <h3 className="font-semibold text-lg text-light-primary-text dark:text-dark-primary-text">
                                Describe your symptoms
                            </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={4}
                                placeholder="Describe how you feel or press Enter to add..."
                                className="w-full rounded-xl bg-light-bg dark:bg-dark-bg border border-light-secondary-text/20 dark:border-dark-secondary-text/20 bg-light-background dark:bg-dark-background text-light-primary-text dark:text-dark-primary-text px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                            />
                            <button
                                type="button"
                                onClick={toggleVoice}
                                className={`absolute right-3 bottom-3 p-2 rounded-lg transition ${
                                    recording
                                        ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                                        : "bg-light-background dark:bg-dark-background text-light-secondary-text dark:text-dark-secondary-text"
                                }`}
                                title="Voice Input"
                                aria-pressed={recording}>
                                <Mic className="w-4 h-4" />
                            </button>
                        </div>

                        <div>
                            <label
                                htmlFor="privateData"
                                className="block mb-2 text-sm font-medium text-light-primary-text dark:text-dark-primary-text">
                                Private Information
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Age"
                                    value={privateData.age}
                                    onChange={(e) =>
                                        setPrivateData((prev) => ({
                                            ...prev,
                                            age: e.target.value,
                                        }))
                                    }
                                    className="w-1/2 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-secondary-text/20 dark:border-dark-secondary-text/20 bg-light-background dark:bg-dark-background text-light-primary-text dark:text-dark-primary-text px-4 py-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                                />
                                <select
                                    value={privateData.gender}
                                    onChange={(e) =>
                                        setPrivateData((prev) => ({
                                            ...prev,
                                            gender: e.target.value,
                                        }))
                                    }
                                    className="w-1/2 rounded-xl border bg-light-bg dark:bg-dark-bg border-light-secondary-text/20 dark:border-dark-secondary-text/20 bg-light-background dark:bg-dark-background text-light-primary-text dark:text-dark-primary-text px-4 py-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Selected Symptoms */}
                        {(symptoms.length > 0 || input.trim()) && (
                            <div className="flex flex-wrap gap-2">
                                {symptoms.map((s) => (
                                    <SymptomTag
                                        key={s}
                                        label={s}
                                        onRemove={() => removeSymptom(s)}
                                    />
                                ))}
                                {input.trim() && (
                                    <button
                                        type="button"
                                        onClick={() => addSymptom(input)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-sm hover:opacity-90">
                                        <Plus className="w-3.5 h-3.5" /> Add "
                                        {input.trim()}"
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl  p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                <h4 className="font-semibold text-light-primary-text dark:text-dark-primary-text">
                                    Common symptoms
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {COMMON_SYMPTOMS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleCommonClick(s)}
                                        type="button"
                                        className="px-3 py-1.5 rounded-full  text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-bg/50 dark:hover:bg-dark-bg/50 bg-light-bg dark:bg-dark-bg text-sm">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-4 py-2 rounded-xl border border-light-secondary-text/20 dark:border-dark-secondary-text/20 text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-background dark:hover:bg-dark-background">
                                <RefreshCcw className="w-4 h-4 inline mr-2" />{" "}
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="px-4 py-2 rounded-xl bg-light-primary dark:bg-dark-primary text-white hover:bg-light-primary-dark dark:hover:bg-dark-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">
                                {buttonLoading ? (
                                    "Analyzing..."
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 inline mr-2" />{" "}
                                        Check Health
                                    </>
                                )}
                            </button>
                        </div>

                        {aiInsight && <AiHealthInsight aiInsight={aiInsight} />}
                    </form>
                </div>

                {/* Common Symptoms & Info */}
                <div className="space-y-6">
                    <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Pill className="w-5 h-5 text-fuchsia-600" />
                            <h4 className="font-semibold text-light-primary-text dark:text-dark-primary-text">
                                What you get
                            </h4>
                        </div>
                        <ul className="list-disc pl-5 text-sm text-light-secondary-text dark:text-dark-secondary-text space-y-1">
                            <li>
                                AI analysis: Good / Mild / Moderate / Severe
                            </li>
                            <li>Possible diseases with confidence score</li>
                            <li>
                                Simple remedies and OTC medicine suggestions
                            </li>
                            <li>
                                Accessible UI with large icons and clear
                                language
                            </li>
                        </ul>
                    </div>

                    <div className="bg-light-surface dark:bg-dark-surface rounded-2xl shadow p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Leaf className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-semibold text-light-primary-text dark:text-dark-primary-text">
                                Accessibility
                            </h4>
                        </div>
                        <p className="text-sm text-light-secondary-text dark:text-dark-secondary-text">
                            Voice input, large icons, adjustable font size,
                            multilingual support.
                        </p>
                        <div className="flex items-center gap-2 text-xs mt-2 text-light-secondary-text dark:text-dark-secondary-text">
                            <Clock className="w-4 h-4" /> Results will appear in
                            the browser console after submitting.
                        </div>
                    </div>

                    {aiInsight && (
                        <div className="flex flex-col gap-4 bg-light-surface dark:bg-dark-surface rounded-2xl p-5">
                            <button
                                onClick={saveProfileHandler}
                                className="flex items-center justify-center gap-2 px-4 py-3  bg-light-secondary dark:bg-dark-secondary rounded-md text-white w-full transition-colors">
                                <Save className="w-5 h-5" />
                                Save to My Profile
                            </button>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-light-secondary-text dark:text-dark-secondary-text">
                                    <Info size={20} />
                                    <p className="text-sm">Disclaimer</p>
                                </div>
                                <p className="text-xs text-light-secondary-text dark:text-dark-secondary-text">
                                    Not medical advice. For reference only. Will
                                    be saved to your profile and give reminders.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckHealth;
