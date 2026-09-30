# Shareable Codes

Human-shareable codes: Crockford's Base32 idea with the zBase32 alphabet order and a Damm checksum digit. Ambiguous characters (`0/O`, `1/I/L`) are normalized on input, and a trailing check digit catches transcription errors. See <https://kalifi.org/2019/09/human-shareable-codes.html> for the reasoning.

## Install

```
npm install shareable-codes
```

## Usage

```ts
import { encode, decode } from "shareable-codes";

encode(123456);      // "DD7D-96YY"
decode("DD7D-96YY"); // 123456
decode("dd7d96yy");  // 123456 — case, dashes and I/L/O are normalized
```

Valid numbers are the positive integers below `MAX_NUMBER` (34 359 738 368). Codes are `XXXX-XXXX`; for very small masked values the code is shorter (e.g. `encode(1393193079)` → `"YYYY-BN"`).

## API

- **`encode(n: number): string`** — encodes a positive integer. Throws an `Error` if `n` is out of range.
- **`decode(input: string): number`** — decodes a code, ignoring case, dashes, and ambiguous characters. Throws `ChecksumError` (a subclass of `Error`) if the check digit does not match, and an `Error` if the string contains invalid characters.
- **`MAX_NUMBER`** — exclusive upper bound of the domain.
- **`ChecksumError`** — the one error worth catching: it means a human made a typo.

## Browser demo

The repo includes an encoder/decoder web demo:

```
npm run build
npm run serve
```

then open <http://localhost:3000/>. Works in any browser with `BigInt` support (Chrome 67+, Firefox 68+, Safari 14+).

## Development

Requires Node.js 20+ (developed on 24 LTS).

- `npm test` — test suite (Node's built-in test runner)
- `npm run typecheck` — TypeScript
- `npm run build` — library (`dist/`, JS + `.d.ts`) and demo bundle

## License

[MIT](LICENSE)
