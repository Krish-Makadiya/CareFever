import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ArrowRight, BracesIcon, MoveLeft, MoveRight, X } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

const navigation = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Company", href: "#" },
];

export default function LandingPage() {
    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } },
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const subtle = { scale: 1, transition: { duration: 0.15 } };

    return (
        <div className="">
            <header className="absolute inset-x-0 top-0 z-50">
                <Navbar />
            </header>
            <div className="relative isolate">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-light-primary to-light-secondary dark:opacity-30 opacity-60 sm:left-[calc(50%-30rem)] sm:w-288.75"
                    />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-auto">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-5 py-2 text-sm/6 flex text-light-secondary-text dark:text-dark-secondary-text ring-1 ring-dark-bg/10 dark:ring-light-bg/10 hover:ring-dark-bg/20 hover:dark:ring-light-bg/20 duration-200">
                            <p>
                                Project in development. Learn more or contribute
                                on{" "}
                            </p>
                            <a
                                href="https://github.com/Krish-Makadiya/CareFever"
                                target="_blank"
                                className="font-semibold text-light-secondary dark:text-dark-secondary ml-2">
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                />
                                <div className="flex items-center gap-1">
                                    <p>Read more</p>
                                    <MoveRight size={20} />
                                </div>
                            </a>
                        </div>
                    </div>
                    <motion.div
                        className="text-center"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible">
                        <motion.h1
                            variants={fadeUp}
                            className="text-4xl md:text-6xl font-semibold tracking-tight text-balance text-light-primary-text dark:text-dark-primary-text">
                            <span className="text-light-primary dark:text-dark-primary">
                                AI-powered
                            </span>{" "}
                            guidance for fever sufferers
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            className="mt-8 text-sm md:text-lg text-pretty text-light-secondary-text dark:text-dark-secondary-text">
                            Personalized advice and triage driven by AI and
                            community-shared symptom data. Learn, contribute,
                            and get timely support.
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            className="mt-10 flex justify-center gap-x-6">
                            <SignInButton
                                className="inline-block rounded-lg px-3 py-2.5 text-sm/6 bg-linear-to-r dark:from-[#f4f4f9] dark:to-light-surface from-dark-bg to-dark-surface dark:text-black text-white font-semibold"
                                mode="modal"
                                navigate="/sign-up">
                                Get Started
                            </SignInButton>

                            <motion.div
                                whileHover={{ x: 4 }}
                                className="text-sm text-light-primary-text dark:text-dark-primary-text bg-light-primary/20 dark:bg-dark-primary/20 px-3 py-2 rounded-lg">
                                    <p>Username: <span className="text-light-primary dark:text-dark-primary font-semibold">Demo</span></p>
                                    <p>Password: <span className="text-light-primary dark:text-dark-primary font-semibold">carefever@123</span></p>
                                </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>{" "}
        </div>
    );
}
