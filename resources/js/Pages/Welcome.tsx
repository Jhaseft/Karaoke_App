import { Head } from '@inertiajs/react';
import WelcomeLayout from '@/Layouts/WelcomeLayout';
import HeroSection from '@/Components/Welcome/HeroSection';
import FeaturesSection from '@/Components/Welcome/FeaturesSection';
import StatsSection from '@/Components/Welcome/StatsSection';
import HowItWorksSection from '@/Components/Welcome/HowItWorksSection';
import CategoriesSection from '@/Components/Welcome/CategoriesSection';
import CtaBanner from '@/Components/Welcome/CtaBanner';
import WelcomeFooter from '@/Components/Welcome/WelcomeFooter';

export default function Welcome() {
    return (
        <WelcomeLayout>
            <Head title="Karaoke — Pachamama Bar" />

            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <CategoriesSection />
            <CtaBanner />
            <WelcomeFooter />
        </WelcomeLayout>
    );
}
