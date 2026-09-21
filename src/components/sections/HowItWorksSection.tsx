const steps = [
  {
    number: "01",
    title: "Input Pengguna",
    text: 'Pengguna mengetikkan perintah spesifik, misalnya "Swap maksimal 300 USDC ke ETH".',
    className: "bg-[#fffdf7] dark:bg-[#11141c]",
  },
  {
    number: "02",
    title: "AI Intent Compiler",
    text: "Google Gemini API dan Backend mengonversi teks menjadi Draft JSON Policy kuantitatif.",
    className: "bg-[#edf2fb] dark:bg-[#0f172a]",
  },
  {
    number: "03",
    title: "EIP-712 Signature",
    text: "Pengguna menyetujui parameter keamanan menggunakan tanda tangan wallet tanpa gas fee.",
    className: "bg-[#edf6f0] dark:bg-[#0b1c14]",
  },
  {
    number: "04",
    title: "L1 Verify & L2 Execute",
    text: "Sistem memverifikasi tanda tangan. Gagal = Revert. Jika lolos, diteruskan ke Base Smart Account.",
    className: "bg-[#eeeaf8] dark:bg-[#191328]",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 scroll-mt-24"
    >
      <div className="how-it-works-header mb-10 max-w-2xl sm:mb-14 will-change-transform">
        <h2 className="text-3xl font-bold tracking-[-0.04em] sm:text-5xl text-[#1d2a40] dark:text-white">
          Cara Kerja IntentShield
        </h2>

        <p className="mt-5 text-base leading-7 text-[#6b6e69] dark:text-neutral-400 sm:text-lg">
          Membalikkan paradigma keamanan. Keputusan eksekusi
          dienkapsulasi menggunakan "Intent Core" dengan batasan
          parametrik yang dikunci secara on-chain.
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
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#70736e] dark:text-neutral-400">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
