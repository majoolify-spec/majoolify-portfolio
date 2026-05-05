"use client";

import { useEffect } from "react";

export function InteractiveLayer() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!media.matches) {
      return;
    }

    const root = document.documentElement;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;

    const updatePointerTarget = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      root.style.setProperty("--pointer-x", `${currentX.toFixed(1)}px`);
      root.style.setProperty("--pointer-y", `${currentY.toFixed(1)}px`);
      raf = window.requestAnimationFrame(animate);
    };

    updateScroll();
    raf = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", updatePointerTarget, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", updatePointerTarget);
      window.removeEventListener("scroll", updateScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="interactive-aura" aria-hidden />;
}
