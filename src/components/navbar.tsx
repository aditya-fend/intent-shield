"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { useLang, type TKey } from "@/lib/lang";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const navLinks: { key: TKey; href: string; id: string }[] = [
  { key: "nav.home", href: "#hero", id: "hero" },
  { key: "nav.problem", href: "#problem", id: "problem" },
  { key: "nav.how", href: "#how-it-works", id: "how-it-works" },
  { key: "nav.why", href: "#why-us", id: "why-us" },
  { key: "nav.tech", href: "#technology", id: "technology" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLang();

  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);
  const navInnerRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({ address });

  // Handle scroll effects & update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);

      if (pathname === "/") {
        const sections = navLinks.map((link) => link.id);
        const scrollPosition = scrollY + 120;

        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.offsetTop <= scrollPosition) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // GSAP ScrollTrigger & Magnetic/Hover Animations
  useEffect(() => {
    if (!navRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // Scroll-driven navbar dynamics (Metamask-like subtle contraction & glass elevation)
        ScrollTrigger.create({
          start: "top top",
          end: "+=300",
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(navRef.current, {
              boxShadow:
                progress > 0.1
                  ? "0 10px 30px -10px rgba(0,0,0,0.12), 0 4px 12px -2px rgba(0,0,0,0.06)"
                  : "0 0 0 0 rgba(0,0,0,0)",
              duration: 0.3,
              overwrite: "auto",
            });
            if (navInnerRef.current) {
              gsap.to(navInnerRef.current, {
                height: progress > 0.1 ? 58 : 64,
                duration: 0.3,
                overwrite: "auto",
              });
            }
          },
        });
      }

      // Magnetic hover on nav items
      const links = navRef.current?.querySelectorAll<HTMLElement>(".nav-item-link");
      links?.forEach((link) => {
        const enter = () => {
          gsap.to(link, {
            y: -1.5,
            duration: 0.25,
            ease: "power2.out",
          });
        };
        const leave = () => {
          gsap.to(link, {
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          });
        };

        link.addEventListener("mouseenter", enter);
        link.addEventListener("mouseleave", leave);
      });
    }, navRef);

    return () => ctx.revert();
  }, [pathname]);

  const handleConnect = () => {
    const hasInjected =
      typeof window !== "undefined" &&
      !!(window as unknown as { ethereum?: unknown }).ethereum;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(
      typeof navigator !== "undefined" ? navigator.userAgent : "",
    );

    // ponytail: sequential fallback, no wallet modal; add modal when >3 wallets needed
    const pick =
      (hasInjected &&
        connectors.find(
          (c) =>
            c.id === "injected" || c.name === "Injected" || c.name === "MetaMask",
        )) ||
      connectors.find((c) => c.id === "coinbaseWalletSDK") ||
      connectors.find((c) => c.id === "io.metamask" || c.name === "MetaMask") ||
      connectors[0];

    if (!pick) return;

    // Mobile tanpa wallet terdeteksi: deep-link ke aplikasi MetaMask
    if (!hasInjected && isMobile && pick.name !== "Coinbase Wallet") {
      const dapp = window.location.host + window.location.pathname;
      window.location.href = `https://metamask.app.link/dapp/${dapp}`;
      return;
    }

    if (!hasInjected && !isMobile && pick.name !== "Coinbase Wallet") {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    connect({ connector: pick });
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");

    if (pathname === "/") {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: "smooth",
        });
        setActiveSection(targetId);
        setMobileMenuOpen(false);
        window.history.pushState(null, "", href);
      }
    } else {
      setMobileMenuOpen(false);
      router.push(`/${href}`);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`
        sticky top-0 z-50 w-full
        border-b border-[#e5e7e2]/80
        dark:border-white/10
        ${
          scrolled
            ? "bg-[#f7f8f5]/90 dark:bg-[#07090e]/90 backdrop-blur-xl"
            : "bg-[#f7f8f5]/75 dark:bg-[#07090e]/75 backdrop-blur-lg"
        }
        transition-colors duration-300
        will-change-[background-color,box-shadow]
      `}
    >
      <div
        ref={navInnerRef}
        className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8 transition-[height] duration-300"
      >
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span className="text-xl font-bold tracking-[-0.04em] text-[#273b61] dark:text-white font-heading">
            IntentShield
          </span>
        </Link>

        {/* DESKTOP NAV (Visible on both home and dashboard pages) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === "/" && activeSection === link.id;

            return (
              <a
                key={link.id}
                href={pathname === "/" ? link.href : `/${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`
                  nav-item-link
                  px-3.5 py-1.5
                  text-sm rounded-full
                  transition-all duration-200
                  relative overflow-hidden
                  ${
                    isActive
                      ? "text-white dark:text-white font-medium shadow-sm"
                      : "text-[#59616d] dark:text-neutral-400 hover:text-[#1d2a40] dark:hover:text-white"
                  }
                `}
              >
                <span className="relative z-10">{t(link.key)}</span>
                {isActive && (
                  <span className="absolute inset-0 bg-[#273b61] dark:bg-blue-600 rounded-full scale-100 transition-transform duration-300" />
                )}
              </a>
            );
          })}
        </div>

        {/* WALLET / ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Toggle language"
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="rounded-full border border-[#e2e5df] dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-xs font-bold text-[#273b61] dark:text-white transition-all duration-200 hover:scale-105"
          >
            {lang === "en" ? "EN | ID" : "ID | EN"}
          </button>
          {isConnected ? (
            <>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/5 px-3 py-2 text-xs font-semibold text-[#59616d] dark:text-neutral-300 backdrop-blur-sm">
                <svg
                  width="12"
                  height="16"
                  viewBox="0 0 12 16"
                  className="fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.99999 0L11.9999 8L5.99999 16L0 8L5.99999 0ZM5.99999 2.5L2.5 8L5.99999 13.5L9.5 8L5.99999 2.5Z" />
                </svg>
                {balanceData
                  ? `${Number(
                      formatUnits(balanceData.value, balanceData.decimals),
                    ).toFixed(4)}`
                  : "..."}
              </div>

              <Button
                variant="destructive"
                className="
                  rounded-full
                  px-4
                  shadow-none
                  text-xs sm:text-sm
                  transition-all duration-200 hover:scale-105
                "
                onClick={() => disconnect()}
              >
                {t("nav.disconnect")}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isPending}
              className="
                rounded-full
                bg-[#273b61]
                dark:bg-blue-600
                px-5
                font-semibold
                text-white
                shadow-none
                hover:bg-[#1f3152]
                dark:hover:bg-blue-500
                text-xs sm:text-sm
                transition-all duration-200 hover:scale-105
              "
            >
              {isPending ? t("nav.connecting") : t("nav.connect")}
            </Button>
          )}

          {/* MOBILE HAMBURGER (Visible on all pages) */}
          <button
            type="button"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="
              flex h-9 w-9 items-center justify-center rounded-full
              border border-[#e2e5df] dark:border-white/10
              bg-white/70 dark:bg-white/5
              text-[#273b61] dark:text-white
              md:hidden
              transition-all duration-200 hover:scale-105
            "
          >
            <div className="flex h-3.5 w-4 flex-col justify-between">
              <span
                className={`
                  h-0.5 w-full rounded-full bg-current
                  transition-transform duration-300
                  ${mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}
                `}
              />
              <span
                className={`
                  h-0.5 w-full rounded-full bg-current
                  transition-opacity duration-300
                  ${mobileMenuOpen ? "opacity-0" : ""}
                `}
              />
              <span
                className={`
                  h-0.5 w-full rounded-full bg-current
                  transition-transform duration-300
                  ${mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}
                `}
              />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU (Visible on all pages) */}
      {mobileMenuOpen && (
        <div
          className="
            border-b border-[#e5e7e2]/80
            dark:border-white/10
            bg-[#f7f8f5]/95
            dark:bg-[#07090e]/95
            px-4 py-4
            backdrop-blur-2xl
            md:hidden
            transition-all duration-300
            transform
          "
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === "/" && activeSection === link.id;

              return (
                <a
                  key={link.id}
                  href={pathname === "/" ? link.href : `/${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`
                      flex items-center
                      justify-between
                      rounded-xl
                      px-4 py-2.5
                      text-sm
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#273b61] text-white dark:bg-white/15 dark:text-white font-semibold"
                          : "text-[#59616d] dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5"
                      }
                    `}
                >
                  <span>{t(link.key)}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
