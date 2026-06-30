import type { Metadata } from "next";
import { ContactClient } from "@/components/ContactClient";
import { ContactHero } from "@/components/contact/ContactHero";

export const metadata: Metadata = {
  title: "Locations, Hours & Contact | Menuu",
  description:
    "Find opening hours, directions and contact details for Menuu in Taman Sea, Petaling Jaya.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactClient />
    </>
  );
}
