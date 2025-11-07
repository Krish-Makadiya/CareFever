import React from "react";
import { useTheme } from "../context/ThemeProvider";

const Loader = () => {
    const { theme } = useTheme();

    return (
        <div className="flex-col gap-4 w-full h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
            <div className="w-20 h-20 border-4 border-transparent text-light-primary dark:text-dark-primary text-4xl animate-spin flex items-center justify-center border-t-light-primary dark:border-t-dark-primary rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-light-secondary dark:text-dark-secondary text-2xl animate-spin flex items-center justify-center border-t-light-secondary dark:border-t-dark-secondary rounded-full"></div>
            </div>
        </div>
    );
};

export default Loader;
