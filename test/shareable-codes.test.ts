import { encode, decode } from "../src/shareable-codes";

describe('Encoder', () => {

    it('encodes 123456 to DD7D-96YY', () => {
        let result = encode(123456);
        expect(result).toBe("DD7D-96YY");
    })

    it('throws on too large value', () => {
        expect(() => {
            encode(34359738368);
          }).toThrow();
    })

    it('handles close to max value', () => {
        expect(encode(34359738368-1)).toHaveLength(9);
    })

    it('throws on invalid input', () => {
        expect(() => {
            encode(0);
        }).toThrow();
        expect(() => {
            encode(-1);
        }).toThrow();
    })


});

describe('Decoder', () => {
    it('decodes DD7D-96YY to 123456', () => {
        let result = decode('DD7D-96YY');
        expect(result).toBe(123456);
    })

    it('decodes to encoded value', () => {
        expect(decode(encode(123456))).toBe(123456);
        expect(decode(encode(1))).toBe(1);
        expect(decode(encode(34359738368-1))).toBe(34359738368-1);
    })

    it('handles lowercase and dashless input', () => {
        expect(decode('dd7d96yy')).toBe(123456);
    })

    it('handles ambigious characters', () => {
        expect(decode('6IYE-EOF4')).toBe(83);
        expect(decode('6lYE-EoF4')).toBe(83);
    })

    it('throws on checksum fail', () => {
        expect(() => {
            decode('DD7D-96YX')
          }).toThrow();
    })

    it('throws on invalid input', () => {
        expect(() => {
            decode('AOE0UI')
          }).toThrow();
          expect(() => {
            decode('')
          }).toThrow();
    })

});

