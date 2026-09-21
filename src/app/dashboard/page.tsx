"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAccount, useSignTypedData, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import gsap from "gsap";



// ============================================================
// EIP-712 DOMAIN & TYPES
// ============================================================

const domain = {
  name: "IntentShield",
  version: "1",
  chainId: 84532,
  verifyingContract: "0x1111111111111111111111111111111111111111",
} as const;

const types = {
  Policy: [
    { name: "maxAmountIn", type: "uint256" },
    { name: "maxSlippageBps", type: "uint16" },
    { name: "expiresAt", type: "uint256" },
  ],
} as const;

// ============================================================
// TYPES
// ============================================================

interface Policy {
  maxAmountIn: string;
  maxSlippageBps: number;
  expiresAt: string;
}

type LogStatus = "idle" | "loading" | "success" | "error";

interface ExecutionLog {
  step: string;
  status: LogStatus;
  label: string;
}

// ============================================================
// HELPERS
// ============================================================

const initialLogs: ExecutionLog[] = [
  { step: "compiler", status: "idle", label: "01. AI Intent Compiler" },
  { step: "sign", status: "idle", label: "02. EIP-712 User Sign" },
  { step: "proposal", status: "idle", label: "03. Agent Proposal Received" },
  { step: "l1", status: "idle", label: "04. Layer 1 Verifier (Off-Chain)" },
  { step: "l2", status: "idle", label: "05. Layer 2 Enforcer (On-Chain)" },
  { step: "result", status: "idle", label: "06. Blockchain Result" },
];

function ProofModal({ tx, onClose }: { tx: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.defaults({ ease: "power2.out" });

      // Staggered entrance
      const tl = gsap.timeline({ delay: 0.1 });

      tl.from(".proof-main-card", {
        y: 40,
        scale: 0.96,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".proof-badge",
          {
            y: 15,
            opacity: 0,
            duration: 0.4,
          },
          "-=0.4",
        )
        .from(
          ".proof-header",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3",
        )
        .from(
          ".proof-desc",
          {
            y: 15,
            opacity: 0,
            duration: 0.45,
          },
          "-=0.3",
        )
        .from(
          ".proof-item",
          {
            y: 20,
            opacity: 0,
            duration: 0.45,
            stagger: 0.07,
          },
          "-=0.25",
        )
        .from(
          ".proof-tx-box",
          {
            y: 15,
            opacity: 0,
            duration: 0.4,
          },
          "-=0.2",
        )
        .from(
          ".proof-actions",
          {
            y: 15,
            opacity: 0,
            duration: 0.4,
          },
          "-=0.2",
        );

      // Ambient floating orbs
      gsap.to(".proof-orb-one", {
        x: 18,
        y: -18,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".proof-orb-two", {
        x: -16,
        y: 16,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 3D Tilt on mousemove
      const card = cardRef.current;
      if (card) {
        const handleMove = (event: MouseEvent) => {
          if (window.innerWidth < 1024) return;
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            rotateY: x * 4,
            rotateX: y * -4,
            transformPerspective: 1200,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.7,
            ease: "power3.out",
          });
        };

        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-[110] flex overflow-y-auto bg-black/60 p-4 backdrop-blur-md font-sans">
      <div ref={containerRef} className="m-auto w-full max-w-2xl relative">
        {/* Background ambient orbs */}
        <div className="proof-orb-one pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />
        <div className="proof-orb-two pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />

        {/* FLAT MINIMALIST MAIN CARD WITH 3D DEPTH */}
        <div
          ref={cardRef}
          className="proof-main-card relative z-10 rounded-3xl border border-[#e2e5df] bg-white p-8 shadow-sm will-change-transform dark:border-white/10 dark:bg-[#0e1117] sm:p-11"
        >
          {/* TOP STATUS ROW */}
          <div className="flex items-center justify-between border-b border-[#edf0eb] pb-6 dark:border-white/5">
            <div className="proof-badge inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Verified by IntentShield
            </div>

            <span className="text-xs font-mono uppercase tracking-wider text-[#858981] dark:text-neutral-500">
              EIP-712 Attestation
            </span>
          </div>

          {/* HEADER */}
          <div className="pb-8 pt-6">
            <div className="proof-header mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#273b61] text-white dark:bg-blue-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#1d2a40] dark:text-white sm:text-3xl">
                Eksekusi Intent Selesai
              </h1>
            </div>

            <p className="proof-desc text-sm leading-relaxed text-[#59616d] dark:text-neutral-400">
              Bukti kriptografis off-chain dan on-chain telah diverifikasi.
              Transaksi dieksekusi dengan aman sesuai batasan maksimum yang Anda
              setujui.
            </p>
          </div>

          {/* SPECIFICATION GRID - CLEAN FLAT BORDERS */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="proof-item rounded-2xl border border-[#e2e5df] bg-[#f8f9f6] p-4 transition-colors hover:border-[#cbd5e7] dark:border-white/5 dark:bg-[#131720] dark:hover:border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858981] dark:text-neutral-400">
                Jaringan
              </span>
              <p className="mt-1 text-sm font-bold text-[#1d2a40] dark:text-white">
                Base Sepolia (Chain 84532)
              </p>
            </div>

            <div className="proof-item rounded-2xl border border-[#e2e5df] bg-[#f8f9f6] p-4 transition-colors hover:border-[#cbd5e7] dark:border-white/5 dark:bg-[#131720] dark:hover:border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858981] dark:text-neutral-400">
                Pasangan Transaksi
              </span>
              <p className="mt-1 text-sm font-bold text-[#1d2a40] dark:text-white">
                USDC → ETH · Uniswap
              </p>
            </div>

            <div className="proof-item rounded-2xl border border-[#e2e5df] bg-[#f8f9f6] p-4 transition-colors hover:border-[#cbd5e7] dark:border-white/5 dark:bg-[#131720] dark:hover:border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858981] dark:text-neutral-400">
                Metode Keamanan
              </span>
              <p className="mt-1 text-sm font-bold text-[#1d2a40] dark:text-white">
                Off-Chain L1 + On-Chain Enforcer
              </p>
            </div>

            <div className="proof-item rounded-2xl border border-[#e2e5df] bg-[#f8f9f6] p-4 transition-colors hover:border-[#cbd5e7] dark:border-white/5 dark:bg-[#131720] dark:hover:border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#858981] dark:text-neutral-400">
                Hasil Verifikasi
              </span>
              <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Status Lolos (Within Limit)
              </p>
            </div>
          </div>

          {/* TX HASH BOX */}
          {tx && (
            <div className="proof-tx-box mb-8 rounded-2xl border border-[#e2e5df] bg-[#f8f9f6] p-4 dark:border-white/5 dark:bg-[#131720]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#70736e] dark:text-neutral-400">
                  Transaction Hash
                </span>
                <span className="text-[11px] font-mono text-[#5275bb] dark:text-blue-400">
                  On-Chain Record
                </span>
              </div>
              <div className="break-all rounded-xl border border-[#dfe3dc] bg-white p-3 font-mono text-xs text-[#273b61] select-all dark:border-white/5 dark:bg-[#090c11] dark:text-blue-300">
                {tx}
              </div>
            </div>
          )}

          {/* BUTTON ACTIONS */}
          <div className="proof-actions flex flex-col items-center gap-3 pt-2 sm:flex-row">
            <Button
              onClick={onClose}
              size="lg"
              className="w-full flex-1 rounded-2xl bg-[#273b61] py-6 text-sm font-semibold text-white shadow-none transition-transform duration-200 hover:bg-[#1f3152] active:scale-[0.99] dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto"
            >
              Tutup & Kembali
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-2xl border-[#cbd5e7] bg-transparent px-7 py-6 text-sm font-semibold text-[#34415a] shadow-none transition-transform duration-200 hover:bg-neutral-100 active:scale-[0.99] dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
              >
                Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { address, isConnected, chain } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchChainAsync } = useSwitchChain();

  // POV User States
  const [intent, setIntent] = useState(
    "Swap maksimal 500 USDC ke ETH di Uniswap dengan max 1% slippage selama 1 jam",
  );
  const [isCompiling, setIsCompiling] = useState(false);
  const [draftPolicy, setDraftPolicy] = useState<Policy | null>(null);
  const [signedPolicy, setSignedPolicy] = useState<Policy | null>(null);

  // POV Agent States
  const [proposedAmount, setProposedAmount] = useState<string>("300");
  const [isExecutingAgent, setIsExecutingAgent] = useState(false);

  // Pipeline & Logs
  const [logs, setLogs] = useState<ExecutionLog[]>(initialLogs);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [l1ErrorReason, setL1ErrorReason] = useState<string | null>(null);

  // Modal State
  const [showProofModal, setShowProofModal] = useState(false);

  // Memblokir orientasi scroll pada body saat modal terbuka
  useEffect(() => {
    if (showProofModal || draftPolicy) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showProofModal, draftPolicy]);

  // GSAP ScrollTrigger & Parallax Animations
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.defaults({ ease: "power2.out" });

      // 1. Initial entrance animation
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(".dash-hero-title", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".dash-hero-desc",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          ".dash-user-section",
          {
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(
          ".dash-monitor-section",
          {
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5",
        );

      // Ambient idle float for decorative elements
      gsap.to(".dash-orb-one", {
        x: 20,
        y: -20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".dash-orb-two", {
        x: -20,
        y: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 2. Scroll-driven scrub parallax for hero card
      gsap.to(".dash-hero-card", {
        scrollTrigger: {
          trigger: ".dash-hero-card",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
        y: 35,
        scale: 0.985,
        opacity: 0.92,
        ease: "none",
      });

      // Orbs parallax
      gsap.to(".dash-orb-one", {
        scrollTrigger: {
          trigger: ".dash-hero-card",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
        y: -80,
        x: 30,
        ease: "none",
      });

      gsap.to(".dash-orb-two", {
        scrollTrigger: {
          trigger: ".dash-hero-card",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
        y: -100,
        x: -30,
        ease: "none",
      });

      // 3. Scroll-driven scrub for agent playground section
      gsap.fromTo(
        ".dash-agent-section",
        {
          y: 50,
          scale: 0.97,
          opacity: 0.4,
        },
        {
          scrollTrigger: {
            trigger: ".dash-agent-section",
            start: "top 90%",
            end: "top 45%",
            scrub: 1.1,
          },
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "power2.out",
        },
      );

      // (Animasi parallax .dash-monitor-section telah dihapus agar sejajar dengan kolom kiri)
    }, root);

    return () => ctx.revert();
  }, []);

  const updateLog = (step: string, status: LogStatus) => {
    setLogs((prev) =>
      prev.map((log) => (log.step === step ? { ...log, status } : log)),
    );
  };

  // ==========================================================
  // 1. TAHAP USER: COMPILE INTENT
  // ==========================================================
  const handleCompile = async () => {
    if (!intent) return;

    setIsCompiling(true);
    setLogs(initialLogs);
    setTxHash(null);
    setSignedPolicy(null);
    updateLog("compiler", "loading");

    try {
      const res = await fetch("/api/compile-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: intent, userAddress: address }),
      });

      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Gagal generate policy");

      const geminiPolicy = data.draftPolicy;
      const finalPolicy: Policy = {
        maxAmountIn: geminiPolicy.maxAmountIn || "500000000", // 500 USDC (6 decimals)
        maxSlippageBps: geminiPolicy.maxSlippageBps || 100,
        expiresAt:
          geminiPolicy.expiresAt?.toString() ||
          Math.floor(Date.now() / 1000 + 3600).toString(),
      };

      updateLog("compiler", "success");
      setDraftPolicy(finalPolicy);
    } catch (err: any) {
      console.error(err);
      alert("Gagal menghubungi Gemini: " + err.message);
      updateLog("compiler", "error");
    } finally {
      setIsCompiling(false);
    }
  };

  // ==========================================================
  // 2. TAHAP USER: SIGN POLICY (EIP-712)
  // ==========================================================
  const handleSignPolicy = async () => {
    if (!draftPolicy) return;
    updateLog("sign", "loading");

    if (chain?.id !== 84532) {
      try {
        if (!switchChainAsync)
          throw new Error("Metode switch chain tidak tersedia.");
        await switchChainAsync({ chainId: 84532 });
        await new Promise((res) => setTimeout(res, 500));
      } catch (error) {
        alert("Pindah ke jaringan Base Sepolia untuk melanjutkan!");
        updateLog("sign", "error");
        return;
      }
    }

    try {
      const parsedAmount = BigInt(draftPolicy.maxAmountIn.trim());
      const parsedExpiresAt = BigInt(draftPolicy.expiresAt.trim());

      await signTypedDataAsync({
        domain,
        types,
        primaryType: "Policy",
        message: {
          maxAmountIn: parsedAmount,
          maxSlippageBps: Number(draftPolicy.maxSlippageBps),
          expiresAt: parsedExpiresAt,
        },
      });

      updateLog("sign", "success");
      setSignedPolicy(draftPolicy);
      setDraftPolicy(null);
    } catch (error: any) {
      console.error("Signing failed", error);
      alert("Signing dibatalkan atau gagal: " + error.message);
      updateLog("sign", "error");
    }
  };

  // ==========================================================
  // 3. TAHAP AGENT: SIMULASI EKSEKUSI PROPOSAL
  // ==========================================================
  const handleSimulateAgentProposal = async (overrideAmount?: string) => {
    if (!signedPolicy) {
      alert("User harus menandatangani Policy (EIP-712) terlebih dahulu!");
      return;
    }

    const amountToTest = overrideAmount || proposedAmount;
    setProposedAmount(amountToTest);
    setIsExecutingAgent(true);

    // Reset logs setelah step "sign"
    setLogs((prev) =>
      prev.map((log) =>
        ["proposal", "l1", "l2", "result"].includes(log.step)
          ? { ...log, status: "idle" }
          : log,
      ),
    );

    // Step 03: Proposal Received
    updateLog("proposal", "loading");
    await new Promise((res) => setTimeout(res, 800));
    updateLog("proposal", "success");

    // Convert input nominal (USDC) ke 6 desimal
    const proposedAmountInRaw = BigInt(
      Math.floor(parseFloat(amountToTest) * 1_000_000),
    );
    const userMaxLimitRaw = BigInt(signedPolicy.maxAmountIn);

    // Ambil waktu saat ini dalam detik
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresAtTime = Number(signedPolicy.expiresAt);

    // Step 04: Layer 1 Off-Chain Verifier
    updateLog("l1", "loading");
    await new Promise((res) => setTimeout(res, 1000));

    // CHECK CONSTRAINT LAYER 1: KEDALUWARSA (TIME LOCK)
    if (currentTime > expiresAtTime) {
      updateLog("l1", "error");
      setIsExecutingAgent(false);
      return; // DIBLOKIR OFF-CHAIN!
    }

    // CHECK CONSTRAINT LAYER 1: NOMINAL LIMIT
    if (proposedAmountInRaw > userMaxLimitRaw) {
      updateLog("l1", "error");
      setIsExecutingAgent(false);
      return; // DIBLOKIR OFF-CHAIN!
    }

    updateLog("l1", "success");

    // Step 05: Layer 2 Smart Contract Enforcer
    updateLog("l2", "loading");
    await new Promise((res) => setTimeout(res, 1200));
    updateLog("l2", "success");

    // Step 06: Result
    updateLog("result", "loading");
    await new Promise((res) => setTimeout(res, 800));
    updateLog("result", "success");
    const mockTxHash =
      "0x123abc456def7890123abc456def7890123abc456def7890123abc456def7890";
    setTxHash(mockTxHash);
    setIsExecutingAgent(false);

    // Tampilkan modal proof otomatis setelah 1.5 detik
    setTimeout(() => {
      setShowProofModal(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen overflow-clip bg-[#f7f8f5] text-[#20221f] dark:bg-[#07090e] dark:text-neutral-100 font-sans">
      <div
        className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8"
        ref={containerRef}
      >
        {/* HERO SECTION */}
        <section className="dash-hero-card relative mb-8 min-h-[360px] overflow-hidden rounded-[2.25rem] bg-[#e7efff] p-7 will-change-transform dark:bg-[#0f172a] sm:p-10">
          <div className="dash-orb-one pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/55 will-change-transform dark:bg-white/5" />
          <div className="dash-orb-two pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#d4e2ff] will-change-transform dark:bg-blue-950/40" />
          <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
            <div className="max-w-3xl space-y-4">
              <h1 className="dash-hero-title text-4xl font-bold leading-tight tracking-tight text-[#1d2a40] dark:text-white sm:text-5xl">
                Dashboard Kontrol{" "}
                <span className="text-[#5275bb] dark:text-blue-400">
                  IntentShield
                </span>
              </h1>
              <p className="dash-hero-desc max-w-2xl text-base text-[#5c687c] dark:text-neutral-400 sm:text-lg">
                Uji proteksi dua lapis (Off-Chain Verifier & On-Chain Enforcer)
                terhadap proposal transaksi agen otonom secara terpisah dan
                interaktif.
              </p>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="dash-main-grid grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: POV CONTROLS */}
          <div className="space-y-8 lg:col-span-7">
            {/* SECTION 1: USER POV */}
            <section className="dash-user-section rounded-[2.25rem] border border-[#dfe3dc] bg-white p-7 dark:border-white/10 dark:bg-[#11141c] sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#1d2a40] dark:text-white">
                    Input Intent & Kunci Policy
                  </h2>
                  <p className="mt-1 text-sm text-[#6b6e69] dark:text-neutral-400">
                    Tentukan batasan izin transaksi menggunakan bahasa alami.
                  </p>
                </div>
                {signedPolicy && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    ✓ Policy Locked
                  </span>
                )}
              </div>

              <textarea
                className="min-h-[140px] w-full resize-none rounded-2xl border border-[#dfe3dc] bg-[#fafbf9] p-4 text-base text-[#273142] outline-none transition-colors focus:border-[#273b61] dark:border-white/10 dark:bg-[#090c11] dark:text-white dark:focus:border-blue-500"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                disabled={!isConnected || isCompiling}
              />

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-[#8a929d] dark:text-neutral-500">
                  User menetapkan aturan limit maksimum.
                </p>
                <Button
                  className="rounded-full bg-[#273b61] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1f3152] dark:bg-blue-600 dark:hover:bg-blue-500"
                  onClick={handleCompile}
                  disabled={!isConnected || !intent || isCompiling}
                >
                  {isCompiling ? "Compiling..." : "Compile & Review Policy"}
                </Button>
              </div>
            </section>

            {/* SECTION 2: AGENT POV PLAYGROUND */}
            <section
              className={`dash-agent-section rounded-[2.25rem] border p-7 transition-all sm:p-8 ${
                signedPolicy
                  ? "border-blue-500/30 bg-white dark:border-blue-500/20 dark:bg-[#11141c]"
                  : "border-gray-200 bg-gray-50/50 opacity-60 dark:border-white/5 dark:bg-white/[0.01]"
              }`}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-[#1d2a40] dark:text-white">
                  Agent Proposal Playground
                </h2>
                <p className="mt-1 text-sm text-[#6b6e69] dark:text-neutral-400">
                  Simulasikan eksekusi transaksi oleh agen terhadap Policy User
                  yang sudah dikunci.
                </p>
              </div>

              {/* PRESET BUTTONS */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={!signedPolicy || isExecutingAgent}
                  onClick={() => handleSimulateAgentProposal("300")}
                  className="group rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-4 text-left transition-all hover:border-emerald-500 dark:bg-emerald-950/20"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      Scenario A
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Uji Agen Jujur (300 USDC)
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Proposal $\le$ Limit User. Transaksi harus lolos.
                  </p>
                </button>

                <button
                  type="button"
                  disabled={!signedPolicy || isExecutingAgent}
                  onClick={() => handleSimulateAgentProposal("5000")}
                  className="group rounded-2xl border border-rose-500/30 bg-rose-50/50 p-4 text-left transition-all hover:border-rose-500 dark:bg-rose-950/20"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400">
                      Scenario B
                    </span>
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Uji Agen Jahat (5.000 USDC)
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    Proposal $ Limit User. Harus diblokir Layer 1.
                  </p>
                </button>
              </div>

              {/* MANUAL AGENT INPUT */}
              <div className="flex flex-col items-end gap-3 border-t border-gray-100 pt-4 dark:border-white/5 sm:flex-row">
                <div className="w-full">
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-neutral-400">
                    Custom Nominal Proposal Agen (USDC)
                  </label>
                  <input
                    type="number"
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    disabled={!signedPolicy || isExecutingAgent}
                    className="w-full rounded-xl border border-[#dfe3dc] bg-[#fafbf9] px-4 py-2.5 font-mono text-sm outline-none focus:border-purple-500 dark:border-white/10 dark:bg-[#090c11]"
                  />
                </div>
                <Button
                  onClick={() => handleSimulateAgentProposal()}
                  disabled={
                    !signedPolicy || isExecutingAgent || !proposedAmount
                  }
                  className="w-full shrink-0 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 sm:w-auto"
                >
                  {isExecutingAgent ? "Executing..." : "Kirim Proposal Agen"}
                </Button>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: EXECUTION MONITOR */}
          <section className="dash-monitor-section flex flex-col justify-between rounded-[2.25rem] border border-[#dfe3dc] bg-white p-7 dark:border-white/10 dark:bg-[#11141c] lg:col-span-5 sm:p-8">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#1d2a40] dark:text-white">
                    Execution Monitor
                  </h2>
                  <p className="mt-1 text-sm text-[#6b6e69] dark:text-neutral-400">
                    Real-time status pipeline verifikasi.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {logs.map((log, index) => (
                  <React.Fragment key={log.step}>
                    <div
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-3.5 dark:border-white/5 dark:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            log.status === "success"
                              ? "bg-emerald-500"
                              : log.status === "error"
                                ? "bg-rose-500"
                                : log.status === "loading"
                                  ? "animate-ping bg-blue-500"
                                  : "bg-gray-300 dark:bg-neutral-700"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${log.status === "error" ? "font-bold text-rose-500" : "text-gray-800 dark:text-neutral-200"}`}
                        >
                          {log.label}
                        </span>
                      </div>
                      <span className="font-mono text-xs uppercase text-gray-400">
                        {log.status}
                      </span>
                    </div>
                    {/* Separator line after each log except last */}
                    {index < logs.length - 1 && (
                      <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Gooey Toast Notification for L1 errors (replaces ERROR REASON ALERT) */}
              {logs.find((l) => l.step === "l1")?.status === "error" && (
                <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 shadow-[0_4px_12px_rgba(239,68,68,0.1)] dark:shadow-[0_4px_12px_rgba(239,68,68,0.2)]">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="font-bold">Layer 1 Off-Chain Rejected</p>
                      <p className="mt-1">An error occurred during Layer 1 verification</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* POLICY REVIEW MODAL (USER SIGNING) */}
      {draftPolicy && (
        <div className="fixed inset-0 z-[100] flex overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="m-auto w-full max-w-lg rounded-[2.25rem] border border-[#dfe3dc] bg-white p-8 dark:border-white/10 dark:bg-[#11141c]">
            <h3 className="mb-2 text-2xl font-bold">
              Review & Sign Draft Policy
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-neutral-400">
              Periksa dan kunci aturan sebelum diserahkan ke agen.
            </p>

            <div className="mb-6 space-y-4">
              <div className="rounded-xl bg-gray-50 p-3 dark:bg-black/30">
                <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">
                  Max Amount In (USDC):
                </label>
                <input
                  type="number"
                  value={Number(draftPolicy.maxAmountIn) / 1_000_000}
                  onChange={(e) => setDraftPolicy({
                    ...draftPolicy,
                    maxAmountIn: (parseFloat(e.target.value) * 1_000_000).toString()
                  })}
                  className="w-full rounded-lg border border-[#dfe3dc] bg-[#fafbf9] px-3 py-2 text-sm outline-none focus:border-[#273b61] dark:border-white/10 dark:bg-[#090c11] dark:text-white dark:focus:border-blue-500"
                />
              </div>
              
              <div className="rounded-xl bg-gray-50 p-3 dark:bg-black/30">
                <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">
                  Max Slippage Bps:
                </label>
                <input
                  type="number"
                  value={draftPolicy.maxSlippageBps}
                  onChange={(e) => setDraftPolicy({
                    ...draftPolicy,
                    maxSlippageBps: parseInt(e.target.value)
                  })}
                  className="w-full rounded-lg border border-[#dfe3dc] bg-[#fafbf9] px-3 py-2 text-sm outline-none focus:border-[#273b61] dark:border-white/10 dark:bg-[#090c11] dark:text-white dark:focus:border-blue-500"
                />
              </div>
              
              <div className="rounded-xl bg-gray-50 p-3 dark:bg-black/30">
                <label className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">
                  Expires At (minutes):
                </label>
                <input
                  type="number"
                  value={Math.floor((parseInt(draftPolicy.expiresAt) - Math.floor(Date.now() / 1000)) / 60)}
                  onChange={(e) => setDraftPolicy({
                    ...draftPolicy,
                    expiresAt: (Math.floor(Date.now() / 1000) + parseInt(e.target.value) * 60).toString()
                  })}
                  className="w-full rounded-lg border border-[#dfe3dc] bg-[#fafbf9] px-3 py-2 text-sm outline-none focus:border-[#273b61] dark:border-white/10 dark:bg-[#090c11] dark:text-white dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDraftPolicy(null)}
                className="rounded-full"
              >
                Batal
              </Button>
              <Button
                onClick={handleSignPolicy}
                className="rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Approve & Sign (EIP-712)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PROOF MODAL */}
      {showProofModal && txHash && (
        <ProofModal tx={txHash} onClose={() => setShowProofModal(false)} />
      )}
    </main>
  );
}
