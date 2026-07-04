"use client";

import { useLang } from "@/components/introduction/providers/language-provider";
import { Logo } from "@/components/introduction/ui/logo";
import { WHATSAPP_URL } from "@/lib/introduction/content";
import { Phone, MapPin } from "lucide-react";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-line bg-mist-50">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-28 sm:px-6 lg:pb-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="max-w-xs">
            <Logo className="w-[130px]" />
            <p className="mt-3 text-sm leading-relaxed text-body">{t.footer.tagline}</p>
            <p className="mt-3 text-sm text-body">
              {t.footer.website}{" "}
              <a
                href="http://www.menuu.asia/"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap font-semibold text-brand-600 underline-offset-2 transition-colors hover:text-brand-700 hover:underline"
              >
                menuu.asia
              </a>
            </p>
          </div>

          <nav className="flex flex-col gap-2.5">
            {t.nav.links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-body transition-colors hover:text-brand-600">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="space-y-2.5 text-sm text-body">
            <a href={`tel:+60167068931`} className="flex items-center gap-2 hover:text-brand-600">
              <Phone className="h-4 w-4 text-brand-600" /> {t.contact.phone}
            </a>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {t.contact.address}
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-block font-semibold text-brand-600 hover:text-brand-700">
              {t.contact.whatsapp} →
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-line pt-6 text-xs text-body sm:flex-row">
          <p>© 2026 MENUU. {t.footer.rights}</p>
          <p className="text-center sm:text-right">
            {t.footer.builtFor} {t.footer.devBy}{" "}
            <a
              href="http://www.koiaistudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap font-semibold text-brand-600 underline-offset-2 transition-colors hover:text-brand-700 hover:underline"
            >
              KOI AI Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
