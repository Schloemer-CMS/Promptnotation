# Semantik‑Anker (sa::) — Norm v0.9 (Draft)

**Status:** Draft v0.9 • **Lizenz:** CC BY 4.0 • **Maintainer:** Joost Schloemer (Proponent) • **Kurzbezeichnung:** *sa::*

## 1. Zweck und Geltungsbereich
Ein **Semantik‑Anker** (sa::) ist eine **geordnet‑deterministische Bedeutungs­kette** aus Segmenten. Die Kette bindet eine Entität an Facette/Funktion, Kontext, Intention/Ziel und erwartete Wirkung. **Die Reihenfolge ist bedeutungstragend.**  
In‑Scope: KI/LLM‑Prompting, SEO/SGE, Wissensgraphen, Content‑Architektur, Compliance‑Dokumentation. Out‑of‑Scope v0.9: automatische Ontologie‑Ableitung, Synonymerkennung, Morphologie.

## 2. Begriffe
- **Kette (Chain):** Folge von Segmenten, getrennt durch „::“.
- **Segment:** Atomarer Bedeutungsbaustein (ASCII, lowercase).
- **Strict Mode:** Minimale, robuste Norm; **Extended Mode:** optionale Erweiterungen (Umlaut‑Escapes u. ä.).
- **Normalisierung:** Technische Vereinheitlichung (Lowercasing, Trimmen), ohne inhaltliche Synonymisierung.

## 3. Syntax (normativ)
- **Form:** `segment(::segment)+`
- **Segment (Strict Mode):** Zeichensatz `a–z 0–9 - _ / #` (ASCII, lowercase).
- **Längenempfehlung:** Segmente ≤ 32 Zeichen; Kettenlänge 3–6 Segmente.
- **Empfohlene Slot‑Logik (informativ):** `Entität :: Facette/Funktion :: Kontext :: Ziel/Intention :: Wirkung`

**EBNF (Strict Mode):**
```
ANCHOR  := CHAIN ;
CHAIN   := SEGMENT { "::" SEGMENT } ;
SEGMENT := ALNUM { ALNUM | "-" | "_" | "/" | "#" } ;
ALNUM   := "a"…"z" | "0"…"9" ;
```
**Regex (Strict Mode):**
```
^[a-z0-9][a-z0-9-_\/#]*(::[a-z0-9][a-z0-9-_\/#]*)+$
```

## 4. Verarbeitungsregeln (normativ)
1. **Link‑nach‑rechts‑Spezifizierung:** Jedes folgende Segment verengt den Bedeutungsraum des vorherigen.
2. **Ordnungspflicht:** Vertauschen von Segmenten ändert die Bedeutung.
3. **Stabilität:** Dieselbe Kette MUSS versionstreu dieselbe Bedeutung transportieren.
4. **Normalisierung:** Parser MÜSSEN Lowercasing und Trimmen durchführen; automatisches Synonym‑Mapping ist NICHT zulässig.
5. **Sprachregel:** Pro Kette EIN Sprache‑Kontext (z. B. de oder en).

## 5. Serialisierung (JSON‑LD, informativ)
```json
{
  "@context": {"sa":"https://example.org/sa#"},
  "@type": "sa:Anchor",
  "sa:chain": ["verein","datenschutz","hinweisgebersystem","vertrauen"],
  "sa:lang": "de",
  "sa:version": "0.9"
}
```
**HTML‑Attribut (Crawl‑Hinweis):**
```html
<article data-sa="verein::datenschutz::hinweisgebersystem::vertrauen">…</article>
```

## 6. Konformität
- **sa:: Strict‑konform:** erfüllt Regex, keine leeren/duplizierten Trennzeichen, 3–6 Segmente.
- **sa:: Extended‑konform:** Strict + optionale Escapes (z. B. `ä -> ae`). Extended MUSS nach Strict normalisierbar sein.

## 7. Beispiele (gültig)
- `verein::datenschutz::hinweisgebersystem::vertrauen`
- `pv-projekt::flächenpacht::due-diligence::genehmigung`
- `vereinsplattform::onboarding::moderation::risiko-reduktion`

**Gegenbeispiele**
- `verein::::datenschutz` (leeres Segment)
- `Verein::DatenSchutz` (Case‑Mix, nicht normalisiert)
- `allgemein::thema::misc` (unkonkret)

## 8. Sicherheit & Datenschutz (informativ)
- **Privacy:** Ketten KÖNNEN sensible Begriffe enthalten; Betreiber SOLLTEN Klassifikationen für Export/Logging vorsehen.
- **Security:** Validatoren SOLLTEN Input‑Längen und Zeichensätze strikt prüfen (ReDoS/Injection vermeiden).

## 9. Versionierung & Governance
- **SemVer:** v0.9 (Draft) → v1.0 (Stabil nach RFC‑Phase).
- **Artefakte:** Spezifikation (dieses Dokument), Beispiele, Parser (JS/Python), Validator (CLI), Changelog.
- **Änderungsprozess:** Öffentliche RFC‑Issues, Review durch Maintainer‑Team (1 Editor, 2 Reviewer).

## 10. Zitierweise
> Schloemer, J. (2025): Semantik‑Anker (sa::) — Norm v0.9 (Draft). CC BY 4.0. DOI: _wird bei Release hinterlegt_.

---
**Changelog:** v0.9 (Draft, 2025‑08‑20): Erstveröffentlichung.
