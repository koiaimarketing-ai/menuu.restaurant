import type { Metadata } from "next";
import { StoryContent } from "@/components/story/StoryContent";

export const metadata: Metadata = {
  title: "Our Story | Menuu — Made fresh in Petaling Jaya",
  description:
    "The story of Menuu — comforting, home-style Indonesian-style food made fresh in Taman Sea, Petaling Jaya. Founded by Vincent and served with warmth and heart.",
};

export default function OurStoryPage() {
  return <StoryContent />;
}
