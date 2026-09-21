export function ProblemSection() {
  return (
    <section id="problem" className="pb-4 scroll-mt-24">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="problem-card-left rounded-[2.25rem] bg-white dark:bg-[#11141c] p-7 sm:p-10 lg:col-span-5 will-change-transform">
          <h2 className="text-3xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-4xl text-[#1d2a40] dark:text-white">
            Masalah Klasik
            <br />
            AI Agent:
            <br />
            <span className="text-[#c76561] dark:text-red-400">
              Single Point of Failure
            </span>
          </h2>

          <p className="mt-6 text-base leading-7 text-[#686b66] dark:text-neutral-400">
            Memberikan kontrol dompet (`private key`) kepada
            program AI secara tradisional sangat berisiko. Jika
            model kecerdasan buatan berhalusinasi, di-hack (prompt
            injection), atau tidak sengaja salah perhitungan,
            <strong className="text-[#3e403d] dark:text-white">
              {" "}
              seluruh aset kripto Anda bisa terkuras dalam hitungan
              detik.
            </strong>
          </p>

          <ul className="mt-7 space-y-3">
            {[
              "AI menukar token palsu secara mandiri.",
              "Transaksi melampaui batas slippage ekstrem.",
              'Serangan penyusup untuk menguras saldo dompet ("Wallet Draining Event").',
            ].map((item) => (
              <li
                key={item}
                className="problem-list-item flex items-start gap-3 rounded-2xl bg-[#fcf1f0] dark:bg-red-950/20 px-4 py-3 text-sm text-[#76504e] dark:text-red-300 will-change-transform"
              >
                <span className="font-bold text-[#c76561] dark:text-red-400">
                  ×
                </span>

                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="problem-terminal-card relative overflow-hidden rounded-[2.25rem] bg-[#202320] dark:bg-[#0c0f14] p-6 text-white sm:p-8 lg:col-span-7 will-change-transform">
          <div className="code-glow pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#5275bb]/20 blur-3xl will-change-transform" />

          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-[#e28a84]" />
                <span className="h-3 w-3 rounded-full bg-[#d9bc70]" />
                <span className="h-3 w-3 rounded-full bg-[#83ad8e]" />
              </div>
            </div>

            <pre className="overflow-x-auto text-xs leading-6 text-[#d6ddd6] sm:text-sm">
{`// BAD ARCHITECTURE
const executeAITransaction = async (prompt) => {
  // Agent AI memutuskan sendiri sepenuhnya
  const aiDecision = await ai.getIntent(prompt);

  // Langsung eksekusi dari wallet pendelegasi!
  // Bencana jika AI meminta 10.000 USDC
  // alih-alih 10 USDC!
  await wallet.sendTransaction(aiDecision);
}`}
            </pre>

            <div className="mt-7 rounded-2xl bg-[#4b2928] px-4 py-3 text-sm font-medium text-[#f0b5b0]">
              Risiko Kehilangan Saldo: Sangat Tinggi · No Safeguards
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
