"use client";

import Image from "next/image";
import { useLang } from "@/components/introduction/providers/language-provider";
import { SectionHeading } from "@/components/introduction/ui/section";
import { Reveal } from "@/components/introduction/ui/reveal";
import { Button } from "@/components/introduction/ui/button";
import { WHATSAPP_URL } from "@/lib/introduction/content";
import { Phone, MapPin, Mail, MessageCircle, CalendarCheck } from "lucide-react";

export function Contact() {
  const { t } = useLang();
  const c = t.contact;

  return (
    <section id="contact" className="bg-mist-50 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading tag={c.tag} heading={c.heading} />
        <Reveal className="mx-auto mt-4 max-w-[620px] text-center">
          <p className="text-base leading-relaxed text-body sm:text-lg">
            {c.sub
              .split(/(?<=[?？])\s*/)
              .filter(Boolean)
              .map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]">
            <div className="grid md:grid-cols-[0.72fr_1.28fr]">
              {/* Founder visual — clean portrait only, no text overlay */}
              <div className="relative mx-auto aspect-[1277/1874] w-full max-w-[300px] overflow-hidden bg-soft-blue md:max-w-none">
                <Image
                  src="/images/introduction/vincent.png"
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-contain object-top"
                />
              </div>

              {/* Details — centered as one group inside the white box */}
              <div className="flex h-full w-full flex-col items-center justify-center px-6 py-8 sm:px-8 sm:py-10">
                <div className="w-full max-w-[420px]">
                {/* name + title now live inside the white info box */}
                <div className="px-3 pb-2">
                  <p className="text-2xl font-extrabold leading-tight text-navy">{c.name}</p>
                  <p className="mt-0.5 text-sm font-medium text-slate">{c.role}</p>
                </div>
                <a href="tel:+60167068931" className="flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-mist-50">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-body">{c.phoneLabel}</span>
                    <span className="block text-base font-bold text-ink-900">{c.phone}</span>
                  </span>
                </a>
                <a href="mailto:sales@menuu.asia" className="flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-mist-50">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-body">{c.emailLabel}</span>
                    <span className="block text-base font-bold text-ink-900">{c.email}</span>
                  </span>
                </a>
                <div className="flex items-start gap-3 rounded-2xl p-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-body">{c.addressLabel}</span>
                    <span className="block text-sm font-medium text-ink-800">{c.address}</span>
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button href={WHATSAPP_URL} external size="lg" className="w-full sm:flex-1">
                    <MessageCircle className="h-5 w-5" /> WhatsApp
                  </Button>
                  <Button href="tel:+60167068931" size="lg" variant="secondary" className="w-full sm:flex-1">
                    <CalendarCheck className="h-5 w-5 text-brand-600" /> {c.book}
                  </Button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
