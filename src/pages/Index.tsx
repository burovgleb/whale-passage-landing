import HeroSection from "@/components/HeroSection";
import PoemSection from "@/components/PoemSection";
import QuoteSection from "@/components/QuoteSection";
import HistorySection from "@/components/HistorySection";
import MementoMoriSection from "@/components/MementoMoriSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import EventsSection from "@/components/EventsSection";
import InterviewsSection from "@/components/InterviewsSection";
import AboutTitleSection from "@/components/AboutTitleSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <PoemSection />
      <QuoteSection />
      <HistorySection />
      <MementoMoriSection />
      <TestimonialsSection />
      <EventsSection />
      <InterviewsSection />
      <AboutTitleSection />
      <ContactSection />
    </main>
  );
};

export default Index;
