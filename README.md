# Sunflower Offers - Home Protection Plan landing site

Subdomain landing site for Sunflower Plumbing's Home Protection Plan offer.
Lives at `offers.sunflowerplumbing.com/membership/`.

## Structure (SOP-WEB-BUILD partials pattern)

```
sunflower-offers/
  _partials/
    header.html       <- utility bar + sticky site header
    footer.html       <- footer CTA band + site footer
  membership.html     <- source page (body), uses <!-- HEADER --> / <!-- FOOTER --> placeholders
  build.js            <- partials assembler, BOM-stripping, encoding-safe
  css/styles.css
  js/main.js
  images/
    hero-home.jpg     <- TYLER PROVIDES (2400x1400, golden-hour Kansas Craftsman home)
    logo.png          <- AGENT LOCALIZES from sunflowerplumbing.com (logo-1.png)
    team.jpg          <- AGENT LOCALIZES (used in trust section)
  robots.txt
  sitemap.xml
  _worker.js          <- pages.dev crawler block (SOP-mandated)
  _routes.json        <- routes /robots.txt to the worker
  _redirects          <- root / -> /membership/
  .gitignore
  dist/               <- build output (gitignored)
```

## Build

```bash
node build.js
```

Output: `dist/`. Deploy `dist/` to Cloudflare Pages per SOP-WEB-BUILD.

The build script:
- Strips UTF-8 BOMs on read (per SOP encoding standard)
- Writes UTF-8 without BOM via Node fs (never PowerShell)
- Runs encoding diagnostic at the end - fails build if BOMs or replacement chars detected

## Images to localize

The agent must download these and place in `images/`:

1. **Logo** -- `https://www.sunflowerplumbing.com/wp-content/uploads/2024/04/logo-1.png`
   Save as `images/logo.png`. Already referenced everywhere as `images/logo.png`.

2. **Team photo** -- used in the trust section. The original artifact pointed at a
   guessed URL (`sunflower-team.jpg`) that may not exist. Options:
   - Check sunflowerplumbing.com for an actual team photo and download it
   - If none exists, ask Tyler for a photo
   - Until then, the trust section will render with a broken image -- has an
     `onerror` handler that converts to a grey placeholder so it doesn't crash

3. **Hero photo** -- `images/hero-home.jpg`. Tyler is generating separately and
   will hand off. 2400x1400, photorealistic Kansas Craftsman home, golden hour,
   home positioned right-of-center for the diagonal clip-path crop.

## Deployment

Follow SOP-WEB-BUILD standard deploy flow:
1. `node build.js`
2. Verify build output (encoding diagnostic must pass)
3. `git add . && git commit && git push origin main`
4. `npx wrangler pages deploy ./dist --project-name sunflower-offers --branch main`
5. Verify pages.dev URL returns 200
6. Attach `offers.sunflowerplumbing.com` custom domain
7. Update `sites.json` with `lastPublished`

## Form endpoint

`js/main.js` has a `// TODO: WIRE TO GHL FORM ENDPOINT` block. The form currently
shows an alert and logs to console. Replace with a fetch() to the GHL webhook
once Tyler provides it.

## Links to the main site

All header nav links and most footer links point to `https://www.sunflowerplumbing.com/`.
This page is intentionally a satellite -- it shares brand/header/footer with the
main site but doesn't try to be the whole site.
