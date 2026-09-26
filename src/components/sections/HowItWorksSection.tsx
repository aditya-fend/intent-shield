"use client";
import { useLang, type TKey } from "@/lib/lang";

const steps: { number: string; title: TKey; text: TKey; className: string }[] = [
  {
    number: "01",
    title: "how.s1t",
    text: "how.s1d",
    className: "bg-[#fffdf7] dark:bg-[#11141c]",
  },
  {
    number: "02",
    title: "how.s2t",
    text: "how.s2d",
    className: "bg-[#edf2fb] dark:bg-[#0f172a]",
  },
  {
    number: "03",
    title: "how.s3t",
    text: "how.s3d",
    className: "bg-[#edf6f0] dark:bg-[#0b1c14]",
  },
  {
    number: "04",
    title: "how.s4t",
    text: "how.s4d",
    className: "bg-[#eeeaf8] dark:bg-[#191328]",
  },
];

export function HowItWorksSection() {
  const { t } = useLang();
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 scroll-mt-24"
    >
      <div className="how-it-works-header mb-10 max-w-2xl sm:mb-14 will-change-transform">
        <h2 className="text-3xl font-bold tracking-[-0.04em] sm:text-5xl text-[#1d2a40] dark:text-white">
          {t("how.title")}
        </h2>

        <p className="mt-5 text-base leading-7 text-[#6b6e69] dark:text-neutral-400 sm:text-lg">
          {t("how.desc")}
        </p>
      </div>

      <div className="how-cards-container grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((item, index) => (
          <div
            key={item.number}
            className={`step-card step-card-${index} group min-h-[300px] rounded-[2.25rem] p-7 ${item.className} will-change-transform`}
          >
            <div className="flex items-start justify-between">
              <span className="text-sm font-bold text-[#858981] dark:text-neutral-400">
                {item.number}
              </span>

              <span className="step-arrow flex h-10 w-10 items-center justify-center rounded-full bg-white/70 dark:bg-white/10 dark:text-white text-sm will-change-transform">
                →
              </span>
            </div>

            <div className="mt-24">
              <h3 className="text-xl font-bold tracking-tight text-[#1d2a40] dark:text-white">
                {t(item.title)}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#70736e] dark:text-neutral-400">
                {t(item.text)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
