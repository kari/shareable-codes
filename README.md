# Shareable Codes

Use Crockford's Base32 idea with zBase32 alphabet order with Damm checksum digit. See <https://kalifi.org/2019/09/human-shareable-codes.html> for more information.

## How to run

Requires Node.js (24 LTS) installed. [esbuild](https://esbuild.github.io/) is the only dependency, used for bundling the browser example.

1. run the tests: `npm test`
2. build the browser demo: `npm run build`
3. serve the example: `npm run serve`
4. open browser at <http://localhost:3000/>
