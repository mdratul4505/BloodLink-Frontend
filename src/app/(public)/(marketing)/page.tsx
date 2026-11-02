import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FindDonorsSection } from "@/components/home/FindDonorsSection";
import { EmergencyRequestsSection } from "@/components/home/EmergencyRequestsSection";
import { VerifiedOrgsSection } from "@/components/home/VerifiedOrgsSection";
import { UpcomingCampsSection } from "@/components/home/UpcomingCampsSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Statistics Section */}
      <StatsSection />

      {/* 4. How BloodLink Works */}
      <HowItWorksSection />

      {/* 5. Find Blood Donors with Live Filters */}
      <FindDonorsSection />

      {/* 6. Emergency Blood Requests Section */}
      <EmergencyRequestsSection />

      {/* 7. Verified Organizations Section */}
      <VerifiedOrgsSection />

      {/* 8. Upcoming Donation Camps Section */}
      <UpcomingCampsSection />

      {/* 9. Why Choose BloodLink */}
      <WhyChooseSection />

      {/* 10. Final Call to Action */}
      <FinalCtaSection />
    </div>
  );
}
