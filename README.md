# Shareable Codes

Use Crockford's Base32 idea with zBase32 alphabet order with Damm checksum digit. See https://kalifi.org/2019/09/human-shareable-codes.html for more information.

## How to run

If you have `deno` installed, build the code and use [`file_server`](https://deno.land/manual/examples/file_server) to serve the example.

1. run `./build.sh` to build and bundle the code to `dist/`
2. `deno install --allow-net --allow-read https://deno.land/std/http/file_server.ts`
3. `file_server .`
4. open browser at http://localhost:4507/
