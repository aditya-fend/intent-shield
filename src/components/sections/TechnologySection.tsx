const technologies = [
  "Ethereum",
  "BASE",
  "Gemini",
  "Wagmi",
  "Uniswap V3",
];

export function TechnologySection() {
  return (
    <section id="technology" className="pb-20 scroll-mt-24">
      <div className="tech-container-card rounded-[2.25rem] bg-white dark:bg-[#11141c] p-7 sm:p-10 will-change-transform">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1d2a40] dark:text-white">
              Dibangun di atas Web3 & AI
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {technologies.map((tech) => (
              <div
                key={tech}
                className="technology-card rounded-2xl bg-[#f8f9f6] dark:bg-[#181d27] px-5 py-4 text-center text-sm font-bold text-[#777a74] dark:text-neutral-300 will-change-transform"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
