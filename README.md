# Shareable Codes

Use Crockford's Base32 idea with zBase32 alphabet order with Damm checksum digit.

## How to run

If you have `npm` installed just run `npm run serve` and the javascript version is available at http://localhost:9090/

If you have Docker installed, you can build and run the image instead

1. docker build -t shareable-codes .
2. docker run -p 9090:9090 shareable-codes
3. open browser at http://localhost:9090/
