import { Hero } from "@/components/introduction/sections/hero";
import { MarketProblem } from "@/components/introduction/sections/market-problem";
import { Positioning } from "@/components/introduction/sections/positioning";
import { WhatsappOrder } from "@/components/introduction/sections/whatsapp-order";
import { Testimonials } from "@/components/introduction/sections/testimonials";
import { Benefits } from "@/components/introduction/sections/benefits";
import { Market } from "@/components/introduction/sections/market";
import { Offer } from "@/components/introduction/sections/offer";
import { Contact } from "@/components/introduction/sections/contact";

export default function IntroductionPage() {
  return (
    <>
      <Hero />
      <MarketProblem />
      <Positioning />
      <WhatsappOrder />
      <Testimonials />
      <Benefits />
      <Market />
      <Offer />
      <Contact />
    </>
  );
}
