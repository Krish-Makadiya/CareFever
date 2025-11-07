import { useUser } from "@clerk/clerk-react";
import CTASection from "../components/CTASection";
import DisclaimerGuidelines from "../components/DisclaimerGuidelines";
import FeautureSection from "../components/FeautureSection";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";
import LandingPage from "../components/LandingPage";
import Loader from "../components/Loader";

const Homepage = () => {
    const { isLoaded } = useUser();

    if (!isLoaded) {
        return <Loader />;
    }

    return (
        <div>
            <LandingPage />
            <FeautureSection />
            <HowItWorks />
            <DisclaimerGuidelines />
            <CTASection />
            <Footer />
        </div>
    );
};

export default Homepage;
