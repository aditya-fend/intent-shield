"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { CtaSection } from "@/components/sections/CtaSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      /*
       * ============================================================
       * GLOBAL GSAP SETTINGS
       * ============================================================
       */
      gsap.defaults({
        ease: "power2.out",
      });

      /*
       * ============================================================
       * HERO INTRO (Entrance Animation)
       * ============================================================
       */
      const heroTimeline = gsap.timeline({
        delay: 0.1,
      });

      if (!prefersReducedMotion) {
        gsap.set(".hero-title-line", { y: 40, opacity: 0 });
        gsap.set(".hero-description", { y: 25, opacity: 0 });
        gsap.set(".hero-actions", { y: 20, opacity: 0 });
        gsap.set(".hero-mini-card", { y: 35, opacity: 0, scale: 0.96 });

        heroTimeline
          .to(".hero-title-line", {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          })
          .to(
            ".hero-description",
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: "power3.out",
            },
            "-=0.5",
          )
          .to(
            ".hero-actions",
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.4",
          )
          .to(
            ".hero-mini-card",
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.75,
              stagger: 0.15,
              ease: "power3.out",
            },
            "-=0.45",
          );

        /*
         * ============================================================
         * HERO FLOATING ELEMENTS (Ambient Idle Float)
         * ============================================================
         */
        gsap.to(".hero-orb-one", {
          x: 20,
          y: -24,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".hero-orb-two", {
          x: -18,
          y: 20,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".hero-diamond", {
          rotate: 14,
          y: -12,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        /*
         * ============================================================
         * 1. HERO SCROLL-DRIVEN SCRUB & PARALLAX
         * ============================================================
         */
        const heroScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        heroScrollTl.to(
          ".hero-main-card",
          {
            y: 45,
            scale: 0.98,
            opacity: 0.92,
            ease: "none",
          },
          0,
        );

        heroScrollTl.to(
          ".hero-orb-one",
          {
            y: -90,
            x: 35,
            ease: "none",
          },
          0,
        );

        heroScrollTl.to(
          ".hero-orb-two",
          {
            y: -120,
            x: -25,
            ease: "none",
          },
          0,
        );

        heroScrollTl.to(
          ".hero-diamond",
          {
            y: -140,
            rotation: 28,
            scale: 1.1,
            ease: "none",
          },
          0,
        );

        heroScrollTl.to(
          ".hero-side-card-1",
          {
            y: -25,
            scale: 0.98,
            ease: "none",
          },
          0,
        );

        heroScrollTl.to(
          ".hero-side-card-2",
          {
            y: -50,
            scale: 0.98,
            ease: "none",
          },
          0,
        );

        /*
         * ============================================================
         * 2. PROBLEM SECTION SCROLL-DRIVEN SCRUB
         * ============================================================
         */
        const problemTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#problem",
            start: "top 85%",
            end: "top 25%",
            scrub: 1,
          },
        });

        problemTl.fromTo(
          ".problem-card-left",
          {
            y: 70,
            opacity: 0.3,
            scale: 0.97,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
          },
          0,
        );

        problemTl.fromTo(
          ".problem-list-item",
          {
            x: -30,
            opacity: 0.2,
          },
          {
            x: 0,
            opacity: 1,
            stagger: 0.12,
            ease: "power2.out",
          },
          0.1,
        );

        problemTl.fromTo(
          ".problem-terminal-card",
          {
            y: 90,
            opacity: 0.25,
            scale: 0.95,
            rotateZ: 1.2,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateZ: 0,
            ease: "power2.out",
          },
          0,
        );

        problemTl.fromTo(
          ".code-glow",
          {
            scale: 0.8,
            opacity: 0.2,
          },
          {
            scale: 1.3,
            opacity: 0.85,
            ease: "none",
          },
          0,
        );

        /*
         * ============================================================
         * 3. HOW IT WORKS SECTION SCROLL-DRIVEN SCRUB
         * ============================================================
         */
        const howHeaderTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#how-it-works",
            start: "top 85%",
            end: "top 45%",
            scrub: 1,
          },
        });

        howHeaderTl.fromTo(
          ".how-it-works-header",
          {
            y: 40,
            opacity: 0.2,
          },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
          },
        );

        const howCardsTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".how-cards-container",
            start: "top 85%",
            end: "bottom 70%",
            scrub: 1.1,
          },
        });

        howCardsTl.fromTo(
          ".step-card-0",
          { y: 60, opacity: 0.3, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, ease: "power2.out" },
          0,
        );
        howCardsTl.fromTo(
          ".step-card-1",
          { y: 90, opacity: 0.2, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, ease: "power2.out" },
          0.1,
        );
        howCardsTl.fromTo(
          ".step-card-2",
          { y: 70, opacity: 0.3, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, ease: "power2.out" },
          0.2,
        );
        howCardsTl.fromTo(
          ".step-card-3",
          { y: 100, opacity: 0.2, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, ease: "power2.out" },
          0.3,
        );

        howCardsTl.fromTo(
          ".step-arrow",
          { x: -6, opacity: 0.4 },
          { x: 0, opacity: 1, stagger: 0.08, ease: "power1.out" },
          0.15,
        );

        /*
         * ============================================================
         * 4. WHY US / SECURITY SECTION SCROLL-DRIVEN SCRUB
         * ============================================================
         */
        const whyUsTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#why-us",
            start: "top 85%",
            end: "top 30%",
            scrub: 1.2,
          },
        });

        whyUsTl.fromTo(
          ".why-card-left",
          {
            y: 70,
            x: -20,
            opacity: 0.3,
            scale: 0.97,
          },
          {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
          },
          0,
        );

        whyUsTl.fromTo(
          ".why-watermark-l1",
          {
            y: 50,
            opacity: 0.05,
          },
          {
            y: -25,
            opacity: 0.2,
            ease: "none",
          },
          0,
        );

        whyUsTl.fromTo(
          ".why-card-right",
          {
            y: 90,
            x: 20,
            opacity: 0.3,
            scale: 0.97,
          },
          {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
          },
          0.08,
        );

        whyUsTl.fromTo(
          ".why-prompt-box",
          {
            y: 25,
            scale: 0.96,
            opacity: 0.4,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
          },
          0.2,
        );

        /*
         * ============================================================
         * 5. TECHNOLOGY SECTION SCROLL-DRIVEN SCRUB
         * ============================================================
         */
        const techTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#technology",
            start: "top 88%",
            end: "top 45%",
            scrub: 1,
          },
        });

        techTl.fromTo(
          ".tech-container-card",
          {
            y: 50,
            opacity: 0.3,
            scale: 0.98,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
          },
          0,
        );

        techTl.fromTo(
          ".technology-card",
          {
            y: 25,
            scale: 0.92,
            opacity: 0.3,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.1,
        );

        /*
         * ============================================================
         * 6. CTA SECTION SCROLL-DRIVEN SCRUB
         * ============================================================
         */
        const ctaTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#cta-section",
            start: "top 88%",
            end: "center 50%",
            scrub: 1.2,
          },
        });

        ctaTl.fromTo(
          ".cta-banner-card",
          {
            y: 60,
            scale: 0.95,
            opacity: 0.4,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
          },
          0,
        );

        ctaTl.fromTo(
          ".cta-orb-left",
          {
            x: -70,
            scale: 0.8,
          },
          {
            x: 20,
            scale: 1.15,
            ease: "none",
          },
          0,
        );

        ctaTl.fromTo(
          ".cta-orb-right",
          {
            x: 70,
            scale: 0.8,
          },
          {
            x: -20,
            scale: 1.15,
            ease: "none",
          },
          0,
        );

        ctaTl.fromTo(
          ".cta-content",
          {
            y: 30,
            opacity: 0.3,
          },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
          },
          0.1,
        );
      }

      /*
       * ============================================================
       * PARALLAX 3D TILT ON MOUSEMOVE
       * ============================================================
       */
      if (!prefersReducedMotion) {
        const cards = root.querySelectorAll<HTMLElement>(".parallax-card");

        cards.forEach((card) => {
          const handleMove = (event: MouseEvent) => {
            if (window.innerWidth < 1024) return;

            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
              rotateY: x * 3.5,
              rotateX: y * -3.5,
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
        });
      }

      /*
       * ============================================================
       * STEP CARDS HOVER
       * ============================================================
       */
      const stepCards = root.querySelectorAll<HTMLElement>(".step-card");
      stepCards.forEach((card) => {
        const arrow = card.querySelector<HTMLElement>(".step-arrow");

        const enter = () => {
          gsap.to(card, {
            y: -8,
            duration: 0.35,
            ease: "power3.out",
          });

          if (arrow) {
            gsap.to(arrow, {
              x: 5,
              y: -5,
              duration: 0.35,
              ease: "power3.out",
            });
          }
        };

        const leave = () => {
          gsap.to(card, {
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          });

          if (arrow) {
            gsap.to(arrow, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
            });
          }
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
      });

      /*
       * ============================================================
       * TECHNOLOGY CARDS HOVER
       * ============================================================
       */
      const technologyCards =
        root.querySelectorAll<HTMLElement>(".technology-card");
      technologyCards.forEach((card) => {
        const enter = () => {
          gsap.to(card, {
            y: -5,
            scale: 1.03,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const leave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
      });

      /*
       * ============================================================
       * BUTTON HOVER
       * ============================================================
       */
      const magneticButtons =
        root.querySelectorAll<HTMLElement>(".gsap-button");
      magneticButtons.forEach((button) => {
        const enter = () => {
          gsap.to(button, {
            y: -3,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const leave = () => {
          gsap.to(button, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
          });
        };

        button.addEventListener("mouseenter", enter);
        button.addEventListener("mouseleave", leave);
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#f7f8f5] dark:bg-[#07090e] text-[#20221f] dark:text-neutral-100 selection:bg-[#dce9ff] dark:selection:bg-blue-900/40"
    >
      <main className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <WhyUsSection />
        <TechnologySection />
        <CtaSection />
      </main>

      <footer className="bg-[#f2f3ef] dark:bg-[#07090e]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-4 py-8 text-center text-xs text-[#858981] dark:text-neutral-400 sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} IntentShield Project — Hackathon
            Prototype.
          </p>

          <p>
            Dipersiapkan dengan kerangka kerja{" "}
            <strong className="text-[#5d605a] dark:text-neutral-200">
              Next.js App Router, TailwindCSS, Wagmi, & Google GenAI
            </strong>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
