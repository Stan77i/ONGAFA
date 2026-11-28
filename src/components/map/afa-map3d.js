/* Carte immersive AFA : élément <afa-map3d mode="full|teaser" shift="0.2" shift-y="0" href="/carte">.
   Portage de design/afa-map3d.js (maquette « Terre et trait » v2).
   Données : src/data/ci-regions.json (geoBoundaries, CC BY 4.0). Statuts : nzi = active, nawa = upcoming,
   autres = later — toujours signalés par la forme ET la couleur.
   WebGL (three.js, chargé à l'approche de la section) ; repli SVG accessible si pas de WebGL ou si
   l'utilisateur a demandé à réduire les animations. Chargé uniquement côté client (voir AfaMap3D.tsx). */
import regionsData from "@/data/ci-regions.json";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LINKS = { realisations: "/a-propos#realisations", join: "/rejoindre-afa", map: "/carte" };

export function defineAfaMap3D() {
  if (typeof window === "undefined" || customElements.get("afa-map3d")) return;
  const C = {
    ink: "#1d2417",
    night: "#141a10",
    forest: "#2c4520",
    green: "#4a7230",
    leaf: "#59883c",
    orange: "#df8433",
    cream: "#f7f2e8",
    mint: "#a9c98f",
  };
  const statusOf = (s) => (s === "nzi" ? "active" : s === "nawa" ? "upcoming" : "later");
  const LBL = { active: "AFA implantée", upcoming: "AFA bientôt", later: "Déploiement progressif" };
  const MSGS = [
    "Un nouveau point se prépare.",
    "Prochaine étape ?",
    "Vous le saurez ici.",
    "Le réseau continue.",
  ];
  // Animations complètes pour tous (décision T45) : le repli SVG ne sert que sans WebGL.
  const RM = false;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ss = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const eo = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const hex3 = (h) => [
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255,
  ];

  function info(slug, regions) {
    const r = regions && regions.find((x) => x.slug === slug);
    if (slug === "nzi")
      return {
        status: "active",
        eyebrow: "AFA — Implantée",
        name: "Région du N'Zi",
        text: "Zone de naissance d'AFA. Plantations de manioc, unités de transformation et coopératives accompagnées dans une dizaine de sous-préfectures.",
        cta: ["Voir le bilan", LINKS.realisations],
      };
    if (slug === "nawa")
      return {
        status: "upcoming",
        eyebrow: "AFA — Prochaine étape",
        name: "Région de la Nawa",
        text: "Chef-lieu : Soubré. Première étape du déploiement national annoncé par AFA.",
        note: "Vous le saurez ici.",
        cta: ["Voir les étapes", "#chronologie"],
      };
    return {
      status: "later",
      eyebrow: "Déploiement progressif",
      name: r ? r.name : "Autres régions",
      text: "Déploiement progressif sur l'ensemble du territoire national.",
      cta: ["Faire venir AFA", LINKS.join],
    };
  }
  function shapeSVG(st, sz = 14) {
    const c =
      st === "active"
        ? `<circle cx="10" cy="10" r="8" fill="${C.leaf}" stroke="${C.mint}" stroke-width="1.6"/>`
        : st === "upcoming"
          ? `<circle cx="10" cy="10" r="8" fill="none" stroke="${C.orange}" stroke-width="2" stroke-dasharray="3 2.4"/>`
          : `<circle cx="10" cy="10" r="8" fill="#2f4a22" stroke="rgba(247,242,232,.45)" stroke-width="1.4"/>`;
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20" aria-hidden="true" style="flex:none">${c}</svg>`;
  }
  function parseD(d) {
    const polys = [];
    let cur = null;
    const re = /([MLZ])([^MLZ]*)/g;
    let m;
    while ((m = re.exec(d))) {
      if (m[1] === "M") {
        cur = [];
        polys.push(cur);
      }
      if (m[1] !== "Z" && cur) {
        const n = m[2]
          .trim()
          .split(/[\s,]+/)
          .filter(Boolean)
          .map(Number);
        for (let i = 0; i + 1 < n.length; i += 2) cur.push([n[i], n[i + 1]]);
      }
    }
    return polys.filter((p) => p.length > 2);
  }
  function hasGL() {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  }

  function css() {
    if (document.getElementById("am-css")) return;
    const s = document.createElement("style");
    s.id = "am-css";
    s.textContent = `
@layer base{afa-map3d{display:block;position:relative;width:100%;height:100%;overflow:hidden;isolation:isolate;background:${C.night};color:${C.cream};font-family:var(--font-archivo),system-ui,sans-serif;-webkit-tap-highlight-color:transparent}}
afa-map3d canvas{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 1.2s}
afa-map3d canvas.on{opacity:1}
.am-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.am-lab{position:absolute;left:0;top:0;white-space:nowrap;will-change:transform,opacity;opacity:0}
.am-rl{font:700 11px/1 var(--font-archivo),sans-serif;letter-spacing:.12em;text-transform:uppercase;color:rgba(247,242,232,.8);text-shadow:0 1px 8px rgba(20,26,16,.95),0 0 2px rgba(20,26,16,.9)}
.am-ml{display:flex;flex-direction:column;gap:3px;padding:9px 13px 10px;border-radius:14px;background:rgba(20,26,16,.66);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(247,242,232,.16)}
.am-ml small{font:800 10px/1 var(--font-archivo),sans-serif;letter-spacing:.16em;text-transform:uppercase}
.am-ml b{font:800 17px/1.05 var(--font-archivo),sans-serif;letter-spacing:-.01em;color:#fff}
.am-ml i{font:400 24px/1 var(--font-reenie),cursive;font-style:normal;color:${C.cream};transition:opacity .45s}
.am-ml:after{content:"";position:absolute;left:50%;bottom:-7px;width:1px;height:7px;background:rgba(247,242,232,.4)}
.am-tip{position:absolute;left:0;top:0;pointer-events:none;padding:8px 14px;border-radius:999px;background:${C.cream};color:${C.ink};font:700 13px/1 var(--font-archivo),sans-serif;display:flex;gap:8px;align-items:center;opacity:0;transition:opacity .15s;white-space:nowrap;box-shadow:0 10px 24px rgba(0,0,0,.35)}
.am-tip em{font-style:normal;font-weight:600;color:#4b5444}
.am-panel{position:absolute;right:clamp(12px,2.4vw,32px);top:auto;bottom:clamp(120px,16vh,170px);width:min(360px,calc(100% - 24px));transform:none;z-index:6;pointer-events:none;z-index:3;perspective:900px}
.am-card{pointer-events:auto;display:none;flex-direction:column;gap:14px;padding:24px 24px 22px;border-radius:22px;background:rgba(20,26,16,.82);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid rgba(247,242,232,.18);box-shadow:0 30px 60px rgba(0,0,0,.45);position:relative}
.am-card.open{display:flex}
.am-eb{font:800 11px/1 var(--font-archivo),sans-serif;letter-spacing:.16em;text-transform:uppercase}
.am-nm{margin:0;font:800 28px/1.05 var(--font-archivo),sans-serif;letter-spacing:-.02em;color:#fff;padding-right:36px}
.am-st{align-self:flex-start;display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;border:1px solid rgba(247,242,232,.22);font:600 13px/1 var(--font-archivo),sans-serif}
.am-tx{margin:0;font:500 15px/1.55 var(--font-archivo),sans-serif;color:${C.cream}}
.am-nt{margin:0;font:400 30px/1 var(--font-reenie),cursive;color:${C.orange}}
.am-cta{align-self:flex-start;display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 20px;border-radius:999px;background:${C.orange};color:${C.ink}!important;font:800 15px/1 var(--font-archivo),sans-serif;text-decoration:none!important;border:1.5px solid ${C.ink}}
.am-cta:hover{background:#eb9652}
.am-x{position:absolute;right:12px;top:12px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(247,242,232,.2);background:transparent;color:${C.cream};font:400 22px/1 var(--font-archivo),sans-serif;cursor:pointer;display:grid;place-items:center}
.am-x:hover{background:rgba(247,242,232,.12)}
.am-hud{position:absolute;left:clamp(14px,2.4vw,32px);right:clamp(14px,2.4vw,32px);bottom:clamp(14px,2.4vw,28px);display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:14px;pointer-events:none;z-index:2;opacity:0;transition:opacity .8s}
.am-hud.on{opacity:1}
.am-hud>*{pointer-events:auto}
.am-stats{display:flex;flex-direction:column;gap:10px}
.am-count{font:700 12px/1.3 var(--font-archivo),sans-serif;letter-spacing:.12em;text-transform:uppercase;color:${C.mint}}
.am-leg{display:flex;flex-wrap:wrap;gap:6px}
.am-leg span{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border-radius:999px;border:1px solid rgba(247,242,232,.18);font:600 13px/1 var(--font-archivo),sans-serif;color:${C.cream};background:rgba(20,26,16,.55)}
.am-srcl{font:500 11px/1.3 var(--font-archivo),sans-serif;color:rgba(247,242,232,.55)}
.am-ctl{display:flex;gap:6px;align-items:center}
.am-btn{min-width:44px;height:44px;border-radius:999px;border:1px solid rgba(247,242,232,.26);background:rgba(20,26,16,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:${C.cream};font:600 20px/1 var(--font-archivo),sans-serif;cursor:pointer;display:grid;place-items:center;padding:0 14px}
.am-btn:hover{background:${C.cream};color:${C.ink}}
.am-btn.w{font:800 12px/1 var(--font-archivo),sans-serif;letter-spacing:.1em;text-transform:uppercase}
afa-map3d button:focus-visible,afa-map3d a:focus-visible{outline:2px solid ${C.orange};outline-offset:2px}
.am-hint{position:absolute;left:50%;bottom:clamp(96px,12vh,130px);transform:translateX(-50%);font:600 13px/1 var(--font-archivo),sans-serif;letter-spacing:.06em;color:rgba(247,242,232,.8);opacity:0;transition:opacity .8s;pointer-events:none;white-space:nowrap;display:flex;gap:10px;align-items:center}
.am-hint span{width:22px;height:34px;border:1.5px solid rgba(247,242,232,.6);border-radius:12px;position:relative}
.am-hint span:after{content:"";position:absolute;left:50%;top:7px;width:3px;height:7px;margin-left:-1.5px;border-radius:2px;background:${C.cream};animation:amWheel 1.6s infinite}
@keyframes amWheel{0%{transform:translateY(0);opacity:1}100%{transform:translateY(10px);opacity:0}}
.am-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;margin:0;padding:0;list-style:none}
.am-sr:focus-within{width:auto;height:auto;clip:auto;clip-path:none;overflow:auto;white-space:normal;left:clamp(12px,2.4vw,32px);top:50%;transform:translateY(-50%);max-height:min(60%,420px);z-index:7;display:grid;gap:4px;padding:10px;border-radius:18px;background:rgba(20,26,16,.94);border:1px solid rgba(247,242,232,.2)}
.am-sr button{min-height:40px;padding:0 14px;border-radius:999px;border:1px solid rgba(247,242,232,.2);background:transparent;color:#f7f2e8;font:600 14px/1 var(--font-archivo),sans-serif;text-align:left;cursor:pointer}
.am-sr button:hover{background:rgba(247,242,232,.12)}
.am-fb{position:absolute;inset:0;padding:clamp(150px,22vh,230px) clamp(16px,4vw,60px) clamp(120px,16vh,160px)}
.am-fb>svg{width:100%;height:100%;display:block;overflow:visible}
.am-fb path[data-slug]{cursor:pointer;transition:fill .2s,stroke .2s}
.am-fb path[data-slug]:focus{outline:none}
.am-fb path[data-slug]:focus-visible,.am-fb path[data-slug].sel{stroke:${C.orange};stroke-width:5}
@media (max-width:1000px){.am-panel{top:auto;bottom:12px;left:12px;right:12px;width:auto;transform:none}}@media (max-width:700px){.am-hint{display:none}.am-nm{font-size:24px}.am-hud{gap:10px}}

`;
    document.head.appendChild(s);
  }

  class AfaMap3D extends HTMLElement {
    set mode(v) {
      this._mode = v;
    }
    get mode() {
      return this.getAttribute("mode") || this._mode || "full";
    }
    set shift(v) {
      this._shift = v;
    }
    get shift() {
      return +(this.getAttribute("shift") ?? this._shift ?? 0) || 0;
    }
    set shiftY(v) {
      this._shiftY = v;
    }
    get shiftY() {
      return +(this.getAttribute("shift-y") ?? this._shiftY ?? 0) || 0;
    }
    set href(v) {
      this._href = v;
    }
    get href() {
      return this.getAttribute("href") || this._href || LINKS.map;
    }

    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this._dead = false;
      css();
      requestAnimationFrame(() => this.boot());
    }
    disconnectedCallback() {
      this._dead = true;
      this._booted = false;
      cancelAnimationFrame(this._raf);
      this._io?.disconnect();
      this._io2?.disconnect();
      this._ro?.disconnect();
      try {
        this.renderer?.dispose();
      } catch {
        /* contexte déjà perdu */
      }
      this.renderer = null;
    }

    boot() {
      if (this._dead) return;
      this.full = this.mode !== "teaser";
      this.innerHTML = "";
      this.sel = null;
      this.hov = null;
      const el = (tag, cls, html) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html != null) e.innerHTML = html;
        return e;
      };
      this.cv = el("canvas");
      this.cv.setAttribute("aria-hidden", "true");
      this.lay = el("div", "am-layer");
      this.lay.setAttribute("aria-hidden", "true");
      this.tip = el("div", "am-tip");
      this.append(this.cv, this.lay, this.tip);
      if (this.full) {
        this.setAttribute("role", "region");
        this.setAttribute("aria-label", "Carte interactive des implantations de l'ONG AFA en Côte d'Ivoire");
        this.panel = el("div", "am-panel");
        this.card = el("div", "am-card");
        this.card.setAttribute("aria-live", "polite");
        this.panel.appendChild(this.card);
        this.hud = el("div", "am-hud");
        this.hint = el(
          "div",
          "am-hint",
          "<span></span>Molette ou pincement pour entrer · glisser pour explorer",
        );
        this.sr = el("ul", "am-sr");
        this.sr.setAttribute("aria-label", "Régions de Côte d'Ivoire");
        this.append(this.panel, this.hud, this.hint, this.sr);
        this.addEventListener("keydown", (e) => this.onKey(e));
      } else {
        this.setAttribute("role", "img");
        this.setAttribute(
          "aria-label",
          "Carte vivante : AFA implantée dans le N'Zi, prochaine étape la Nawa. Ouvrez la carte nationale pour explorer.",
        );
      }
      this.dataP = Promise.resolve(regionsData).then((j) => {
        this.data = j;
        this.buildChrome();
        return j;
      });
      this._io = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting)) {
            this._io.disconnect();
            this.start();
          }
        },
        { rootMargin: "400px 0px" },
      );
      this._io.observe(this);
    }

    buildChrome() {
      if (!this.full) return;
      const rs = this.data.regions;
      const n = { active: 0, upcoming: 0 };
      rs.forEach((r) => {
        const s = statusOf(r.slug);
        if (n[s] != null) n[s]++;
      });
      this.hud.innerHTML = `<div class="am-stats"><div class="am-count">${n.active} région implantée · ${n.upcoming} prochaine étape · ${rs.length} régions</div>
        <div class="am-leg" aria-label="Légende">${["active", "upcoming", "later"].map((s) => `<span>${shapeSVG(s)}${LBL[s]}</span>`).join("")}</div>
        <div class="am-srcl">Fond : ${this.data.source}</div></div>
        <div class="am-ctl" role="group" aria-label="Contrôles de la carte"><button type="button" class="am-btn" data-z="in" aria-label="Zoomer">+</button><button type="button" class="am-btn" data-z="out" aria-label="Dézoomer">−</button><button type="button" class="am-btn w" data-z="home">Vue nationale</button></div>`;
      this.hud.addEventListener("click", (e) => {
        const b = e.target.closest("[data-z]");
        if (!b) return;
        const z = b.dataset.z;
        this.interacted();
        if (z === "home") this.home();
        else this.zoomBy(z === "in" ? 0.25 : -0.25);
      });
      this.sr.innerHTML = rs
        .map(
          (r) =>
            `<li><button type="button" data-slug="${r.slug}">${r.name} : ${LBL[statusOf(r.slug)]}</button></li>`,
        )
        .join("");
      this.sr.addEventListener("click", (e) => {
        const b = e.target.closest("[data-slug]");
        if (b) this.select(b.dataset.slug, true);
      });
    }

    async start() {
      await this.dataP.catch(() => null);
      if (this._dead || !this.data) return;
      if ((RM && !window.AFA_FORCE_3D) || !hasGL()) return this.fallback();
      try {
        const T = await import("three");
        if (this._dead) return;
        this.build(T);
      } catch (e) {
        console.warn("afa-map3d: repli SVG", e);
        this.fallback();
      }
    }

    /* ---------- Repli SVG (même logique, même statuts) ---------- */
    fallback() {
      this.fb = true;
      this.cv.remove();
      this.lay.remove();
      if (this.hud) {
        this.hud.classList.add("on");
        const c = this.hud.querySelector(".am-ctl");
        if (c) c.style.display = "none";
      }
      const j = this.data;
      const nz = j.regions.find((r) => r.slug === "nzi"),
        nw = j.regions.find((r) => r.slug === "nawa");
      const [ax, ay] = nz.label,
        [bx, by] = nw.label,
        mx = (ax + bx) / 2,
        my = Math.min(ay, by) - 170;
      const paths = j.regions
        .map((r) => {
          const st = statusOf(r.slug);
          const fill = st === "active" ? C.leaf : st === "upcoming" ? "url(#am-hatch)" : "#2f4a22";
          const stroke = st === "active" ? C.mint : st === "upcoming" ? C.orange : "rgba(247,242,232,.35)";
          return `<path data-slug="${r.slug}" d="${r.d}" fill="${fill}" stroke="${stroke}" stroke-width="${st === "later" ? 1.2 : 2.6}"${st === "upcoming" ? ' stroke-dasharray="7 5"' : ""} stroke-linejoin="round" tabindex="0" role="button" aria-label="${r.name.replace(/"/g, "")} : ${LBL[st]}"></path>`;
        })
        .join("");
      const fb = document.createElement("div");
      fb.className = "am-fb";
      fb.innerHTML = `<svg viewBox="${j.viewBox}" role="group" aria-label="Carte des implantations de l'ONG AFA en Côte d'Ivoire">
        <defs><pattern id="am-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="${C.forest}"/><line x1="0" y1="0" x2="0" y2="10" stroke="${C.orange}" stroke-width="5"/></pattern></defs>
        ${paths}
        <path d="M${ax},${ay} Q${mx},${my} ${bx + 18},${by - 26}" fill="none" stroke="${C.cream}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" pointer-events="none"/>
        <g pointer-events="none" text-anchor="middle" style="font:800 28px var(--font-archivo),sans-serif"><text x="${ax}" y="${ay + 10}" fill="#fff" stroke="${C.forest}" stroke-width="6" paint-order="stroke">N'Zi</text><text x="${bx}" y="${by + 10}" fill="#fff" stroke="${C.ink}" stroke-width="6" paint-order="stroke">Nawa</text>
        <text x="${mx}" y="${my + 40}" fill="${C.orange}" style="font:400 46px var(--font-reenie),cursive">prochaine étape</text></g></svg>`;
      this.insertBefore(fb, this.firstChild);
      this.fbEl = fb;
      fb.addEventListener("click", (e) => {
        const p = e.target.closest("[data-slug]");
        this.tapSlug(p ? p.dataset.slug : null);
      });
      fb.addEventListener("keydown", (e) => {
        const p = e.target.closest("[data-slug]");
        if (p && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          this.tapSlug(p.dataset.slug);
        }
      });
      if (!this.full) {
        fb.style.cursor = "pointer";
      }
      const m = location.hash.match(/r=([\w-]+)/);
      if (this.full && m) this.select(m[1]);
    }

    go(path) {
      if (this.navigate) this.navigate(path);
      else location.href = BASE + path;
    }

    tapSlug(slug) {
      if (!this.full) {
        this.go(this.href + (slug ? "#r=" + slug : ""));
        return;
      }
      if (slug) this.select(slug);
      else this.clearSel();
    }

    /* ---------- Panneau contextuel ---------- */
    showPanel(slug) {
      if (!this.card) return;
      const f = info(slug, this.data.regions);
      const col =
        f.status === "active" ? C.mint : f.status === "upcoming" ? C.orange : "rgba(247,242,232,.7)";
      this.card.innerHTML = "";
      const mk = (tag, cls, txt) => {
        const e = document.createElement(tag);
        e.className = cls;
        if (txt != null) e.textContent = txt;
        return e;
      };
      const eb = mk("span", "am-eb", f.eyebrow);
      eb.style.color = col;
      const nm = mk("h3", "am-nm", f.name);
      const st = mk("span", "am-st");
      st.innerHTML = shapeSVG(f.status);
      st.append(LBL[f.status]);
      const tx = mk("p", "am-tx", f.text);
      const x = mk("button", "am-x", "×");
      x.type = "button";
      x.setAttribute("aria-label", "Fermer");
      x.onclick = () => this.clearSel();
      const a = mk("a", "am-cta", f.cta[0]);
      const to = f.cta[1];
      a.href = to.startsWith("#") ? to : BASE + to;
      if (!to.startsWith("#"))
        a.addEventListener("click", (e) => {
          if (this.navigate && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            this.navigate(to);
          }
        });
      a.insertAdjacentHTML(
        "beforeend",
        '<svg width="18" height="12" viewBox="0 0 22 14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 7H20M14 1l6 6-6 6"/></svg>',
      );
      this.card.append(x, eb, nm, st, tx);
      if (f.note) this.card.append(mk("p", "am-nt", f.note));
      this.card.append(a);
      const was = this.card.classList.contains("open");
      this.card.classList.add("open");
      if (!RM)
        this.card.animate(
          was
            ? [
                { opacity: 0.4, transform: "translateY(6px)" },
                { opacity: 1, transform: "none" },
              ]
            : [
                { opacity: 0, transform: "translateZ(-120px) rotateY(-10deg) translateX(30px)" },
                { opacity: 1, transform: "none" },
              ],
          { duration: was ? 260 : 620, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
    }
    hidePanel() {
      if (this.card) this.card.classList.remove("open");
    }

    select(slug) {
      if (!this.data.regions.find((r) => r.slug === slug)) return;
      this.sel = slug;
      this.showPanel(slug);
      this.interacted();
      if (this.fb) {
        this.fbEl
          .querySelectorAll("[data-slug]")
          .forEach((p) => p.classList.toggle("sel", p.dataset.slug === slug));
        return;
      }
      const R = this.R[slug];
      if (!R) return;
      this.goal.tx = R.c.x;
      this.goal.tz = R.c.z;
      this.goal.z = Math.max(this.goal.z, slug === "nzi" || slug === "nawa" ? 0.62 : 0.52);
      if (!RM && slug === "nawa") this.pulseAt = this.t;
    }
    clearSel() {
      this.sel = null;
      this.hidePanel();
      if (this.fb) this.fbEl.querySelectorAll(".sel").forEach((p) => p.classList.remove("sel"));
      this.syncEngaged();
    }
    home() {
      this.clearSel();
      this.syncEngaged();
      if (!this.goal) return;
      this.goal.tx = 0;
      this.goal.tz = 30;
      this.goal.z = 0;
    }
    zoomBy(dz) {
      if (!this.goal) return;
      this.goal.z = clamp(this.goal.z + dz, 0, 1);
    }
    interacted() {
      if (this.hint) this.hint.style.opacity = 0;
      this._interacted = true;
      this.syncEngaged();
    }
    /** `data-engaged` : la carte est explorée (zoom ou région choisie) ; la page peut alors s'effacer. */
    syncEngaged() {
      const on = !!this.sel || (this.goal ? this.goal.z > 0.06 : false);
      if (on !== this._engaged) {
        this._engaged = on;
        this.toggleAttribute("data-engaged", on);
      }
    }
    onKey(e) {
      if (e.target.closest && e.target.closest("a,input")) return;
      if (e.key === "+" || e.key === "=") {
        this.zoomBy(0.2);
        this.interacted();
      } else if (e.key === "-" || e.key === "_") {
        this.zoomBy(-0.2);
        this.interacted();
      } else if (e.key === "Escape") {
        if (this.sel) this.clearSel();
        else this.home();
      } else if (e.key === "0") this.home();
    }

    /* ---------- Scène WebGL ---------- */
    build(T) {
      this.T = T;
      const low =
        matchMedia("(pointer: coarse)").matches ||
        innerWidth < 760 ||
        (navigator.hardwareConcurrency || 8) <= 4;
      this.low = low;
      const R = (this.renderer = new T.WebGLRenderer({
        canvas: this.cv,
        antialias: !low || devicePixelRatio < 2,
        powerPreference: "high-performance",
      }));
      R.setPixelRatio(Math.min(devicePixelRatio || 1, low ? 1.5 : 1.75));
      R.outputColorSpace = T.SRGBColorSpace;
      R.toneMapping = T.NoToneMapping;
      const scene = (this.scene = new T.Scene());
      scene.background = new T.Color(C.night);
      scene.fog = new T.Fog(C.night, 2000, 5000);
      this.camera = new T.PerspectiveCamera(30, 1, 10, 9000);
      scene.add(new T.HemisphereLight(0xfff3df, 0x0e140b, 1.5));
      const sun = new T.DirectionalLight(0xffd6a8, 2.3);
      sun.position.set(-700, 1000, 600);
      scene.add(sun);
      const rim = new T.DirectionalLight(0xa9c98f, 0.7);
      rim.position.set(800, 300, -900);
      scene.add(rim);
      const GY = (this.GY = 36);
      const j = this.data;

      /* lueur / ombre du territoire peinte depuis les tracés du repo */
      const gc = document.createElement("canvas");
      gc.width = gc.height = 512;
      const g = gc.getContext("2d");
      const k = 512 / 1600;
      g.setTransform(k, 0, 0, k, (800 - 500) * k, (800 - 528.5) * k);
      g.filter = "blur(10px)";
      g.fillStyle = "rgba(255,255,255,1)";
      j.regions.forEach((r) => g.fill(new Path2D(r.d)));
      g.filter = "blur(3px)";
      g.fill(new Path2D(j.regions.map((r) => r.d).join(" ")));
      const glowTex = new T.CanvasTexture(gc);
      glowTex.flipY = false;

      const ground = new T.Mesh(
        new T.PlaneGeometry(7000, 7000).rotateX(-Math.PI / 2),
        new T.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uGlow: { value: glowTex },
            uBase: { value: new T.Vector3(...hex3(C.night)) },
            uLine: { value: new T.Vector3(...hex3(C.cream)) },
            uGlowC: { value: new T.Vector3(...hex3("#3d6a2a")) },
            uR: { value: 2600 },
          },
          vertexShader: `varying vec2 vP; void main(){ vec4 w = modelMatrix*vec4(position,1.); vP = w.xz; gl_Position = projectionMatrix*viewMatrix*w; }`,
          fragmentShader: `varying vec2 vP; uniform float uTime,uR; uniform sampler2D uGlow; uniform vec3 uBase,uLine,uGlowC;
          float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
          float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
          void main(){
            vec2 p=vP*.0016; float e=fbm(p+vec2(uTime*.006,uTime*.003));
            float kk=e*16.; float l=abs(fract(kk)-.5)/fwidth(kk); float line=1.-min(l,1.);
            float r=length(vP)/uR; float fade=1.-smoothstep(.1,1.,r);
            vec2 guv=vP/1600.+.5; float gl=0.; if(guv.x>0.&&guv.x<1.&&guv.y>0.&&guv.y<1.) gl=texture2D(uGlow,guv).r;
            vec3 col=uBase + uLine*line*.055*fade;
            col=mix(col, uBase*.62, smoothstep(.0,.9,gl)*.4);
            float halo=texture2D(uGlow,clamp((vP*.82)/1600.+.5,0.,1.)).r;
            col+=uGlowC*halo*.16*(1.-gl*.6);
            gl_FragColor=vec4(col,1.);
          }`,
          fog: false,
        }),
      );
      scene.add(ground);
      this.ground = ground;

      /* hachures « AFA bientôt » */
      const hc = document.createElement("canvas");
      hc.width = hc.height = 64;
      const hx = hc.getContext("2d");
      hx.fillStyle = "#4a3a22";
      hx.fillRect(0, 0, 64, 64);
      hx.strokeStyle = "#c9762f";
      hx.lineWidth = 9;
      for (let o = -64; o <= 64; o += 32) {
        hx.beginPath();
        hx.moveTo(o, 64);
        hx.lineTo(o + 64, 0);
        hx.stroke();
      }
      const hatch = new T.CanvasTexture(hc);
      hatch.wrapS = hatch.wrapT = T.RepeatWrapping;
      hatch.repeat.set(1 / 10, 1 / 10);
      hatch.colorSpace = T.SRGBColorSpace;

      const group = (this.group = new T.Group());
      group.position.y = GY;
      scene.add(group);
      this.R = {};
      this.pick = [];
      const nzi = j.regions.find((r) => r.slug === "nzi");
      const nziW = new T.Vector2(nzi.label[0] - 500, nzi.label[1] - 528.5);
      const pal = ["#2b4420", "#304b23", "#34512a", "#2e4722", "#385628"];
      j.regions.forEach((r, i) => {
        const st = statusOf(r.slug);
        const shapes = parseD(r.d).map((pts) => {
          const s = new T.Shape();
          pts.forEach(([x, y], q) => (q ? s.lineTo(x - 500, -(y - 528.5)) : s.moveTo(x - 500, -(y - 528.5))));
          return s;
        });
        const depth = st === "active" ? 30 : st === "upcoming" ? 18 : 9;
        const geo = new T.ExtrudeGeometry(shapes, {
          depth,
          bevelEnabled: true,
          bevelThickness: 1.4,
          bevelSize: 1.1,
          bevelSegments: 1,
          curveSegments: 1,
        });
        geo.rotateX(-Math.PI / 2);
        const base = new T.Color(
          st === "active" ? C.leaf : st === "upcoming" ? "#ffffff" : pal[i % pal.length],
        );
        const top = new T.MeshLambertMaterial({
          color: base.clone(),
          map: st === "upcoming" ? hatch : null,
          emissive: new T.Color(st === "active" ? C.green : "#000000"),
          emissiveIntensity: st === "active" ? 0.35 : 0,
        });
        const side = new T.MeshLambertMaterial({
          color: st === "active" ? "#2c4520" : st === "upcoming" ? "#5a3a1c" : "#18200f",
        });
        const mesh = new T.Mesh(geo, [top, side]);
        mesh.userData.slug = r.slug;
        const lines = [];
        parseD(r.d).forEach((pts) => {
          const arr = [];
          pts.forEach(([x, y]) => arr.push(x - 500, depth + 1.8, y - 528.5));
          arr.push(pts[0][0] - 500, depth + 1.8, pts[0][1] - 528.5);
          const lg = new T.BufferGeometry();
          lg.setAttribute("position", new T.Float32BufferAttribute(arr, 3));
          const lm =
            st === "upcoming"
              ? new T.LineDashedMaterial({
                  color: C.orange,
                  dashSize: 7,
                  gapSize: 5,
                  transparent: true,
                  opacity: 1,
                })
              : new T.LineBasicMaterial({
                  color: st === "active" ? C.mint : C.cream,
                  transparent: true,
                  opacity: st === "active" ? 0.95 : 0.26,
                });
          const line = new T.Line(lg, lm);
          if (st === "upcoming") line.computeLineDistances();
          mesh.add(line);
          lines.push(line);
        });
        group.add(mesh);
        this.pick.push(mesh);
        const c = new T.Vector3(r.label[0] - 500, 0, r.label[1] - 528.5);
        this.R[r.slug] = {
          slug: r.slug,
          name: r.name,
          st,
          mesh,
          top,
          base,
          depth,
          lines,
          c,
          lift: 0,
          hv: 0,
          dim: 1,
          dist: Math.hypot(c.x - nziW.x, c.z - nziW.y),
        };
      });

      /* textures */
      const rad = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 128;
        const x = c.getContext("2d");
        const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
        gr.addColorStop(0, "rgba(255,255,255,1)");
        gr.addColorStop(0.25, "rgba(255,255,255,.55)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        x.fillStyle = gr;
        x.fillRect(0, 0, 128, 128);
        return new T.CanvasTexture(c);
      })();
      this.rad = rad;

      /* marqueurs vivants */
      this.M = {};
      const mkMarker = (slug, color, sweep) => {
        const Rg = this.R[slug];
        const m = new T.Group();
        m.position.set(Rg.c.x, GY + Rg.depth + 2, Rg.c.z);
        scene.add(m);
        const H = 58;
        const stem = new T.Line(
          new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0, 0), new T.Vector3(0, H, 0)]),
          new T.LineBasicMaterial({ color: C.cream, transparent: true, opacity: 0.55 }),
        );
        const core = new T.Mesh(new T.SphereGeometry(6, 20, 14), new T.MeshBasicMaterial({ color }));
        core.position.y = H;
        const halo = new T.Sprite(
          new T.SpriteMaterial({
            map: rad,
            color,
            transparent: true,
            depthWrite: false,
            blending: T.AdditiveBlending,
          }),
        );
        halo.position.y = H;
        halo.scale.setScalar(70);
        halo.userData.slug = slug;
        const foot = new T.Mesh(
          new T.CircleGeometry(9, 32).rotateX(-Math.PI / 2),
          new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false }),
        );
        foot.position.y = 0.6;
        const rings = [0, 1, 2].map(() => {
          const rm = new T.Mesh(
            new T.RingGeometry(10, 12, 72).rotateX(-Math.PI / 2),
            new T.MeshBasicMaterial({
              color,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              side: T.DoubleSide,
            }),
          );
          rm.position.y = 1;
          m.add(rm);
          return rm;
        });
        const big = new T.Mesh(
          new T.RingGeometry(10, 11.2, 96).rotateX(-Math.PI / 2),
          new T.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: T.DoubleSide,
          }),
        );
        big.position.y = 1.2;
        m.add(big);
        let sw = null;
        if (sweep) {
          sw = new T.Mesh(
            new T.CircleGeometry(150, 96).rotateX(-Math.PI / 2),
            new T.ShaderMaterial({
              uniforms: {
                uTime: { value: 0 },
                uC: { value: new T.Vector3(...hex3(color)) },
                uA: { value: 0 },
              },
              transparent: true,
              depthWrite: false,
              blending: T.AdditiveBlending,
              vertexShader:
                "varying vec2 vU; void main(){ vU = position.xz/150.; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
              fragmentShader: `varying vec2 vU; uniform float uTime,uA; uniform vec3 uC;
              void main(){ float r=length(vU); if(r>1.) discard; float a=atan(vU.y,vU.x); float s=mod(a+uTime*1.1,6.28318)/6.28318;
                float trail=pow(s,7.); float grid=(1.-smoothstep(0.,.012,abs(fract(r*3.)-.5)-.488))*.35; float edge=1.-smoothstep(.94,1.,r);
                float cross=(1.-smoothstep(0.,.006,abs(vU.x)))+(1.-smoothstep(0.,.006,abs(vU.y)));
                gl_FragColor=vec4(uC,(trail*.42*(1.-r*.5)+grid*.5+cross*.08)*edge*uA); }`,
            }),
          );
          sw.position.y = 1.4;
          m.add(sw);
        }
        m.add(stem, core, halo, foot);
        this.pick.push(halo);
        this.M[slug] = {
          g: m,
          H,
          core,
          halo,
          rings,
          big,
          sw,
          stem,
          foot,
          ph: Math.random() * 6,
          appear: 0,
          hv: 0,
        };
      };
      mkMarker("nzi", C.mint, false);
      mkMarker("nawa", C.orange, true);

      /* fil N'Zi → Nawa */
      const A = this.M.nzi.g.position.clone().add(new T.Vector3(0, this.M.nzi.H, 0));
      const B = this.M.nawa.g.position.clone().add(new T.Vector3(0, this.M.nawa.H, 0));
      const mid = A.clone()
        .lerp(B, 0.5)
        .add(new T.Vector3(0, 240, 0));
      const curve = (this.curve = new T.QuadraticBezierCurve3(A, mid, B));
      this.arc = new T.Mesh(
        new T.TubeGeometry(curve, 140, 1.7, 6, false),
        new T.ShaderMaterial({
          uniforms: {
            uP: { value: 0 },
            uTime: { value: 0 },
            uC: { value: new T.Vector3(...hex3(C.cream)) },
            uO: { value: new T.Vector3(...hex3(C.orange)) },
          },
          transparent: true,
          depthWrite: false,
          vertexShader:
            "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
          fragmentShader: `varying vec2 vUv; uniform float uP,uTime; uniform vec3 uC,uO;
          void main(){ float x=vUv.x; if(x>uP) discard; float dash=step(.42,fract(x*46.-uTime*.9)); float head=smoothstep(uP-.06,uP,x)*step(uP,.999);
            gl_FragColor=vec4(mix(mix(uC,uO,x),vec3(1.),head),(.25+.75*dash)*.9); }`,
        }),
      );
      scene.add(this.arc);
      this.traveler = new T.Sprite(
        new T.SpriteMaterial({
          map: rad,
          color: C.orange,
          transparent: true,
          depthWrite: false,
          blending: T.AdditiveBlending,
          opacity: 0,
        }),
      );
      this.traveler.scale.setScalar(34);
      scene.add(this.traveler);

      /* pollen / poussière de latérite, très discret */
      const N = low ? 60 : 150;
      const pos = new Float32Array(N * 3);
      this.pv = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 1500;
        pos[i * 3 + 1] = 40 + Math.random() * 520;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 1400;
        this.pv[i] = 0.12 + Math.random() * 0.35;
      }
      const pg = new T.BufferGeometry();
      pg.setAttribute("position", new T.BufferAttribute(pos, 3));
      this.dust = new T.Points(
        pg,
        new T.PointsMaterial({
          map: rad,
          color: "#fff1d6",
          size: low ? 7 : 6,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.32,
          depthWrite: false,
          blending: T.AdditiveBlending,
        }),
      );
      scene.add(this.dust);

      /* étiquettes HTML */
      this.L = [];
      j.regions.forEach((r) => {
        if (r.slug === "nzi" || r.slug === "nawa") return;
        const e = document.createElement("div");
        e.className = "am-lab am-rl";
        e.textContent = r.name;
        this.lay.appendChild(e);
        this.L.push({ e, slug: r.slug, kind: "r", w: r.name.length * 8 + 6, h: 14, o: 0 });
      });
      const ml = (slug, eb, ebc, nm) => {
        const e = document.createElement("div");
        e.className = "am-lab am-ml";
        e.innerHTML = `<small style="color:${ebc}">${eb}</small><b>${nm}</b>`;
        if (slug === "nawa") {
          this.msgEl = document.createElement("i");
          this.msgEl.textContent = MSGS[0];
          e.appendChild(this.msgEl);
        }
        this.lay.appendChild(e);
        this.L.push({ e, slug, kind: "m", w: 150, h: 60, o: 0 });
      };
      ml("nzi", "AFA implantée", C.mint, "N'Zi");
      ml("nawa", "Prochaine étape", C.orange, "Nawa");

      /* caméra */
      this.cur = { tx: 0, tz: 30, z: -0.4, sx: 0, sy: 0 };
      this.goal = { tx: 0, tz: 30, z: 0 };
      this.px = 0;
      this.py = 0;
      this.ppx = 0;
      this.ppy = 0;
      this.ray = new T.Raycaster();
      this.ndc = new T.Vector2();
      this.v3 = new T.Vector3();
      this.plane = new T.Plane(new T.Vector3(0, 1, 0), -GY);
      this.ptrs = new Map();
      this.msgI = 0;

      this.bindInput();
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(this);
      this.resize();
      this.visible = false;
      this.t = 0;
      this.last = performance.now();
      this._io2 = new IntersectionObserver(
        (es) => {
          const e = es[es.length - 1];
          const was = this.visible;
          this.visible = e.isIntersecting;
          if (e.intersectionRatio > 0.3 && this.introT == null) this.introT = this.t;
          if (this.visible && !was) {
            this.last = performance.now();
            this._raf = requestAnimationFrame(this.loop);
          }
        },
        { threshold: [0, 0.3, 0.6] },
      );
      this._io2.observe(this);
      this.loop = this.loop.bind(this);
      this.cv.classList.add("on");
      const m = location.hash.match(/r=([\w-]+)/);
      if (this.full && m) this.pendingSel = m[1];
    }

    resize() {
      if (!this.renderer) return;
      this.W = Math.max(1, this.clientWidth);
      this.H = Math.max(1, this.clientHeight);
      this.renderer.setSize(this.W, this.H, false);
      this.camera.aspect = this.W / this.H;
      this.wide = this.W > 900;
    }

    bindInput() {
      const cv = this.cv;
      this.style.touchAction = "pan-y";
      const pos = (e) => {
        const r = this.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      cv.addEventListener("pointerdown", (e) => {
        const p = pos(e);
        this.ptrs.set(e.pointerId, p);
        this.down = { ...p };
        this.moved = 0;
        if (this.full && (this.goal.z > 0.02 || e.pointerType === "mouse"))
          try {
            cv.setPointerCapture(e.pointerId);
          } catch {
            /* pointeur déjà relâché */
          }
        if (this.ptrs.size === 2) {
          const [a, b] = [...this.ptrs.values()];
          this.pinch = Math.hypot(a.x - b.x, a.y - b.y);
        }
      });
      cv.addEventListener("pointermove", (e) => {
        const p = pos(e);
        if (e.pointerType === "mouse") {
          this.mouse = p;
          this.mouseDirty = true;
          this.px = (p.x / this.W) * 2 - 1;
          this.py = (p.y / this.H) * 2 - 1;
        }
        const prev = this.ptrs.get(e.pointerId);
        if (!prev) return;
        this.ptrs.set(e.pointerId, p);
        if (this.ptrs.size === 2 && this.full) {
          const [a, b] = [...this.ptrs.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (this.pinch) {
            this.goal.z = clamp(this.goal.z + Math.log(d / this.pinch) * 1.1, 0, 1);
            this.interacted();
          }
          this.pinch = d;
          this.moved += 99;
          return;
        }
        const dx = p.x - prev.x,
          dy = p.y - prev.y;
        this.moved += Math.abs(dx) + Math.abs(dy);
        if (
          this.full &&
          this.ptrs.size === 1 &&
          (e.pointerType === "mouse" ? e.buttons & 1 : this.goal.z > 0.02) &&
          this.moved > 4
        ) {
          const t = Math.tan((this.camera.fov * Math.PI) / 360);
          const s = (2 * this.dist * t) / this.H;
          this.goal.tx = clamp(this.goal.tx - dx * s, -560, 560);
          this.goal.tz = clamp(this.goal.tz - dy * s * 1.35, -580, 600);
          this.interacted();
          cv.style.cursor = "grabbing";
        }
      });
      const up = (e) => {
        const had = this.ptrs.has(e.pointerId);
        this.ptrs.delete(e.pointerId);
        if (this.ptrs.size < 2) this.pinch = 0;
        cv.style.cursor = "";
        if (had && e.type === "pointerup" && this.moved < 7) {
          const p = pos(e);
          this.tapSlug(this.pickAt(p.x, p.y));
        }
      };
      cv.addEventListener("pointerup", up);
      cv.addEventListener("pointercancel", up);
      cv.addEventListener("pointerleave", () => {
        this.mouse = null;
        this.mouseDirty = true;
        this.px = this.py = 0;
      });
      if (this.full) {
        this.addEventListener(
          "wheel",
          (e) => {
            const zoomIn = e.deltaY < 0;
            if (this.goal.z <= 0.001 && !zoomIn) return;
            const r = this.getBoundingClientRect();
            if (zoomIn && this.goal.z <= 0.001 && (r.top > innerHeight * 0.2 || r.bottom < innerHeight * 0.8))
              return;
            e.preventDefault();
            const dz = clamp(-e.deltaY * (e.deltaMode ? 0.04 : 0.0013), -0.2, 0.2);
            const nz = clamp(this.goal.z + dz, 0, 1);
            const real = nz - this.goal.z;
            this.goal.z = nz;
            if (real > 0 && this.mouse) {
              const h = this.groundAt(this.mouse.x, this.mouse.y);
              if (h) {
                this.goal.tx += (h.x - this.goal.tx) * real * 1.6;
                this.goal.tz += (h.z - this.goal.tz) * real * 1.6;
              }
            }
            if (this.goal.z === 0) {
              this.goal.tx *= 0.6;
              this.goal.tz = lerp(this.goal.tz, 30, 0.4);
            }
            this.interacted();
          },
          { passive: false },
        );
        cv.addEventListener("dblclick", (e) => {
          const p = pos(e);
          const h = this.groundAt(p.x, p.y);
          this.goal.z = clamp(this.goal.z + 0.3, 0, 1);
          if (h) {
            this.goal.tx = h.x;
            this.goal.tz = h.z;
          }
          this.interacted();
        });
      }
    }

    groundAt(x, y) {
      this.ndc.set((x / this.W) * 2 - 1, -(y / this.H) * 2 + 1);
      this.ray.setFromCamera(this.ndc, this.camera);
      const v = new this.T.Vector3();
      return this.ray.ray.intersectPlane(this.plane, v) ? v : null;
    }
    pickAt(x, y) {
      if (!this.camera) return null;
      this.ndc.set((x / this.W) * 2 - 1, -(y / this.H) * 2 + 1);
      this.ray.setFromCamera(this.ndc, this.camera);
      const hit = this.ray.intersectObjects(this.pick, false)[0];
      return hit ? hit.object.userData.slug : null;
    }

    loop(now) {
      if (this._dead || !this.renderer) return;
      if (!this.visible) return;
      this._raf = requestAnimationFrame(this.loop);
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.t += dt;
      this.syncEngaged();
      const t = this.t,
        T = this.T,
        cam = this.camera;
      const it = this.introT == null ? -1 : t - this.introT;

      /* caméra */
      const k = 1 - Math.exp(-dt * 3.2),
        c = this.cur,
        g = this.goal;
      c.tx = lerp(c.tx, g.tx, k);
      c.tz = lerp(c.tz, g.tz, k);
      c.z = lerp(c.z, g.z, it < 0 ? 0 : k * 0.8);
      const wide = this.full ? this.wide : this.W > 1100,
        open = !!this.sel && this.full;
      const sxG = (wide ? this.shift : 0) + (open && this.W > 1000 ? -0.17 : 0);
      const syG = (!wide && !this.full ? 0.24 : this.shiftY) + (open && this.W <= 1000 ? -0.17 : 0);
      c.sx = lerp(c.sx, sxG, k);
      c.sy = lerp(c.sy, syG, k);
      this.ppx = lerp(this.ppx, this.px, 1 - Math.exp(-dt * 2));
      this.ppy = lerp(this.ppy, this.py, 1 - Math.exp(-dt * 2));
      const tn = Math.tan((cam.fov * Math.PI) / 360),
        A = this.W / this.H;
      const dV =
        (this.full ? 640 : 560) / (tn * Math.max(0.45, 1 - 2 * Math.abs(this.full ? this.shiftY : syG)));
      const dH = 560 / (tn * Math.max(0.35, A * (1 - 2 * Math.abs(wide ? this.shift : 0))));
      const dNat = Math.max(dV, dH);
      const ez = c.z < 0 ? c.z : eo(c.z) * 0.25 + c.z * 0.75;
      const d = (this.dist = dNat * (ez < 0 ? 1 - ez * 0.9 : lerp(1, 0.2, ez)));
      const introTilt = it < 0 ? 0.4 : lerp(0.4, 0, eo(it / 2.6));
      const phi = lerp(0.7, 1.0, clamp(ez, 0, 1)) - introTilt + this.ppy * 0.035;
      const th = this.ppx * 0.07 + Math.sin(t * 0.13) * 0.025;
      cam.position.set(
        c.tx + Math.sin(phi) * Math.sin(th) * d,
        this.GY + Math.cos(phi) * d,
        c.tz + Math.sin(phi) * Math.cos(th) * d,
      );
      cam.lookAt(c.tx, this.GY, c.tz);
      cam.setViewOffset(this.W, this.H, -this.W * c.sx, -this.H * c.sy, this.W, this.H);
      this.scene.fog.near = d * 0.85;
      this.scene.fog.far = d * 2.4;
      if (this.full) this.style.touchAction = g.z > 0.02 ? "none" : "pan-y";

      /* survol */
      if (this.mouseDirty) {
        this.mouseDirty = false;
        const s = this.mouse ? this.pickAt(this.mouse.x, this.mouse.y) : null;
        if (s !== this.hov) {
          this.hov = s;
          this.cv.style.cursor = s ? "pointer" : this.full ? "grab" : "pointer";
        }
        if (s && this.mouse) {
          const f = info(s, this.data.regions);
          this.tip.innerHTML = `${shapeSVG(f.status, 12)}<span></span><em></em>`;
          this.tip.children[1].textContent = this.R[s].name;
          this.tip.children[2].textContent = this.full ? LBL[f.status] : "Explorer →";
          this.tip.style.transform = `translate(${this.mouse.x + 16}px,${this.mouse.y - 18}px)`;
          this.tip.style.opacity = 1;
        } else this.tip.style.opacity = 0;
      }

      /* régions : montée d'intro, survol, focus */
      const white = this._w || (this._w = new T.Color("#ffffff"));
      for (const s in this.R) {
        const r = this.R[s];
        const rise = it < 0 ? 0 : eo((it - (r.dist / 1150) * 0.9) / 0.9);
        r.hv = lerp(r.hv, this.hov === s ? 1 : 0, 1 - Math.exp(-dt * 10));
        r.dim = lerp(r.dim, this.sel && this.sel !== s ? 0.42 : 1, 1 - Math.exp(-dt * 4));
        r.lift = lerp(r.lift, (this.sel === s ? 14 : 0) + r.hv * 8, 1 - Math.exp(-dt * 6));
        r.mesh.scale.y = Math.max(0.002, rise);
        r.mesh.position.y = r.lift;
        r.top.color
          .copy(r.base)
          .multiplyScalar(r.dim)
          .lerp(white, r.hv * 0.16);
        if (r.st === "active")
          r.top.emissiveIntensity =
            (0.28 + 0.12 * Math.sin(t * 1.5)) * (it < 1.2 ? 0 : eo((it - 1.2) / 0.8)) * r.dim + 0.02;
        r.lines.forEach((l) => {
          l.material.opacity =
            (r.st === "later" ? 0.26 : 0.95) * rise * (this.sel === s ? 1 : r.dim) +
            (this.sel === s && r.st === "later" ? 0.5 : 0);
          if (this.sel === s && r.st === "later") l.material.color.set(C.orange);
          else if (r.st === "later") l.material.color.set(C.cream);
        });
      }

      /* marqueurs */
      if (this.pendingSel && it > 4.2) {
        const p = this.pendingSel;
        this.pendingSel = null;
        this.select(p);
      }
      if (it > 3.4 && this.nextPulse == null) {
        this.nextPulse = t;
      }
      if (this.nextPulse != null && t >= this.nextPulse) {
        this.pulseAt = t;
        this.nextPulse = t + 9;
        if (this.msgEl && it > 5) {
          this.msgI = (this.msgI + 1) % MSGS.length;
          const el = this.msgEl;
          el.style.opacity = 0;
          setTimeout(() => {
            el.textContent = MSGS[this.msgI];
            el.style.opacity = 1;
          }, 450);
        }
      }
      for (const s in this.M) {
        const m = this.M[s],
          nz = s === "nzi";
        m.appear = it < 0 ? 0 : eo((it - (nz ? 1.3 : 3.2)) / 0.7);
        m.hv = lerp(m.hv, this.hov === s || this.sel === s ? 1 : 0, 1 - Math.exp(-dt * 8));
        const a = m.appear,
          R = this.R[s];
        m.g.position.y = this.GY + R.depth * Math.max(0.002, R.mesh.scale.y) + 2 + R.lift;
        const zs = lerp(1, 0.55, clamp(ez, 0, 1)) * (1 + m.hv * 0.35);
        m.g.scale.setScalar(Math.max(0.001, a) * zs);
        m.core.scale.setScalar(1 + 0.12 * Math.sin(t * 2.2 + m.ph));
        m.halo.material.opacity = (0.55 + 0.2 * Math.sin(t * 1.6 + m.ph)) * a * (1 + m.hv * 0.6);
        m.halo.scale.setScalar(70 * (1 + 0.14 * Math.sin(t * 1.6 + m.ph)) * (1 + m.hv * 0.6));
        m.rings.forEach((rg, i) => {
          const p = (t * (nz ? 0.3 : 0.42) + i / 3 + m.ph) % 1;
          rg.scale.setScalar(1 + p * (nz ? 7 : 9));
          rg.material.opacity = Math.pow(1 - p, 2) * 0.5 * a;
        });
        if (!nz) {
          const bp = this.pulseAt == null ? 1 : clamp((t - this.pulseAt) / 2.4, 0, 1);
          m.big.scale.setScalar(1 + eo(bp) * 24);
          m.big.material.opacity = (1 - bp) * 0.85 * a;
          if (m.sw) {
            m.sw.material.uniforms.uTime.value = t;
            m.sw.material.uniforms.uA.value = a * (0.75 + m.hv * 0.25);
          }
        } else {
          m.big.material.opacity = 0;
        }
      }
      const ap = it < 0 ? 0 : eo((it - 1.9) / 1.4);
      this.arc.material.uniforms.uP.value = ap;
      this.arc.material.uniforms.uTime.value = t;
      this.arc.material.opacity = 1;
      const tp = (t * 0.16) % 1;
      this.curve.getPoint(tp, this.traveler.position);
      this.traveler.material.opacity = ap >= 0.999 ? Math.sin(tp * Math.PI) * 0.9 : 0;
      this.ground.material.uniforms.uTime.value = t;

      /* poussière */
      const P = this.dust.geometry.attributes.position,
        arr = P.array;
      for (let i = 0; i < this.pv.length; i++) {
        arr[i * 3 + 1] += this.pv[i] * dt * 22;
        arr[i * 3] += Math.sin(t * 0.4 + i) * dt * 3;
        if (arr[i * 3 + 1] > 600) arr[i * 3 + 1] = 40;
      }
      P.needsUpdate = true;
      this.dust.material.opacity = 0.32 * (it < 0 ? 0 : eo(it / 2));

      this.renderer.render(this.scene, cam);

      /* étiquettes : projection + anti-chevauchement */
      if (this.full && this.hud && it > 3.8 && !this.hud.classList.contains("on"))
        this.hud.classList.add("on");
      if (this.hint && it > 4.6 && !this._interacted && !this._hintShown) {
        this._hintShown = true;
        this.hint.style.opacity = 1;
        setTimeout(() => this.interacted(), 7000);
      }
      if ((this._lf = (this._lf || 0) + 1) % 2) return;
      const zR = this.full ? ss(0.2, 0.42, clamp(ez, 0, 1)) : 0;
      const items = this.L.map((L) => {
        let want, wpos;
        if (L.kind === "m") {
          const m = this.M[L.slug];
          want = ss(0.3, 1, m.appear);
          wpos = this.v3.copy(m.g.position).add({ x: 0, y: (m.H + 14) * m.g.scale.y, z: 0 });
        } else {
          const r = this.R[L.slug];
          want =
            Math.max(
              zR * (this.sel && this.sel !== L.slug ? 0.55 : 1),
              this.hov === L.slug && this.full ? 1 : 0,
              this.sel === L.slug ? 1 : 0,
            ) * (it > 2 ? 1 : 0);
          wpos = this.v3.set(r.c.x, this.GY + r.depth * r.mesh.scale.y + r.lift + 4, r.c.z);
        }
        const v = wpos.clone().project(cam);
        const x = (v.x * 0.5 + 0.5) * this.W,
          y = (-v.y * 0.5 + 0.5) * this.H;
        const pr = L.kind === "m" ? 3 : this.sel === L.slug ? 4 : this.hov === L.slug ? 2.5 : 1;
        return { L, want: v.z > 1 ? 0 : want, x, y, pr };
      }).sort((a, b) => b.pr - a.pr);
      const placed = [];
      for (const o of items) {
        const L = o.L;
        if (L.kind === "m" && L.e.offsetWidth) {
          L.w = L.e.offsetWidth;
          L.h = L.e.offsetHeight;
        }
        const bx =
          L.kind === "m"
            ? { x0: o.x - L.w / 2, x1: o.x + L.w / 2, y0: o.y - L.h - 8, y1: o.y }
            : { x0: o.x - L.w / 2, x1: o.x + L.w / 2, y0: o.y - L.h / 2, y1: o.y + L.h / 2 };
        let ok = o.want > 0.02 && bx.x1 > 0 && bx.x0 < this.W && bx.y1 > 0 && bx.y0 < this.H;
        if (ok)
          for (const p of placed)
            if (bx.x0 < p.x1 + 4 && bx.x1 > p.x0 - 4 && bx.y0 < p.y1 + 2 && bx.y1 > p.y0 - 2) {
              ok = false;
              break;
            }
        if (ok) placed.push(bx);
        L.o = lerp(L.o, ok ? o.want : 0, 0.35);
        L.e.style.opacity = L.o.toFixed(3);
        L.e.style.transform =
          L.kind === "m"
            ? `translate(${o.x}px,${o.y - 8}px) translate(-50%,-100%)`
            : `translate(${o.x}px,${o.y}px) translate(-50%,-50%)`;
        if (L.kind === "r") L.e.style.color = this.sel === L.slug ? C.orange : "";
      }
    }
  }
  customElements.define("afa-map3d", AfaMap3D);
}
