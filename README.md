# Soul Activism

Website for **Soul Activism** (www.soulactivism.com): Akashic Records readings, the Psychic Development Course, and Soul Sync intuitive business consulting with Zan Dean in Asheville, NC.

A static, hand-authored HTML/CSS rebuild of the original Wix Studio site, hosted on GitHub Pages. No build step and no Wix scripts.

## Structure

The URLs match the old Wix site, so existing links and search results keep working.

```
index.html                      Home
about/                          About Zan Dean, certifications, FAQ
course/                         Psychic Development Course (eight weeks) + curriculum
offerings/                      All services
consult/                        Soul Sync intuitive business consulting
connect/                        Contact form
blog/                           Post index
post/<slug>/                    Blog posts
service-page/<slug>/            Service detail pages (start-here-… redirects to soul-activism)
policies-and-terms/             Disclaimer, refund, accessibility, terms, privacy (anchor links)
404.html                        Not-found page
css/style.css                   All styles (palette + fonts at the top)
js/main.js                      Mobile menu + contact form mailto fallback
images/                         Site images (WebP)
CNAME                           www.soulactivism.com
.nojekyll                       Serve files as-is
```

Pages use relative links (`../css/style.css`), so the site works both at www.soulactivism.com and at the GitHub preview address (sibyldigital.github.io/soul-activism/). Only `404.html` uses root-relative links, since GitHub serves it at any path.

## Design

- **Sections:** misty violet forest heroes with torn-paper collage titles, then alternating lavender (`#c8bfd6`), white, deep plum (`#44345b`) and dark violet (`#221a2e`) bands. Rose (`#cb5956`) is used for buttons.
- **Type:** Questrial for headings, Sora Light for body text, and Mrs Saint Delafield for the script titles.
- **Paper titles:** `.paper-title` places text over a collage image (`--paper`, `--ar`). The text column width (`--inner`) and nudge (`--shift`) are set per image.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy

1. Repo Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
2. Settings → Pages → Custom domain: `www.soulactivism.com` (the `CNAME` file is already here; the bare domain redirects to www).
3. At the DNS host for soulactivism.com:
   - Apex: four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www`: `CNAME` → `sibyldigital.github.io`
4. Tick "Enforce HTTPS" once the certificate is issued.

## Notes

- **Pricing:** all readings are $200 (Soul Activism AR Reading, Soul Relationships). The Psychic Development Course is $600 and currently marked Ended.
- **Booking:** each service's "Book Now" opens an email to info@soulactivism.com with the service name in the subject. Swap in a scheduler link (Calendly, Square, Acuity, PayPal) when ready.
- **Contact form:** opens the visitor's mail client. For direct inbox delivery, set the form's `action` to a form backend (Formspree, Basin) in `connect/index.html`.
- **Policies:** the business is named Soul Activism throughout, and a cancellation less than 48 hours before a session forfeits 100% of the fee. Crisis resources list the 988 Suicide & Crisis Lifeline.
