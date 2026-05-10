"use client";

import { useEffect } from "react";

export function InteractiveLayer() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!pointerMedia.matches || reducedMotionMedia.matches) {
      return;
    }

    const root = document.documentElement;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;
    let scrollRaf = 0;
    let running = true;

    const updatePointerTarget = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (running && raf === 0) {
        raf = window.requestAnimationFrame(animate);
      }
    };

    const applyScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      scrollRaf = 0;
    };

    const updateScroll = () => {
      if (scrollRaf !== 0) {
        return;
      }
      scrollRaf = window.requestAnimationFrame(applyScroll);
    };

    const onVisibilityChange = () => {
      running = !document.hidden;
      if (running && raf === 0) {
        raf = window.requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      if (!running) {
        raf = 0;
        return;
      }

      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      root.style.setProperty("--pointer-x", `${currentX.toFixed(1)}px`);
      root.style.setProperty("--pointer-y", `${currentY.toFixed(1)}px`);

      const stillMoving =
        Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5;
      raf = stillMoving ? window.requestAnimationFrame(animate) : 0;
    };

    updateScroll();
    raf = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", updatePointerTarget, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("visibilitychange", onVisibilityChange, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", updatePointerTarget);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(raf);
      window.cancelAnimationFrame(scrollRaf);
    };
  }, []);

  return <div className="interactive-aura" aria-hidden />;
}
