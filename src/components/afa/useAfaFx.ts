"use client";

import { useEffect } from "react";

const EASE = "cubic-bezier(.2,.75,.2,1)";
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

type Animated = Element & { __afaAnim?: Animation; __afaDraws?: Animation[] };

/**
 * Effets vivants (portage de design/afa-fx.js), réappliqués à chaque changement de page :
 *  - titres, paragraphes et cartes apparaissent en cascade (70 ms d'écart) sous le premier écran ;
 *  - les icônes au trait se dessinent ;
 *  - les chiffres marqués `data-count` comptent jusqu'à leur valeur (le HTML porte déjà la valeur finale) ;
 *  - les cartes `.afa-card` s'inclinent et reçoivent un reflet qui suit le pointeur ;
 *  - les pilules `[data-magnetic]` de 52 px et plus sont légèrement magnétiques ;
 *  - pollen lumineux dans le premier panneau.
 * Rien n'est appliqué si l'utilisateur a demandé à réduire les animations.
 * N'écrit que des animations Web (WAAPI) et des propriétés CSS indépendantes (`rotate`, `translate`).
 */
export function useAfaFx(pathname: string) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;
    const cleanups: Array<() => void> = [];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as Animated;
          io.unobserve(el);
          el.__afaAnim?.play();
          el.__afaDraws?.forEach((a, i) => {
            a.currentTime = 0;
            window.setTimeout(() => a.play(), i * 90);
          });
          const count = (el as HTMLElement).dataset?.count;
          if (count) countUp(el as HTMLElement, Number(count), (el as HTMLElement).dataset.unit ?? "");
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    cleanups.push(() => io.disconnect());

    const below = (el: Element) => el.getBoundingClientRect().top >= window.innerHeight * 0.92;

    // 1. Apparition en cascade, panneau par panneau (le premier panneau n'est jamais masqué).
    const frames = [...main.querySelectorAll(":scope > .panel-frame, :scope > section, :scope > div")].slice(
      1,
    );
    frames.forEach((frame) => {
      let k = 0;
      frame
        .querySelectorAll("h2, h3, li, article, figure, p, [data-reveal], a[data-magnetic], img")
        .forEach((el) => {
          // Titres à l'encre : un fondu d'opacité sous le filtre « goo » rongerait les lettres.
          if (el.closest("[data-fx-skip]") || el.classList.contains("ink-title")) return;
          const parent = el.parentElement?.closest("li, article, figure, a, [data-reveal], .afa-card");
          if (parent && el.tagName !== "LI") return;
          if (!below(el)) return;
          const delay = Math.min(k++ % 8, 7) * 70;
          const anim = el.animate(
            [
              { opacity: 0, transform: "translateY(26px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 800, delay, easing: EASE, fill: "both" },
          );
          anim.pause();
          (el as Animated).__afaAnim = anim;
          io.observe(el);
          cleanups.push(() => anim.cancel());
        });
    });

    // 2. Icônes au trait qui se dessinent.
    main.querySelectorAll<SVGPathElement>("svg[aria-hidden='true'] path").forEach((p) => {
      if (p.closest("[data-fx-skip], [data-hero]")) return;
      const fill = p.getAttribute("fill");
      if (fill !== "none" && getComputedStyle(p).fill !== "none") return;
      const svg = p.ownerSVGElement as (SVGSVGElement & Animated) | null;
      if (!svg || !below(svg)) return;
      let L = 0;
      try {
        L = p.getTotalLength();
      } catch {
        return;
      }
      if (!L || L < 8) return;
      const a = p.animate(
        [
          { strokeDasharray: `${L} ${L}`, strokeDashoffset: L },
          { strokeDasharray: `${L} ${L}`, strokeDashoffset: 0 },
        ],
        { duration: Math.min(1600, 500 + L * 2), easing: "cubic-bezier(.6,0,.3,1)", fill: "backwards" },
      );
      a.pause();
      (svg.__afaDraws ??= []).push(a);
      io.observe(svg);
      cleanups.push(() => a.cancel());
    });

    // 3. Compteurs (chiffres vérifiés uniquement, marqués dans le code).
    main.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      if (below(el)) io.observe(el);
    });

    // 4. Cartes inclinables et pilules magnétiques.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const t = e.target as Element | null;
      const card = t?.closest?.<HTMLElement>(".afa-card");
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
        card.style.rotate = `${(x * 2.4).toFixed(2)}deg`;
      }
      const pill = t?.closest?.<HTMLElement>("[data-magnetic]");
      if (pill && pill.offsetHeight >= 52) {
        const r = pill.getBoundingClientRect();
        pill.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.2).toFixed(1)}px`;
      }
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const related = e.relatedTarget as Node | null;
      const card = t?.closest?.<HTMLElement>(".afa-card");
      if (card && !card.contains(related)) card.style.rotate = "";
      const pill = t?.closest?.<HTMLElement>("[data-magnetic]");
      if (pill && !pill.contains(related)) pill.style.translate = "";
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
    cleanups.push(() => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    });

    // 5. Pollen lumineux dans le premier panneau.
    const box = main.querySelector<HTMLElement>(":scope > :first-child > div");
    if (box) cleanups.push(pollen(box));

    return () => cleanups.forEach((c) => c());
  }, [pathname]);
}

function countUp(el: HTMLElement, n: number, unit: string) {
  const node = [...el.childNodes].find((c) => c.nodeType === Node.TEXT_NODE);
  if (!node) return;
  const t0 = performance.now();
  const D = 1400;
  const label = (v: number) => `${fmt(v)}${unit ? ` ${unit}` : ""}`;
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / D);
    if (node.isConnected) node.textContent = label(Math.round(n * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
    else node.textContent = label(n);
  };
  requestAnimationFrame(step);
}

function pollen(box: HTMLElement) {
  const c = document.createElement("canvas");
  c.setAttribute("aria-hidden", "true");
  c.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:4;width:100%;height:100%";
  box.appendChild(c);
  const ctx = c.getContext("2d");
  if (!ctx) {
    c.remove();
    return () => {};
  }
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  let W = 0;
  let H = 0;
  let mx = -999;
  let my = -999;
  let vis = true;
  let raf = 0;
  const P = Array.from({ length: 28 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.8 + Math.random() * 2.4,
    v: 0.12 + Math.random() * 0.35,
    ph: Math.random() * 6.28,
    a: 0.25 + Math.random() * 0.5,
  }));
  const place = () => {
    W = box.clientWidth;
    H = box.clientHeight;
    c.width = W * dpr;
    c.height = H * dpr;
  };
  place();
  const ro = new ResizeObserver(place);
  ro.observe(box);
  const onMove = (e: PointerEvent) => {
    const r = box.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  };
  const onLeave = () => {
    mx = my = -999;
  };
  box.addEventListener("pointermove", onMove);
  box.addEventListener("pointerleave", onLeave);
  const tick = (t: number) => {
    if (!vis) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.y -= (p.v / H) * 1.1;
      p.x += Math.sin(t / 3200 + p.ph) * 0.00018;
      if (p.y < -0.02) {
        p.y = 1.02;
        p.x = Math.random();
      }
      let px = p.x * W;
      let py = p.y * H;
      const dx = px - mx;
      const dy = py - my;
      const d = Math.hypot(dx, dy);
      if (d < 120 && d > 0) {
        const k = ((120 - d) / 120) * 8;
        px += (dx / d) * k;
        py += (dy / d) * k;
      }
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(255,250,236,${p.a * 0.9})`;
      ctx.shadowColor = "rgba(255,240,200,.9)";
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  };
  const vio = new IntersectionObserver(([e]) => {
    vis = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (vis) raf = requestAnimationFrame(tick);
  });
  vio.observe(box);
  return () => {
    vis = false;
    cancelAnimationFrame(raf);
    vio.disconnect();
    ro.disconnect();
    box.removeEventListener("pointermove", onMove);
    box.removeEventListener("pointerleave", onLeave);
    c.remove();
  };
}
