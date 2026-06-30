import type { Metadata } from "next";
import { MealPlannerPage } from "@/components/planner/MealPlannerPage";

export const metadata: Metadata = {
  title: "Menu & Prices | Menuu Petaling Jaya",
  description:
    "Explore chicken noodles, meatball bowls, nasi lemak, chicken rice, kopitiam toast, fried snacks and kopitiam drinks at Menuu in Taman Sea, Petaling Jaya. Plan your meal before you arrive.",
};

export default function MenuPage() {
  return (
    <div className="pb-10">
      <MealPlannerPage />
    </div>
  );
}
