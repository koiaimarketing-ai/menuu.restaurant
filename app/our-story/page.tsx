import type { Metadata } from "next";
import { StoryContent } from "@/components/story/StoryContent";

export const metadata: Metadata = {
  title: "Our Story | Warung Jakarta — From Jakarta, with heart",
  description:
    "The story of Warung Jakarta — authentic Indonesian comfort food brought to Kuala Lumpur by founders Rybinski and Yudhi Harijono, served with warmth and a true taste of Jakarta.",
};

export default function OurStoryPage() {
  return <StoryContent />;
}
