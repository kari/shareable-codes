import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { encode, decode } from "../src/shareable-codes.ts";

describe('Encoder', () => {

    it('encodes 123456 to DD7D-96YY', () => {
        const result = encode(123456);
        assert.equal(result, "DD7D-96YY");
    })

    it('throws on too large value', () => {
        assert.throws(() => {
            encode(34359738368);
        })
    })

    it('handles close to max value', () => {
        const result = encode(34359738368-1);
        assert.equal(result.length, 9);
    })

    it('throws on invalid input', () => {
        assert.throws(() => {
            encode(0);
        });
        assert.throws(() => {
            encode(-1);
        });
    })


});

describe('Decoder', () => {
    it('decodes DD7D-96YY to 123456', () => {
        const result = decode('DD7D-96YY');
        assert.equal(result, 123456);
    })

    it('decodes to encoded value', () => {
        assert.equal(decode(encode(123456)), 123456);
        assert.equal(decode(encode(1)), 1);
        assert.equal(decode(encode(34359738368-1)), 34359738368-1);
    })

    it('handles lowercase and dashless input', () => {
        assert.equal(decode('dd7d96yy'), 123456);
    })

    it('handles ambigious characters', () => {
        assert.equal(decode('6IYE-EOF4'), 83);
        assert.equal(decode('6lYE-EoF4'), 83);
    })

    it('throws on checksum fail', () => {
        assert.throws(() => {
            decode('DD7D-96YX')
        })
    })

    it('throws on invalid input', () => {
        assert.throws(() => {
            decode('AOE0UI')
        });
        assert.throws(() => {
            decode('')
        });
    })

});
