import { encode, decode } from "../src/shareable-codes.ts"
import { assertEquals, assertThrows } from "https://deno.land/std@0.106.0/testing/asserts.ts";

Deno.test('encodes 123456 to DD7D-96YY', () => {
    assertEquals(encode(123456), "DD7D-96YY");
});
Deno.test('throws on too large value', () => {
    assertThrows(() => {
        encode(34359738368);
    });
});    

Deno.test('handles close to max value', () => {
    assertEquals(encode(34359738368-1).length, 9);
});

Deno.test('throws on invalid input', () => {
    assertThrows(() => {
        encode(0);
    });
    assertThrows(() => {
        encode(-1);
    });
});

Deno.test('decodes DD7D-96YY to 123456', () => {
    assertEquals(decode('DD7D-96YY'), 123456);
});

Deno.test('decodes to encoded value', () => {
    assertEquals(decode(encode(123456)), 123456);
    assertEquals(decode(encode(1)), 1);
    assertEquals(decode(encode(34359738368-1)), 34359738368-1);
})

Deno.test('handles lowercase and dashless input', () => {
    assertEquals(decode('dd7d96yy'),123456);
})

Deno.test('handles ambigious characters', () => {
    assertEquals(decode('6IYE-EOF4'), 83);
    assertEquals(decode('6lYE-EoF4'), 83);
})

Deno.test('throws on checksum fail', () => {
    assertThrows(() => {
        decode('DD7D-96YX');
    });
});

Deno.test('throws on invalid input', () => {
    assertThrows(() => {
        decode('AOE0UI');
    });
    assertThrows(() => {
        decode('');
    });
});
