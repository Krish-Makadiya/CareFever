import { SignUpButton, useAuth, UserButton } from "@clerk/clerk-react";
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { motion } from "framer-motion";
import {
    ChartPie,
    ChevronDown,
    CirclePlay,
    Fingerprint,
    Grid2x2Plus,
    Menu,
    Moon,
    MousePointerClick,
    Phone,
    RefreshCw,
    Sun,
    X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleTranslate from "./GoogleTranslate";
import { useTheme } from "../context/ThemeProvider";

const products = [
    {
        name: "Analytics",
        description: "Get a better understanding of your traffic",
        href: "#",
        icon: ChartPie,
    },
    {
        name: "Engagement",
        description: "Speak directly to your customers",
        href: "#",
        icon: MousePointerClick,
    },
    {
        name: "Security",
        description: "Your customers’ data will be safe and secure",
        href: "#",
        icon: Fingerprint,
    },
    {
        name: "Integrations",
        description: "Connect with third-party tools",
        href: "#",
        icon: Grid2x2Plus,
    },
    {
        name: "Automations",
        description: "Build strategic funnels that will convert",
        href: "#",
        icon: RefreshCw,
    },
];
const callsToAction = [
    { name: "Watch demo", href: "#", icon: CirclePlay },
    { name: "Contact sales", href: "#", icon: Phone },
];

const navStagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};
const navItemAnim = {
    hidden: { opacity: 0, y: -16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 120 },
    },
};
const iconAnim = {
    whileHover: { scale: 1.18, rotate: 8 },
    whileTap: { scale: 0.92, rotate: -8 },
};
const buttonAnim = {
    whileHover: { scale: 1.06 },
    whileTap: { scale: 0.96 },
};

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const { isSignedIn } = useAuth();

    return (
        <header>
            <nav className="mx-auto flex max-w-7xl items-center justify-between py-4 px-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <motion.a
                        className="flex items-center gap-2"
                        href="/"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <img
                            alt=""
                            src={!theme ? "/logo-dark.png" : "/logo-light.png"}
                            className="h-10 w-auto"
                        />
                        <span className="text-xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            CareFever
                        </span>
                    </motion.a>
                </div>
                <div className="flex lg:hidden">
                    <motion.button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 border-none"
                        {...iconAnim}>
                        <span className="sr-only">Open main menu</span>
                        <Menu aria-hidden="true" className="size-6" />
                    </motion.button>
                </div>
                <motion.div
                    className="hidden lg:flex lg:gap-x-12"
                    variants={navStagger}
                    initial="hidden"
                    animate="visible">
                    <motion.a
                        href="/check-health"
                        className=" font-semibold text-light-primary-text dark:text-dark-primary-text"
                        variants={navItemAnim}
                        {...buttonAnim}>
                        Check Health
                    </motion.a>
                    <div className="flex items-center gap-1">
                        <motion.a
                            href="/care-ai"
                            className="font-semibold text-light-primary-text dark:text-dark-primary-text"
                            variants={navItemAnim}
                            {...buttonAnim}>
                            CareAI
                        </motion.a>
                        <motion.p
                            variants={navItemAnim}
                            className="text-sm text-light-secondary dark:text-dark-secondary bg-light-secondary/15 dark:bg-dark-secondary/15 px-2 py-1 rounded-lg">
                            Beta
                        </motion.p>
                    </div>
                    <motion.a
                        href="/medi-news"
                        className="font-semibold text-light-primary-text dark:text-dark-primary-text"
                        variants={navItemAnim}
                        {...buttonAnim}>
                        Medi-News
                    </motion.a>
                </motion.div>

                <motion.div
                    className="hidden lg:flex lg:flex-1 lg:justify-end gap-8 items-center"
                    variants={navStagger}
                    initial="hidden"
                    animate="visible">
                    <div className="flex items-center gap-2">
                        {theme ? (
                            <motion.span {...iconAnim}>
                                <Sun
                                    onClick={() => setTheme(!theme)}
                                    className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text"
                                />
                            </motion.span>
                        ) : (
                            <motion.span {...iconAnim}>
                                <Moon
                                    onClick={() => setTheme(!theme)}
                                    className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text"
                                />
                            </motion.span>
                        )}
                        <GoogleTranslate />
                    </div>

                    {isSignedIn ? (
                        <motion.div
                            className="flex gap-3 items-center"
                            variants={navItemAnim}>
                            <motion.button
                                className="font-semibold text-light-primary-text dark:text-dark-primary-text"
                                onClick={() => navigate("/dashboard")}
                                {...buttonAnim}>
                                Dashboard
                            </motion.button>
                            <motion.div {...iconAnim}>
                                <UserButton />
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="flex gap-8"
                            variants={navItemAnim}>
                            <motion.div {...buttonAnim}>
                                <SignUpButton
                                    className="inline-block rounded-lg px-3 py-2.5 text-sm/6 bg-linear-to-r dark:from-[#f4f4f9] dark:to-light-surface from-dark-bg to-dark-surface dark:text-black text-white font-semibold"
                                    mode="modal"
                                    navigate="/sign-up">
                                    Login
                                </SignUpButton>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </nav>
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="lg:hidden">
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-light-bg dark:bg-dark-bg px-6 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt=""
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                            />
                        </a>
                        <motion.button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-light-secondary-text dark:text-dark-secondary-text"
                            {...iconAnim}>
                            <span className="sr-only">Close menu</span>
                            <X aria-hidden="true" className="size-6" />
                        </motion.button>
                    </div>
                    <div className="mt-6 flow-root">
                        <motion.div
                            className="-my-6 divide-y dark:divide-dark-secondary-text/40 divide-light-secondary-text/40"
                            variants={navStagger}
                            initial="hidden"
                            animate="visible">
                            <div className="space-y-2 py-6">
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton
                                        as={motion.button}
                                        className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold hover:bg-light-surface dark:hover:bg-dark-surface text-light-primary-text dark:text-dark-primary-text"
                                        {...buttonAnim}>
                                        Product
                                        <ChevronDown
                                            aria-hidden="true"
                                            className="size-5 flex-none group-data-open:rotate-180"
                                        />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">
                                        {[...products, ...callsToAction].map(
                                            (item, idx) => (
                                                <DisclosureButton
                                                    key={item.name}
                                                    as={motion.a}
                                                    href={item.href}
                                                    className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-light-primary-text dark:text-dark-primary-text font-semibold hover:bg-light-surface dark:hover:bg-dark-surface"
                                                    variants={navItemAnim}
                                                    initial="hidden"
                                                    animate="visible"
                                                    transition={{
                                                        delay: idx * 0.04,
                                                    }}>
                                                    {item.name}
                                                </DisclosureButton>
                                            )
                                        )}
                                    </DisclosurePanel>
                                </Disclosure>
                                <motion.a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface"
                                    variants={navItemAnim}
                                    {...buttonAnim}>
                                    Features
                                </motion.a>
                                <motion.a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface"
                                    variants={navItemAnim}
                                    {...buttonAnim}>
                                    Marketplace
                                </motion.a>
                                <motion.a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface"
                                    variants={navItemAnim}
                                    {...buttonAnim}>
                                    Company
                                </motion.a>
                            </div>
                            <div className="py-4">
                                {isSignedIn ? (
                                    <motion.div
                                        className="flex gap-3 items-center flex-column"
                                        variants={navItemAnim}>
                                        <motion.div {...iconAnim}>
                                            <UserButton />
                                        </motion.div>

                                        <motion.button
                                            onClick={() =>
                                                navigate("/dashboard")
                                            }
                                            className="font-semibold text-light-primary-text dark:text-dark-primary-text"
                                            {...buttonAnim}>
                                            Dashboard
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="flex gap-8"
                                        variants={navItemAnim}>
                                        <motion.div {...buttonAnim}>
                                            <SignUpButton
                                                className="inline-block rounded-lg px-3 py-2.5 text-sm/6 font-semibold dark:text-light-primary-text text-dark-primary-text bg-light-primary dark:bg-dark-primary hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover focus-visible:outline-offset-2 focus-visible:outline-light-primary"
                                                mode="modal"
                                                navigate="/sign-up">
                                                Login
                                            </SignUpButton>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </div>
                            <div className="py-4 flex">
                                {theme ? (
                                    <motion.div
                                        className="flex items-center gap-3"
                                        onClick={() => setTheme(!theme)}
                                        {...iconAnim}>
                                        <p className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                            Light Mode
                                        </p>
                                        <Sun className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="flex items-center gap-3"
                                        onClick={() => setTheme(!theme)}
                                        {...iconAnim}>
                                        <p className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                            Dark Mode
                                        </p>
                                        <Moon className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
