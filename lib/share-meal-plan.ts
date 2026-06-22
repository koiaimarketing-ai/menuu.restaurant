import type { LineItem } from "./meal-plan-store";
import type { Location } from "@/data/locations";
import { formatRM } from "./currency";
import { categories } from "@/data/menu";

export const CLOSING_STATEMENT =
  "Present this list to our waitstaff upon arrival. This is a digital meal-planning summary and does not require an account or login.";

export const FINAL_NOTE =
  "Final availability, prices, tax, service charge and service acceptance will be confirmed by restaurant staff.";

const catLabel = (id: string) =>
  categories.find((c) => c.id === id)?.label ?? id;

export function buildListText(
  items: LineItem[],
  branch: Location | undefined,
  visitLabel: string,
  hoursLabel: string,
  itemCategory: (itemId: string) => string,
  warning?: string,
  finalNote: string = FINAL_NOTE,
  closingStatement: string = CLOSING_STATEMENT
): string {
  const lines: string[] = [];
  lines.push("Warung Jakarta Meal Planning List");
  lines.push("");
  if (branch) {
    lines.push(`Location: ${branch.shortName}`);
    lines.push(`Address: ${branch.addressLines.join(", ")}`);
  }
  if (visitLabel) lines.push(`Planned visit: ${visitLabel}`);
  if (hoursLabel) lines.push(`Business hours: ${hoursLabel}`);
  if (warning) {
    lines.push("");
    lines.push(`Important: ${warning}`);
  }
  lines.push("");

  // group by category
  const groups = new Map<string, LineItem[]>();
  items.forEach((l) => {
    const c = itemCategory(l.itemId);
    if (!groups.has(c)) groups.set(c, []);
    groups.get(c)!.push(l);
  });

  let subtotal = 0;
  groups.forEach((group, cat) => {
    lines.push(catLabel(cat).toUpperCase());
    group.forEach((l) => {
      const lineTotal = (l.unitPrice ?? 0) * l.qty;
      subtotal += lineTotal;
      const priceStr = l.unitPrice != null ? ` — ${formatRM(lineTotal)}` : " — Price not confirmed";
      lines.push(`${l.qty} × ${l.name}${priceStr}`);
      const choiceStr = Object.entries(l.choices)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      if (choiceStr) lines.push(`Choice: ${choiceStr}`);
      if (l.note) lines.push(`Note: ${l.note}`);
    });
    lines.push("");
  });

  lines.push(`Estimated food subtotal: ${formatRM(subtotal)}`);
  lines.push("");
  lines.push(finalNote);
  lines.push("");
  lines.push(closingStatement);

  return lines.join("\n");
}
