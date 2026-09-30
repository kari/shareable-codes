import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const cli = fileURLToPath(new URL("../cli.js", import.meta.url));
const built = existsSync(new URL("../dist/shareable-codes.js", import.meta.url));

describe('CLI', { skip: built ? false : 'library is not built — run npm run build first' }, () => {

    it('encodes a number', async () => {
        const { stdout } = await run(process.execPath, [cli, 'encode', '123456']);
        assert.equal(stdout.trim(), 'DD7D-96YY');
    })

    it('decodes a code', async () => {
        const { stdout } = await run(process.execPath, [cli, 'decode', 'dd7d96yy']);
        assert.equal(stdout.trim(), '123456');
    })

    it('auto-detects all-digit input as encode', async () => {
        const { stdout } = await run(process.execPath, [cli, '123456']);
        assert.equal(stdout.trim(), 'DD7D-96YY');
    })

    it('exits 1 on a checksum typo', async () => {
        await assert.rejects(run(process.execPath, [cli, 'decode', 'DD7D-96YX']), { code: 1 });
    })

    it('exits 1 on out of range encode', async () => {
        await assert.rejects(run(process.execPath, [cli, 'encode', '0']), { code: 1 });
    })

    it('prints version', async () => {
        const { stdout } = await run(process.execPath, [cli, '--version']);
        assert.match(stdout, /^\d+\.\d+\.\d+/);
    })

});
