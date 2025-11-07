import React, { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import {
    Mail,
    MessageCircleMore,
    Phone,
    PhoneMissed,
    PhoneOutgoing,
    TriangleAlert,
} from "lucide-react";
import Loader from "../components/Loader";

const CareAI = ({ apiKey, assistantId }) => {
    const [vapi, setVapi] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState([]);

    // 1. Renamed for clarity: tracks call connection attempt.
    const [isConnecting, setIsConnecting] = useState(false);

    // 2. New state for initial component/Vapi setup.
    const [isInitializing, setIsInitializing] = useState(true);

    const scrollRef = useRef(null);

    // Effect for auto-scrolling the transcript
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript]);

    useEffect(() => {
        const vapiInstance = new Vapi(import.meta.env.VITE_VAPI_API_KEY);
        setVapi(vapiInstance);

        vapiInstance.on("call-start", () => {
            console.log("Call started");
            setIsConnected(true);
            setIsConnecting(false); // 4. Stop connecting loader *after* call starts
        });
        vapiInstance.on("call-end", () => {
            console.log("Call ended");
            setIsConnected(false);
            setIsSpeaking(false);
            setIsConnecting(false); // 4. Also stop loader if call ends
        });
        vapiInstance.on("speech-start", () => {
            console.log("Assistant started speaking");
            setIsSpeaking(true);
        });
        vapiInstance.on("speech-end", () => {
            console.log("Assistant stopped speaking");
            setIsSpeaking(false);
        });
        vapiInstance.on("message", (message) => {
            if (message.type === "transcript") {
                if (
                    message.type === "transcript" &&
                    message.transcriptType == "final"
                ) {
                    setTranscript((prev) => [
                        ...prev,
                        {
                            role: message.role,
                            text: message.transcript,
                        },
                    ]);
                }
            }
        });
        vapiInstance.on("error", (error) => {
            console.error("Vapi error:", error);
            setIsConnecting(false); // 4. Also stop loader on error
        });

        // 2. Vapi is set up, so initialization is complete.
        setIsInitializing(false);

        return () => {
            vapiInstance?.stop();
        };
    }, [import.meta.env.VITE_VAPI_API_KEY]); // Dependency array is correct: re-init if apiKey changes.

    const startCall = () => {
        setIsConnecting(true); // 4. Only set connecting to true here.
        if (vapi) {
            // 3. Bug Fix: Use the assistantId prop.
            vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID);
        }
    };

    const endCall = () => {
        if (vapi) {
            vapi.stop();
            setTranscript([]);
        }
    };

    // 2. Render initial loading state for the whole page.
    if (isInitializing) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
                <p className="ml-2 text-light-primary-text dark:text-dark-primary-text">
                    Initializing Assistant...
                </p>
            </div>
        );
    }

    // Main component render
    return (
        <div>
            {/* Page Header */}
            <div className="max-w-7xl min-h-screen mx-auto py-8">
                <h1 className="text-3xl font-bold mb-1 text-light-primary-text dark:text-dark-primary-text">
                    Welcome to CareAI
                </h1>
                <p className="text-light-secondary-text dark:text-dark-secondary-text mb-6">
                    Your AI-powered fever management assistant. Get personalized
                    advice and support for fever symptoms.
                </p>

                {/* --- Your Warning/Beta Notices Here --- */}
                <div className="bg-light-secondary/15 dark:bg-dark-secondary/10 border-l-4 flex gap-2 items-center border-light-secondary dark:border-dark-secondary text-light-secondary dark:text-dark-secondary p-4 rounded-md mb-3">
                    <p>
                        <strong>Beta Notice:</strong> CareAI is currently in
                        beta. While we strive for accuracy, the AI's advice may
                        not always be perfect. Please use your discretion and
                        consult a healthcare professional for serious concerns.
                    </p>
                </div>
                <div className="bg-yellow-100/80 dark:bg-yellow-100/10 border-l-4 flex gap-2 items-center border-yellow-500   text-yellow-700 dark:text-yellow-200 p-4 rounded-md mb-6">
                    <TriangleAlert className="" size={50} />
                    <p>
                        <strong>Note:</strong> CareAI is an AI assistant
                        designed to provide general information about fever
                        management. It is not a substitute for professional
                        medical advice, diagnosis, or treatment. Always seek the
                        advice of your physician or other qualified health
                        provider with any questions you may have regarding a
                        medical condition.
                    </p>
                </div>
                {/* --- End Notices --- */}

                <div className="flex justify-center gap-[2%]">
                    {/* Call Interface */}
                    <div className=" self-baseline bg-light-bg dark:bg-dark-bg rounded-lg flex justify-center p-6 mb-8">
                        {!isConnected ? (
                            // 4. Updated button to show connecting state
                            <button
                                className="flex gap-2 items-center bg-light-primary dark:bg-dark-primary text-white border-none rounded-full px-5 py-4 text-base font-bold cursor-pointer transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-wait"
                                onClick={startCall}
                                disabled={isConnecting}>
                                {isConnecting ? (
                                    <>
                                        <p>Connecting...</p>
                                    </>
                                ) : (
                                    <>
                                        <PhoneOutgoing />{" "}
                                        <p>Talk to Assistant</p>
                                    </>
                                )}
                            </button>
                        ) : (
                            // This is the "call connected" UI
                            <div className="bg-dark-surface rounded-xl p-5 w-[600px]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`${
                                                isSpeaking
                                                    ? "bg-[#ff4444] animate-pulse"
                                                    : "bg-[#12A594]"
                                            } w-3 h-3 rounded-full`}></div>
                                        <span className="font-bold text-dark-primary-text">
                                            {isSpeaking
                                                ? "Assistant Speaking..."
                                                : "Listening..."}
                                        </span>
                                    </div>
                                    <button
                                        onClick={endCall}
                                        className="bg-[#ff4444] flex gap-2 items-center text-white border-none rounded-md px-3 py-1.5 text-xs cursor-pointer">
                                        <PhoneMissed />
                                        <p>End Call</p>
                                    </button>
                                </div>

                                <div
                                    ref={scrollRef}
                                    style={{
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                    }}
                                    className="max-h-[300px] overflow-y-auto mb-3 p-2 bg-light-bg dark:bg-dark-bg rounded-lg">
                                    {transcript.length === 0 ? (
                                        <p className="text-[#666] text-sm m-0">
                                            Conversation will appear here...
                                        </p>
                                    ) : (
                                        transcript.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={`mb-2 ${
                                                    msg.role === "user"
                                                        ? "text-right"
                                                        : "text-left"
                                                }`}>
                                                <span
                                                    className={`${
                                                        msg.role === "user"
                                                            ? "bg-[#12A594]"
                                                            : "bg-[#333]"
                                                    } text-white px-3 py-2 rounded-xl inline-block text-sm max-w-[80%]`}>
                                                    {msg.text}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareAI;
