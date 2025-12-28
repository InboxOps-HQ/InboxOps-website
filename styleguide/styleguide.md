# InboxOps – Landing Page Style Guide

## Ziel der Landingpage

Die InboxOps Landingpage ist **ein Marketing- und Trust-Dokument**:
- erklärt in Sekunden, was InboxOps ist
- zeigt Klarheit & Professionalität (z. B. für Stripe-Verifizierung)
- führt zu einem klaren CTA (Beta / Kontakt)
- bleibt bewusst minimal, ohne “App-UI”-Komplexität

---

## Brand Essence (für die Website)

**Clean. Confident. Technical.**
Die Website soll wirken wie:
- modernes SaaS (seriös, nicht verspielt)
- technisch kompetent (ohne nerdig zu wirken)
- klar strukturiert (konvertiert schnell)

**Wichtig:** Für die Website darf mehr “Luft” genutzt werden als in der App.
Landingpage = Lesen & Vertrauen. App = Effizienz.

---

## Design-Prinzipien (Website)

1. **One Screen Value**: Above-the-fold muss “Was ist es + für wen + warum” erklären.
2. **Minimal UI, maximal Klarheit**: Keine visuellen Spielereien ohne Nutzen.
3. **Akzente sparsam**: Akzentfarben nur für CTA, Links, Highlights.
4. **Lesbarkeit zuerst**: Kontrast, Line-height, Section-Spacings.
5. **Trust zuerst**: Legal/Impressum/Privacy leicht erreichbar.

---

## Typography

### Headline Font – Space Grotesk
**Verwendung:** Hero-Headline, Section Titles, Buttons, Navigation  
**Ton:** modern, technisch, “SaaS-ready”

### Body Font – Inter
**Verwendung:** Fließtext, Feature-Descriptions, FAQ, Legal  
**Ton:** neutral, sehr lesbar

### Optional Mono – JetBrains Mono
**Verwendung:** nur wenn du “technical snippets” auf der Website zeigst (z. B. API/Webhook example).  
Sonst weglassen, damit es clean bleibt.

---

## Type Scale (Website)

- **H1 (Hero):** 36–48px, Weight 600–700, letter-spacing -0.5px
- **H2 (Sections):** 20–26px, Weight 600
- **H3 (Cards):** 15–18px, Weight 600
- **Body:** 14–18px, Weight 400–500
- **Meta/Notes:** 12–13px, muted

---

## Color System (Logo-matched)

Die Akzentfarben orientieren sich am **Logo-Verlauf (Blue → Cyan/Teal → Green)**.

### Core Accents (aus dem Logo)
- **Inbox Blue:** `#2567E1` (RGB 37,103,225)
- **Sky Blue:** `#289CE8` (RGB 40,156,232)
- **Cyan:** `#16C8D5` (RGB 22,200,213)
- **Teal:** `#0B9684` (RGB 11,150,132)
- **Green:** `#56CD64` (RGB 86,205,100)
- **Deep Green:** `#129E76` (RGB 18,158,118)

> Empfehlung: CTA-Gradient = **Inbox Blue → Cyan → Green**  
> Subtle Highlights = **Sky Blue** oder **Teal**

### Neutrals (Dark Website)
- **Background:** `#0B1220`
- **Surface:** `rgba(255,255,255,0.05)`
- **Border:** `rgba(255,255,255,0.14)`
- **Text Primary:** `rgba(255,255,255,0.92)`
- **Text Muted:** `rgba(255,255,255,0.70)`
- **Text Subtle:** `rgba(255,255,255,0.55)`

---

## Recommended CSS Tokens (Website)

```css
:root{
  --bg: #0B1220;
  --surface: rgba(255,255,255,.05);
  --surface-2: rgba(255,255,255,.07);
  --border: rgba(255,255,255,.14);

  --text: rgba(255,255,255,.92);
  --muted: rgba(255,255,255,.70);
  --muted2: rgba(255,255,255,.55);

  /* Logo accents */
  --blue:  #2567E1;
  --sky:   #289CE8;
  --cyan:  #16C8D5;
  --teal:  #0B9684;
  --green: #56CD64;
  --green2:#129E76;

  /* Primary marketing gradient */
  --accent-grad: linear-gradient(135deg, var(--blue), var(--cyan), var(--green));
}
````

---

## Components (Website)

### Primary CTA Button

* Background: `--accent-grad`
* Text: sehr dunkel (z. B. `#041018`) oder `rgba(0,0,0,0.85)`
* Hover: leichte brightness-Erhöhung (max 3%)

### Secondary Button

* background: `rgba(255,255,255,.06)`
* border: `--border`
* hover: `rgba(255,255,255,.10)`

### Cards / Panels

* Surface: `--surface`
* Border: `--border`
* Radius: 16–20px
* Shadow: weich, nicht “Material Design heavy”

### Links

* Default: `--sky` oder `--cyan`
* Hover: `--green`

### FAQ (Details)

* Pro `<details>` nur ein `<summary>`
* Summary enthält `<span data-lang="de">…</span>` und `<span data-lang="en">…</span>`
* Keine doppelte Summary, sonst leere Boxen in manchen Browsern

---

## Layout & Spacing (Website)

* Max width: **1100px**
* Section padding: **28–60px** je nach Bereich
* Hero: groß, aber nicht “Startup übertrieben”
* Mobile: single column, Buttons wrap

---

## Imagery & Backgrounds

* Hintergrund darf subtil “tech” wirken (radial gradients ok)
* Keine Stock-Fotos mit Menschen zwingend
* Wenn Bilder: eher UI mockups / clean abstract shapes
* Keine zu starken Noise-Overlays (wirkt billig)

---

## Motion (Website)

* Nur für Orientierung:

  * hover transitions
  * leichte fade/slide beim Scroll (optional)
* Dauer: 120–220ms
* Kein übermäßiges bouncing

---

## Tone of Voice (Website Copy)

* Kurz. Direkt. Ohne Buzzwords.
* Fokus: “Was bringt’s mir?”
* Kein künstliches “wir revolutionieren alles”
* CTA klar: “Beta anfragen”, “Email schreiben”

---

## Accessibility Basics

* Kontrast: Text auf dark surfaces >= WCAG AA (so gut wie möglich)
* Fokus-States: sichtbar (z. B. outline in `--sky`)
* Click targets: min. 40px Höhe (Buttons, Nav)


