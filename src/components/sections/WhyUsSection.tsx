"use client";
import { useLang } from "@/lib/lang";

export function WhyUsSection() {
  const { t } = useLang();
  return (
    <section id="why-us" className="pb-20 scroll-mt-24">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="why-card-left parallax-card relative overflow-hidden rounded-[2.25rem] bg-[#dfeaff] dark:bg-[#0f172a] p-8 sm:p-10 lg:col-span-7 will-change-transform">
          <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-white/35 dark:bg-white/5" />

          <div className="relative z-10 flex h-full min-h-[430px] flex-col justify-between">
            <div>
              <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5276bc] text-xl text-white">
                ◈
              </div>

              <h3 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-[#29364d] dark:text-white">
                {t("why.c1t")}
                <br />
                {t("why.c1t2")}
              </h3>

              <p className="mt-4 max-w-xl leading-7 text-[#59677e] dark:text-neutral-400">
                {t("why.c1d")}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <span className="why-watermark-l1 text-8xl font-bold tracking-[-0.08em] text-[#5074bc]/15 dark:text-blue-400/15 will-change-transform">
                L1
              </span>

              <span className="text-xs font-semibold text-[#5672a7] dark:text-blue-300">
                {t("why.badge")}
              </span>
            </div>
          </div>
        </div>

        <div className="why-card-right parallax-card rounded-[2.25rem] bg-[#e5f3eb] dark:bg-[#0b1c14] p-8 sm:p-10 lg:col-span-5 will-change-transform">
          <div className="flex h-full min-h-[430px] flex-col">
            <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#72a381] text-xl text-white">
              ✦
            </div>

            <h3 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-[#304638] dark:text-white">
              {t("why.c2t2")}
              <br />
              {t("why.c2t")}
            </h3>

            <p className="mt-4 leading-7 text-[#65766b] dark:text-neutral-400">
              {t("why.c2d")}
            </p>

            <div className="mt-auto pt-10">
              <div className="why-prompt-box rounded-2xl bg-white/60 dark:bg-white/10 p-5 will-change-transform">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#789080] dark:text-emerald-400">
                  {t("why.ex")}
                </p>

                <p className="mt-2 text-sm font-medium text-[#405649] dark:text-neutral-200">
                  {t("why.quote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
