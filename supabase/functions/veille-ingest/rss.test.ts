import { describe, expect, it } from "vitest";
import { cropsIn, isAgricultural, makeExcerpt, matchesKeyword, parseFeed, toPlainText } from "./rss";

const rss = `<?xml version="1.0"?><rss><channel><title>Exemple</title>
<item><title>Côte d&#8217;Ivoire : l&rsquo;attiéké &amp; le manioc</title><link>https://exemple.ci/manioc</link>
<pubDate>Wed, 25 Nov 2026 10:00:00 +0000</pubDate>
<description><![CDATA[<p>Les productrices de <strong>manioc</strong> du N'Zi…</p><p>L’article Titre est apparu en premier sur Site.</p>]]></description></item>
<item><title>Sans date</title><link>https://exemple.ci/x</link></item>
<item><title>Lien invalide</title><link>javascript:alert(1)</link><pubDate>Wed, 25 Nov 2026 10:00:00 +0000</pubDate></item>
</channel></rss>`;

const atom = `<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Riz : nouvelle variété</title>
<link rel="alternate" href="https://exemple.ci/riz"/><updated>2026-11-20T08:00:00Z</updated><summary>Résumé</summary></entry></feed>`;

describe("lecture des flux", () => {
  it("RSS : titre décodé, lien, date, extrait sans HTML ni mention de fin WordPress", () => {
    const items = parseFeed(rss);
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Côte d’Ivoire : l’attiéké & le manioc");
    expect(items[0].url).toBe("https://exemple.ci/manioc");
    expect(items[0].publishedAt.toISOString()).toBe("2026-11-25T10:00:00.000Z");
    expect(items[0].excerpt).toBe("Les productrices de manioc du N'Zi…");
  });
  it("ignore les éléments sans date ou avec un lien non web", () => {
    expect(parseFeed(rss).map((i) => i.title)).not.toContain("Lien invalide");
  });
  it("Atom", () => {
    expect(parseFeed(atom)[0]).toMatchObject({ title: "Riz : nouvelle variété", url: "https://exemple.ci/riz" });
  });
  it("extrait court coupé sur une fin de mot", () => {
    const e = makeExcerpt("mot ".repeat(200));
    expect(e.length).toBeLessThanOrEqual(281);
    expect(e.endsWith("mot…")).toBe(true);
  });
  it("texte brut", () => {
    expect(toPlainText("<b>a&nbsp;b</b>  c")).toBe("a b c");
  });
});

describe("mots-clés", () => {
  it("« maïs » ne trouve pas la conjonction « mais »", () => {
    expect(matchesKeyword("Il pleut, mais la récolte avance", "maïs")).toBe(false);
    expect(matchesKeyword("La culture du maïs progresse", "maïs")).toBe(true);
  });
  it("mot entier : « gari » ne trouve pas « garantie », « riz » ne trouve pas « horizon »", () => {
    expect(matchesKeyword("Une garantie bancaire", "gari")).toBe(false);
    expect(matchesKeyword("À l'horizon 2030", "riz")).toBe(false);
    expect(matchesKeyword("Le gari et le riz", "gari")).toBe(true);
  });
  it("préfixe : « manioc* » trouve « maniocs », sans tenir compte des accents", () => {
    expect(matchesKeyword("Les MANIOCS de Bouaké", "manioc*")).toBe(true);
    expect(matchesKeyword("L'Attiéké de Dabou", "attieke")).toBe(true);
  });
  it("cultures citées et filtre agricole", () => {
    const crops = [
      { id: "manioc", keywords: ["manioc*", "attieke"] },
      { id: "mais", keywords: ["maïs"] },
    ];
    expect(cropsIn("L'attiéké, mais aussi le maïs", crops)).toEqual(["manioc", "mais"]);
    expect(isAgricultural("Miss Univers 2026", [])).toBe(false);
    expect(isAgricultural("Les coopératives agricoles du Poro", [])).toBe(true);
  });
});
