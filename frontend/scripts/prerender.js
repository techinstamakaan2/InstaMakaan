const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const mimeTypes = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
	'.woff': 'font/woff',
	'.ttf': 'font/ttf',
};

function startServer(buildDir, port = 45678) {
	return new Promise((resolve) => {
		const server = http.createServer((req, res) => {
			let reqPath = decodeURI(req.url.split('?')[0]);
			let filePath = path.join(buildDir, reqPath);

			if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
				const potentialHtml = path.join(filePath, 'index.html');
				if (fs.existsSync(potentialHtml)) {
					filePath = potentialHtml;
				} else {
					filePath = path.join(buildDir, 'index.html');
				}
			}

			const ext = path.extname(filePath).toLowerCase();
			const contentType = mimeTypes[ext] || 'application/octet-stream';

			fs.readFile(filePath, (err, content) => {
				if (err) {
					res.writeHead(500);
					res.end('Error loading file');
				} else {
					res.writeHead(200, { 'Content-Type': contentType });
					res.end(content, 'utf-8');
				}
			});
		});

		server.listen(port, () => resolve(server));
	});
}

async function prerender() {
	const buildDir = path.join(__dirname, '../build');
	const routesFile = path.join(__dirname, '../public/site-routes.json');

	if (!fs.existsSync(buildDir)) {
		console.error('[prerender] Build directory not found. Please run build first.');
		process.exit(1);
	}

	let routes = ['/'];
	if (fs.existsSync(routesFile)) {
		try {
			const routesData = JSON.parse(fs.readFileSync(routesFile, 'utf8'));
			if (Array.isArray(routesData.routes)) {
				routes = routesData.routes.map((r) => r.path);
			}
		} catch (e) {
			console.warn('[prerender] Could not read site-routes.json, using default routes.');
		}
	}

	console.log(`[prerender] Starting pre-render for ${routes.length} static routes on port 45678...`);
	const server = await startServer(buildDir, 45678);

	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--autoplay-policy=user-gesture-required',
			'--disable-gpu',
			'--disable-dev-shm-usage',
		],
	});

	for (let i = 0; i < routes.length; i++) {
		const route = routes[i];
		try {
			const page = await browser.newPage();
			await page.setUserAgent('ReactSnap');
			await page.setViewport({ width: 1280, height: 800 });

			const pageUrl = `http://localhost:45678${route}`;
			try {
				await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 10000 });
			} catch (_) {
				// Fallback if background assets continue to poll
				try {
					await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });
				} catch (navErr) {
					// Proceed with available DOM
				}
			}

			// Allow React DOM & react-helmet-async to commit head tags
			await new Promise((r) => setTimeout(r, 600));

			const html = await page.content();
			await page.close();

			const outDir = route === '/' ? buildDir : path.join(buildDir, route);
			if (!fs.existsSync(outDir)) {
				fs.mkdirSync(outDir, { recursive: true });
			}

			fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
			console.log(`[prerender] (${i + 1}/${routes.length}) Pre-rendered ${route}`);
		} catch (err) {
			console.warn(`[prerender] Warning on ${route}:`, err.message);
		}
	}

	await browser.close();
	server.close();
	console.log('[prerender] All routes pre-rendered successfully!');
}

prerender().catch((err) => {
	console.error('[prerender] Fatal error:', err);
	process.exit(1);
});
