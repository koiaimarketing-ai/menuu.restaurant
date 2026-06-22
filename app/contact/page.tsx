import type { Metadata } from "next";
import { ContactClient } from "@/components/ContactClient";
import { ContactHero } from "@/components/contact/ContactHero";

export const metadata: Metadata = {
  title: "Locations, Hours & Contact | Warung Jakarta",
  description:
    "Find branch hours, directions and contact details for Warung Jakarta SS4 and KL Central Walk.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactClient />
    </>
  );
}
