#!/usr/bin/env node
// Fun little CLI: `npx shareable-codes encode 123456`
import { createRequire } from "node:module";
import { parseArgs } from "node:util";

const require = createRequire(import.meta.url);
const { version, description } = require("./package.json");

const usage = `shareable-codes — ${description}

Usage: shareable-codes [encode|decode] <value>

Encode a positive integer to a human-shareable code, or decode a code back.
With no subcommand, all-digit input is encoded and anything else decoded.

Examples:
  shareable-codes encode 123456      # DD7D-96YY
  shareable-codes decode DD7D-96YY   # 123456
  shareable-codes 123456             # DD7D-96YY (auto-detected as encode)

Options:
  -h, --help       show this help
  -v, --version    print version`;

let library;
try {
	library = await import("shareable-codes");
} catch {
	console.error("Could not load the library. When working from a checkout, run `npm run build` first.");
	process.exit(1);
}
const { encode, decode, ChecksumError, MAX_NUMBER } = library;

let values, positionals;
try {
	({ values, positionals } = parseArgs({
		options: {
			help: { type: "boolean", short: "h" },
			version: { type: "boolean", short: "v" },
		},
		allowPositionals: true,
	}));
} catch (error) {
	console.error(`${error.message}\n\n${usage}`);
	process.exit(1);
}

if (values.help) {
	console.log(usage);
	process.exit(0);
}
if (values.version) {
	console.log(version);
	process.exit(0);
}

const [first, second] = positionals;
let mode, value;
if (positionals.length === 1) {
	mode = /^\d+$/.test(first) ? "encode" : "decode";
	value = first;
} else if (positionals.length === 2 && (first === "encode" || first === "decode")) {
	mode = first;
	value = second;
} else {
	console.error(`${usage}`);
	process.exit(1);
}

if (mode === "encode") {
	if (!/^\d+$/.test(value)) {
		console.error(`encode expects a positive integer, got '${value}'`);
		process.exit(1);
	}
	try {
		console.log(encode(Number(value)));
	} catch (error) {
		console.error(`${value} is out of range: encode accepts 1 - ${Number(MAX_NUMBER) - 1}`);
		process.exit(1);
	}
} else {
	try {
		// String(): a bare number would be ANSI-colorized by util.inspect
		// when a color-forcing env var (e.g. FORCE_COLOR) is set
		console.log(String(decode(value)));
	} catch (error) {
		if (error instanceof ChecksumError) {
			console.error(`'${value}' failed the checksum — probably a typo?`);
		} else {
			console.error(error.message);
		}
		process.exit(1);
	}
}
