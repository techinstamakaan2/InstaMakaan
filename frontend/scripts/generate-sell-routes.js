/**
 * Prebuild script — auto-generates public/site-routes.json
 * by scanning src/App.js for every static public route.
 *
 * Runs automatically before every `npm run build` via the
 * "prebuild" hook in package.json. No manual steps needed.
 *
 * Excluded automatically:
 *   - Dynamic routes  (:id, :slug, :token, *)
 *   - Protected routes (/admin, /auth, /owner, /agent, /user, /dashboard)
 */

const fs   = require('fs');
const path = require('path');

const APP_JS   = path.join(__dirname, '../src/App.js');
const OUT_FILE = path.join(__dirname, '../public/site-routes.json');

// Priority + changefreq rules — matched in order, first match wins
const RULES = [
  { match: /^\/$/, priority: '1.0', changefreq: 'daily' },

  { match: /^\/(all-properties|rent)$/, priority: '0.9', changefreq: 'daily' },

  { match: /^\/sell-companies\//, priority: '0.8', changefreq: 'monthly' },
  { match: /^\/blog$/,            priority: '0.8', changefreq: 'daily'   },
  { match: /^\/reviews$/,         priority: '0.8', changefreq: 'weekly'  },

  { match: /^\/(rent\/)/, priority: '0.7', changefreq: 'daily'   },
  { match: /^\/(about|contact|faq)$/, priority: '0.7', changefreq: 'monthly' },

  { match: /^\/(partner|refer)$/, priority: '0.6', changefreq: 'monthly' },

  { match: /^\/(privacy-policy|terms)$/, priority: '0.4', changefreq: 'yearly' },
];

const DEFAULT = { priority: '0.6', changefreq: 'monthly' };

// Routes to always skip (protected / dynamic / irrelevant)
const SKIP = [
  /\/admin/, /\/auth/, /\/owner/, /\/agent/, /\/user/, /\/dashboard/,
  /:\w+/,    // any dynamic segment like :id :slug :token
  /\*/,      // wildcard (404)
];

function getRules(route) {
  for (const rule of RULES) {
    if (rule.match.test(route)) {
      return { priority: rule.priority, changefreq: rule.changefreq };
    }
  }
  return DEFAULT;
}

const source = fs.readFileSync(APP_JS, 'utf8');

// Extract every path="..." value from App.js
const all = [...source.matchAll(/path="([^"]+)"/g)].map(m => m[1]);

const routes = all
  .filter(r => r.startsWith('/'))      // only top-level absolute paths
  .filter(r => !SKIP.some(pattern => pattern.test(r)))
  .filter(r => !r.includes(':'))       // double-check no dynamic segments
  .map(r => {
    const { priority, changefreq } = getRules(r);
    return { path: r, priority, changefreq };
  });

// Deduplicate by path
const seen = new Set();
const unique = routes.filter(r => {
  if (seen.has(r.path)) return false;
  seen.add(r.path);
  return true;
});

const output = {
  routes: unique,
  generatedAt: new Date().toISOString(),
  count: unique.length,
};

fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));

console.log(`[generate-routes] ${unique.length} static routes written to site-routes.json:`);
unique.forEach(r => console.log(`  ${r.priority}  ${r.path}`));
