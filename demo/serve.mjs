// Minimal static file server for the browser example: `npm run serve`
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

const root = process.cwd();
const port = 3000;
const contentTypes = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
};

const server = createServer(async (req, res) => {
	const pathname = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
	const path = pathname.endsWith("/") ? pathname + "index.html" : pathname;
	// the demo page lives in demo/; everything else (e.g. /dist/main.js) is repo-root relative
	const file = resolve(join(root, path === "/index.html" ? "demo/index.html" : path));
	if (file !== root && !file.startsWith(root + sep)) {
		res.writeHead(403);
		res.end("Forbidden");
		return;
	}
	try {
		const data = await readFile(file);
		res.writeHead(200, { "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream" });
		res.end(data);
	} catch {
		res.writeHead(404);
		res.end("Not found");
	}
});

server.listen(port, () => {
	console.log(`Serving at http://localhost:${port}/`);
});
