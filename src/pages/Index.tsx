import HeroSection from "@/components/HeroSection";
import PoemSection from "@/components/PoemSection";
import QuoteSection from "@/components/QuoteSection";
import HistorySection from "@/components/HistorySection";
import MementoMoriSection from "@/components/MementoMoriSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import EventsSection from "@/components/EventsSection";
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
      <ContactSection />
    </main>
  );
};

export default Index;
