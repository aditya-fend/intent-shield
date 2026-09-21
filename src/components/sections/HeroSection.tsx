import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative py-8 sm:py-14 lg:py-20 scroll-mt-24"
    >
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="hero-main-card parallax-card relative min-h-[580px] lg:min-h-[620px] overflow-hidden rounded-[2.25rem] bg-[#e7efff] dark:bg-[#0f172a] p-7 sm:p-10 lg:col-span-8 lg:p-12 will-change-transform">
          <div className="hero-orb-one pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/55 dark:bg-white/5 will-change-transform" />

          <div className="hero-orb-two pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#d4e2ff] dark:bg-blue-950/40 will-change-transform" />

          <div className="hero-diamond pointer-events-none absolute right-[18%] top-[18%] h-24 w-24 rotate-12 rounded-[2rem] bg-white/20 dark:bg-white/5 will-change-transform" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-[#1d2a40] dark:text-white sm:text-5xl lg:text-[3.75rem] xl:text-[4.4rem]">
                <span className="hero-title-line block">
                  Kendali Penuh
                </span>

                <span className="hero-title-line block">
                  AI Agent,
                </span>

                <span className="hero-title-line block text-[#5275bb] dark:text-blue-400">
                  Tanpa Kompromi
                </span>

                <span className="hero-title-line block text-[#5275bb] dark:text-blue-400">
                  Keamanan.
                </span>
              </h1>

              <p className="hero-description mt-6 max-w-xl text-sm leading-relaxed text-[#5c687c] dark:text-neutral-400 sm:text-base sm:leading-7">
                IntentShield adalah arsitektur keamanan tingkat
                lanjut untuk mendelegasikan eksekusi transaksi Web3
                kepada AI. Menggabungkan Google Gemini, verifikasi
                matematis L1, dan Account Abstraction di jaringan
                Base.
              </p>
            </div>

            <div className="hero-actions mt-8 sm:mt-10 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="gsap-button rounded-full bg-[#273b61] dark:bg-blue-600 px-7 py-6 font-semibold text-white shadow-none hover:bg-[#1f3152] dark:hover:bg-blue-500"
                >
                  Launch Dashboard App
                </Button>
              </Link>

              <Link
                href="https://github.com/aditya-fend/intent-shield"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="gsap-button rounded-full border-[#cbd5e7] dark:border-white/10 bg-white/60 dark:bg-white/10 px-7 py-6 font-semibold text-[#34415a] dark:text-neutral-200 shadow-none backdrop-blur-sm hover:bg-white dark:hover:bg-white/20"
                >
                  Baca Dokumentasi GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* SIDE MINI CARDS */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          {/* L1 */}
          <div className="hero-side-card-1 hero-mini-card parallax-card relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.25rem] bg-[#fffdf7] dark:bg-[#11141c] p-7 min-h-[280px] will-change-transform">
            <div className="relative z-10 flex items-start justify-end">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8efff] dark:bg-blue-950/50 font-bold text-[#5577bb] dark:text-blue-400">
                ✓
              </span>
            </div>

            <div className="relative z-10 mt-6">
              <div className="text-5xl sm:text-6xl font-bold tracking-[-0.06em] text-[#2a2d2a] dark:text-white">
                L1
              </div>

              <p className="mt-2 max-w-xs text-sm leading-6 text-[#73756e] dark:text-neutral-400">
                Parameter keamanan dikunci dan diverifikasi secara off-chain sebelum eksekusi.
              </p>
            </div>
          </div>

          {/* ARCHITECTURE CARD */}
          <div className="hero-side-card-2 hero-mini-card parallax-card relative flex flex-1 flex-col justify-between overflow-hidden rounded-[2.25rem] bg-[#e6f3eb] dark:bg-[#0b1c14] p-7 min-h-[280px] will-change-transform">
            <div className="absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-white/35 dark:bg-white/5" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-end">
                <span className="h-2.5 w-2.5 rounded-full bg-[#82ad91]" />
              </div>

              <div className="mt-6">
                <p className="text-2xl font-bold tracking-tight text-[#294033] dark:text-white">
                  AI → Intent → Verify
                </p>

                <p className="mt-2 max-w-xs text-sm leading-6 text-[#66786d] dark:text-neutral-400">
                  AI tidak memegang kendali mutlak atas wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
