import type { Metadata } from "next";
import { MealPlannerPage } from "@/components/planner/MealPlannerPage";

export const metadata: Metadata = {
  title: "Indonesian Menu & Prices | Warung Jakarta KL Central Walk",
  description:
    "Explore Mie Ayam, bakso, nasi dishes, gorengan, roti bakar, traditional jamu and Indonesian favourites at Warung Jakarta. Plan your meal before you arrive.",
};

export default function MenuPage() {
  return (
    <div className="pb-10">
      <MealPlannerPage />
    </div>
  );
}
