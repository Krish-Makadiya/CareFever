import { Globe, Globe2, Languages } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const GOOGLE_ELEMENT_URL =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

export default function GoogleTranslater() {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const initializedRef = useRef(false);
    const scriptAppendedRef = useRef(false);
    const widgetMountedRef = useRef(false);
    const HIDDEN_CONTAINER_ID = "google_translate_invisible";

    // All Indian languages to show in the list
    const LANGS = [
        { code: "en", label: "English" },
        { code: "hi", label: "Hindi" },
        { code: "bn", label: "Bengali" },
        { code: "te", label: "Telugu" },
        { code: "mr", label: "Marathi" },
        { code: "ta", label: "Tamil" },
        { code: "ur", label: "Urdu" },
        { code: "gu", label: "Gujarati" },
        { code: "kn", label: "Kannada" },
        { code: "ml", label: "Malayalam" },
        { code: "or", label: "Odia" },
        { code: "pa", label: "Punjabi" },
        { code: "as", label: "Assamese" },
        { code: "ne", label: "Nepali" },
        { code: "sd", label: "Sindhi" },
        { code: "sa", label: "Sanskrit" },
    ];

    // Ensure the Google select is visible and readable with our theme
    const styleTranslateSelect = () => {
        const combo =
            document.querySelector < HTMLSelectElement > ".goog-te-combo";
        if (!combo) return false;
        const dark = document.documentElement.classList.contains("dark");
        combo.style.display = "block";
        combo.style.width = "100%";
        combo.style.padding = "8px 10px";
        combo.style.borderRadius = "8px";
        combo.style.border = dark ? "1px solid #374151" : "1px solid #e5e7eb";
        combo.style.background = dark ? "#111827" : "#ffffff";
        combo.style.color = dark ? "#e5e7eb" : "#111827";
        combo.style.outline = "none";
        combo.style.fontSize = "0.875rem";

        // Hide extraneous Google labels/icons if present
        const gadget = document.querySelector(".goog-te-gadget");
        if (gadget) {
            gadget.style.fontSize = "0";
        }
        return true;
    };

    // When a user clicks a language name
    const handleSelect = (lang) => {
        localStorage.setItem("gt-lang", lang);
        applyLanguage(lang);
        setOpen(false);
    };

    // Helper to mount the widget into a hidden container when it's available
    const mountTranslateWidget = () => {
        if (widgetMountedRef.current) return;
        const container = document.getElementById(HIDDEN_CONTAINER_ID);
        if (!container) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    autoDisplay: false,
                    includedLanguages:
                        "en,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,ne,sd,sa",
                    layout: window.google.translate.TranslateElement
                        .InlineLayout.SIMPLE,
                },
                HIDDEN_CONTAINER_ID
            );
            widgetMountedRef.current = true;
            // Re-apply saved language after widget mounts
            const saved = localStorage.getItem("gt-lang");
            if (saved) {
                setTimeout(() => applyLanguage(saved), 100);
            }
            // Style the select after it appears
            setTimeout(() => styleTranslateSelect(), 150);
        } catch {
            // ignore
        }
    };

    // Load Google translator script once
    useEffect(() => {
        if (scriptAppendedRef.current) return;

        window.googleTranslateElementInit = () => {
            if (initializedRef.current) return;
            initializedRef.current = true;
            // Wait for container to exist, then mount
            let tries = 0;
            const iv = setInterval(() => {
                tries++;
                mountTranslateWidget();
                if (widgetMountedRef.current || tries > 40) clearInterval(iv);
            }, 200);
        };

        const s = document.createElement("script");
        s.src = GOOGLE_ELEMENT_URL;
        s.defer = true;
        document.body.appendChild(s);
        scriptAppendedRef.current = true;

        return () => {
            // Keep script and init global
        };
    }, []);

    // Also attempt mounting when popover is opened (container appears)
    useEffect(() => {
        if (!open) return;
        // If Google is already loaded, try to mount immediately and a few retries
        let tries = 0;
        const iv = setInterval(() => {
            tries++;
            if (window.google?.translate) {
                mountTranslateWidget();
            }
            if (widgetMountedRef.current || tries > 20) clearInterval(iv);
        }, 200);
        return () => clearInterval(iv);
    }, [open]);

    // Also restyle when theme toggles while popover open
    useEffect(() => {
        if (!open) return;
        // Attempt a few times in case of delayed render
        let tries = 0;
        const iv = setInterval(() => {
            tries++;
            if (styleTranslateSelect() || tries > 10) clearInterval(iv);
        }, 150);
        return () => clearInterval(iv);
    }, [open]);

    // Close on outside click / ESC
    useEffect(() => {
        const onDocClick = (e) => {
            if (!open) return;
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    // Persist language selection
    useEffect(() => {
        if (!open) return;

        const interval = setInterval(() => {
            const combo =
                document.querySelector < HTMLSelectElement > ".goog-te-combo";
            if (!combo) return;
            const handler = () => {
                const lang = combo.value;
                if (lang) localStorage.setItem("gt-lang", lang);
            };
            combo.addEventListener("change", handler, { once: true });
            clearInterval(interval);
        }, 300);

        return () => clearInterval(interval);
    }, [open]);

    const applyLanguage = (lang) => {
        // First try the official combo if present
        const tryApply = () => {
            const combo =
                document.querySelector < HTMLSelectElement > ".goog-te-combo";
            if (!combo) return false;
            if (combo.value !== lang) {
                combo.value = lang;
                combo.dispatchEvent(new Event("change", { bubbles: true }));
            }
            return true;
        };

        let tries = 0;
        const timer = setInterval(() => {
            tries++;
            const ok = tryApply();
            if (ok || tries > 12) {
                clearInterval(timer);
                if (!ok) {
                    // Fallback: set googtrans cookie and reload once
                    const base = `/en/${lang}`;
                    const set = (cookie) => (document.cookie = cookie);
                    set(`googtrans=${base}; path=/`);
                    set(
                        `googtrans=${base}; path=/; domain=${location.hostname}`
                    );
                    if (!sessionStorage.getItem("gt-reloaded")) {
                        sessionStorage.setItem("gt-reloaded", "1");
                        location.reload();
                    } else {
                        sessionStorage.removeItem("gt-reloaded");
                    }
                }
            }
        }, 250);
    };

    return (
        <div ref={wrapperRef} className="relative z-10">
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Translate page"
                className="flex items-center gap-2 px-3 py-1 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-colors">
                <Languages/>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 min-w-[260px] rounded-xl border border-neutral-200 dark:border-neutral-700 bg-light-surface dark:bg-dark-surface backdrop-blur shadow-card p-3 z-60">
                    <div className="text-xs font-medium mb-2 text-neutral-500 dark:text-neutral-300">
                        Choose language
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        {LANGS.map((l) => (
                            <button
                                key={l.code}
                                className="text-left text-sm px-2 py-1 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                onClick={() => handleSelect(l.code)}>
                                {l.label}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                        Powered by Google Translate
                    </div>
                </div>
            )}

            {/* Hidden container for Google widget (required for official translate) */}
            <div id={HIDDEN_CONTAINER_ID} className="hidden" />
        </div>
    );
}
