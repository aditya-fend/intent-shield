import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section id="cta-section" className="pb-20 sm:pb-28">
      <div className="cta-banner-card relative overflow-hidden rounded-[2.5rem] bg-[#e7eef9] dark:bg-[#0f172a] px-7 py-16 text-center sm:px-12 sm:py-24 will-change-transform">
        <div className="cta-orb-left absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-white/40 dark:bg-white/5 will-change-transform" />

        <div className="cta-orb-right absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#d6e3f8] dark:bg-blue-950/30 will-change-transform" />

        <div className="cta-content relative z-10 mx-auto max-w-3xl will-change-transform">
          <h2 className="mt-6 text-4xl font-bold leading-[0.98] tracking-[-0.055em] text-[#27354d] dark:text-white sm:text-6xl">
            Kendalikan Keamanan
            <br />
            Eksekusi AI Hari Ini.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#627087] dark:text-neutral-400 sm:text-lg">
            Jangan pertaruhkan dompet Anda pada probabilitas
            halusinasi AI. Pasang "Pelindung Niat" kriptografis
            mutlak.
          </p>

          <div className="mt-9">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="gsap-button rounded-full bg-[#273b61] dark:bg-blue-600 px-8 py-7 text-base font-bold text-white shadow-none hover:bg-[#1f3152] dark:hover:bg-blue-500"
              >
                Coba Demo IntentShield Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
