// build.js -- Sunflower Offers
// Assembles dist/ from source HTML + _partials.
// Per SOP-WEB-BUILD: strips UTF-8 BOMs, writes UTF-8 without BOM.

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// SOP-mandated read function: strips UTF-8 BOM
function read(p) {
  const buf = fs.readFileSync(p);
  const start = (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) ? 3 : 0;
  return buf.slice(start).toString('utf8');
}

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8'); // Node writes UTF-8 without BOM
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// 1. Wipe dist/
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST);

// 2. Read partials
const header = read(path.join(ROOT, '_partials', 'header.html'));
const footer = read(path.join(ROOT, '_partials', 'footer.html'));

// 3. Build membership.html -> dist/membership/index.html
let page = read(path.join(ROOT, 'membership.html'));
page = page.replace('<!-- HEADER -->', header);
page = page.replace('<!-- FOOTER -->', footer);
write(path.join(DIST, 'membership', 'index.html'), page);

// 4. Stub root index that meta-refreshes to /membership/
//    (_redirects handles this server-side; this is a fallback.)
const stubIndex = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=/membership/">
<link rel="canonical" href="https://offers.sunflowerplumbing.com/membership/">
<title>Sunflower Plumbing Offers</title>
</head>
<body>
<p>Redirecting to <a href="/membership/">Sunflower Home Protection Plan</a>&hellip;</p>
</body>
</html>
`;
write(path.join(DIST, 'index.html'), stubIndex);

// 5. Copy asset folders
copyDir(path.join(ROOT, 'css'), path.join(DIST, 'css'));
copyDir(path.join(ROOT, 'js'),  path.join(DIST, 'js'));
copyDir(path.join(ROOT, 'images'), path.join(DIST, 'images'));

// 6. Copy required deploy-root files (per SOP)
const rootFiles = ['robots.txt', 'sitemap.xml', '_worker.js', '_routes.json', '_redirects'];
for (const f of rootFiles) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, f));
  } else {
    console.warn(`WARN: ${f} not found at site root -- skipping`);
  }
}

// 7. Encoding diagnostic per SOP
const filesToCheck = [
  path.join(DIST, 'membership', 'index.html'),
  path.join(DIST, 'index.html'),
  path.join(DIST, 'css', 'styles.css'),
  path.join(DIST, 'js', 'main.js'),
];
let problems = 0;
for (const f of filesToCheck) {
  if (!fs.existsSync(f)) continue;
  const c = fs.readFileSync(f).toString('utf8');
  const boms = (c.match(/\uFEFF/g) || []).length;
  const repl = (c.match(/\uFFFD/g) || []).length;
  if (boms || repl) {
    console.error(`FAIL: ${f}  BOMs=${boms}  Replacement=${repl}`);
    problems++;
  } else {
    console.log(`OK:   ${path.relative(ROOT, f)}`);
  }
}

if (problems > 0) {
  console.error(`\nBuild completed with ${problems} encoding problem(s). Do NOT deploy.`);
  process.exit(1);
}
console.log('\nBuild OK. Deploy ./dist');
