import { SignUpButton, useAuth, UserButton } from "@clerk/clerk-react";
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from "@headlessui/react";
import {
    ChartPie,
    ChevronDown,
    CirclePlay,
    Fingerprint,
    Menu,
    Moon,
    MousePointerClick,
    Phone,
    RefreshCw,
    Sun,
    Grid2x2Plus,
    X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

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
                        href="/"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <img
                            alt=""
                            src={
                                !theme
                                    ? "/logo-dark-bnw.png"
                                    : "/logo-light-bnw.png"
                            }
                            className="h-10 w-auto"
                        />
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
                    <Popover className="relative">
                        <PopoverButton
                            as={motion.button}
                            variants={navItemAnim}
                            className="flex items-center gap-x-1 text-sm/6 font-semibold outline-none cursor-pointer text-light-primary-text dark:text-dark-primary-text"
                            {...buttonAnim}>
                            Product
                            <ChevronDown
                                aria-hidden="true"
                                className="size-5 flex-none text-light-primary-text dark:text-dark-primary-text"
                            />
                        </PopoverButton>
                        <PopoverPanel
                            transition
                            className="absolute top-full -left-8 z-50 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-light-surface dark:bg-dark-surface shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                            <div className="p-4 ">
                                {products.map((item, idx) => (
                                    <motion.div
                                        key={item.name}
                                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-100 dark:hover:bg-dark-bg"
                                        variants={navItemAnim}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ delay: idx * 0.04 }}>
                                        <motion.div
                                            className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-bg group-hover:bg-white dark:group-hover:bg-dark-surface"
                                            {...iconAnim}>
                                            <item.icon
                                                aria-hidden="true"
                                                className="size-6 text-light-secondary-text group-hover:text-light-primary dark:group-hover:text-dark-primary"
                                            />
                                        </motion.div>
                                        <div className="flex-auto">
                                            <a
                                                href={item.href}
                                                className="block font-semibold border-none text-light-primary-text dark:text-dark-primary-text">
                                                {item.name}
                                                <span className="absolute inset-0" />
                                            </a>
                                            <p className="mt-1 text-light-secondary-text dark:text-dark-secondary-text">
                                                {item.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 divide-x">
                                {callsToAction.map((item, idx) => (
                                    <motion.a
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold border-none hover:bg-gray-100 dark:hover:bg-dark-bg"
                                        {...buttonAnim}
                                        transition={{ delay: idx * 0.04 }}>
                                        <item.icon
                                            aria-hidden="true"
                                            className="size-5 flex-none text-light-secondary-text dark:text-dark-secondary-text"
                                        />
                                        {item.name}
                                    </motion.a>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover>
                    <motion.a
                        href="/about-us"
                        className="text-sm/6 font-semibold text-light-primary-text dark:text-dark-primary-text"
                        variants={navItemAnim}
                        {...buttonAnim}>
                        About Us
                    </motion.a>
                    <motion.a
                        href="/pricing"
                        className="text-sm/6 font-semibold text-light-primary-text dark:text-dark-primary-text"
                        variants={navItemAnim}
                        {...buttonAnim}>
                        Pricing
                    </motion.a>
                    <motion.a
                        href="/contact-us"
                        className="text-sm/6 font-semibold text-light-primary-text dark:text-dark-primary-text"
                        variants={navItemAnim}
                        {...buttonAnim}>
                        Contact Us
                    </motion.a>
                </motion.div>
                <motion.div
                    className="hidden lg:flex lg:flex-1 lg:justify-end gap-8 items-center"
                    variants={navStagger}
                    initial="hidden"
                    animate="visible">
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

                    {isSignedIn ? (
                        <motion.div
                            className="flex gap-3 items-center"
                            variants={navItemAnim}>
                            <motion.button
                                className="text-sm/6 font-semibold"
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
                                    className="inline-block rounded-lg px-3 py-2.5 text-sm/6 bg-gradient-to-r dark:from-[#f4f4f9] dark:to-[#ffffff] from-[#181818] to-[#262626] dark:text-black text-white font-semibold"
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
                                            className="text-sm/6 font-semibold text-light-primary-text dark:text-dark-primary-text"
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
