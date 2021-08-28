/**
 * Use Crockford's Base32 idea with zBase32 alphabet order with Damm checksum digit
 */ 
const SYMBOLS = 'YBNDRFG8EJKMCPQX0T1VW2SZA345H769'; // zrockford32
const VALID_SYMBOLS = new RegExp('^[' + SYMBOLS + ']+$');
let DECODE_TABLE: { [symbol: string]: number; } = {};
for (let i = 0; i < SYMBOLS.length; i++) {
    DECODE_TABLE[SYMBOLS[i]] = i;
}

/**
 * Magic numbers
 * 
 * `MAX_NUMBER` is a large number that is larger than any number we will 
 * ever encode and the largest number we can represent with our code
 * length and alphabet.
 * Given code_length (excluding check digit) = 7 and base = 32 (length 
 * of alphabet), the number of codes that it can encode is given by 
 * 2^(code_length * log2(base)) = 34 359 738 368
 * 
 * `COPRIME` is a number that has to be co-prime with `max_number`, it is
 * the number the input value is multiplied with (ie. the step between
 * successive integers). Any random integer is likely co-prime with `MAX_NUMBER`.
 * 
 * `MULINV` is the multiplicative inverse of `COPRIME` and `MAX_NUMBER`.
 */
export const MAX_NUMBER = BigInt('34359738368'); 
const COPRIME = BigInt('5777025351'); 
const MULINV = BigInt('1393193079');

/**
 * Encodes an integer using multiplicative inverses
 * 
 * @param n - a BigInteger
 * @returns a masked BigInteger 
 * 
 * @remarks
 * See:
 * - https://stackoverflow.com/questions/4273466/reversible-hash-function
 * - https://ericlippert.com/2013/11/14/a-practical-use-of-multiplicative-inverses/
 * - https://planetcalc.com/3311/
 */
function bitmask(n: bigint): bigint {
    return (n * COPRIME) % MAX_NUMBER;
}

/**
 * Decodes an integer using multiplicative inverses
 * 
 * @param h - a masked BigInteger
 * @returns a BigInteger
 * 
 */
function unbitmask(h: bigint): bigint {
    return (h * MULINV) % MAX_NUMBER;
}

/**
 * Calculates the Damm checksum for a Base32 encoded array of digits
 * 
 * @param digits - an array of digits
 * @returns checksum
 * 
 * @remarks
 * See:
 * - https://stackoverflow.com/questions/23431621/extending-the-damm-algorithm-to-base-32
 */
function damm32(digits: number[]): number {
    let checksum = 0;
    for (let i = 0; i < digits.length; i++) {
        let digit: number = digits[i];
        checksum ^= digit;
        checksum <<= 1;
        if (checksum >= 32) { checksum ^= 37; }
    }

    return checksum;
}

/**
 * Converts an array of digits to string
 * using alphabets YBNDRFG8EJKMCPQX0T1VW2SZA345H769
 * 
 * @param digits an Array of base 32 digits
 * @returns a string
 */
function toString(digits: number[]): string {
    let str = '';
    for (let i = 0; i < digits.length; i++) {
        str += SYMBOLS[digits[i]];
    }

    return str;
}

/**
 * Normalizes a Base32 string:
 * - Removes dashes (AA-BB -> AABB)
 * - Converts string to uppercase (a -> A)
 * - Converts ambigious characters (IiLlOo -> 111100)
 * 
 * The resulting string contains only digits from
 * YBNDRFG8EJKMCPQX0T1VW2SZA345H769
 * 
 * @param str input string
 * @returns a normalized string
 */
function normalize(str: string): string {
    let normStr = str.toUpperCase().replace(/-/g, '').replace(/[IL]/g, '1').replace(/O/g, '0');
    if (!VALID_SYMBOLS.test(normStr)) {
        throw Error("string '" + normStr + "' contains invalid characters");
    }

    return normStr;
}

/**
 * Convert an array of digits to BigInt
 * 
 * @param arr array of base 32 digits
 * @returns a BigInt
 */
function fromArray(arr: number[]): bigint {
    let n = BigInt(0);
    let pow = BigInt(1);
    let base = BigInt(32);
    for (let i = arr.length - 1; i >= 0; i--) {
        n += BigInt(arr[i]) * pow; 
        pow = pow * base;
    }

    return n;
}

/**
 * Convert a BigInteger to an array of Base32 integers
 * 
 * @param n a BigInt
 * @retunrns an array of integers in Base32
 */
function toArray(n: bigint): number[] {
    let ret: number[] = [];
    let base = BigInt(32);
    let left = n;

    while (left >= base) {
        let remainder = left % base;
        left = left / base;
        ret.push(Number(remainder)); 
    }
    ret.push(Number(left));

    return ret.reverse();
}

/**
 * Encodes a number to a code
 * 
 * @param n a number
 * @returns a string
 */
export function encode(n: number): string {
    if (n >= MAX_NUMBER) {
        throw RangeError("Number is too large");
    } else if (n <= 0) {
        throw RangeError("Number has to be a positive integer");
    }

    let digits = toArray(bitmask(BigInt(n)));

    while (digits.length < 5) {
        digits.unshift(0);
    }
    digits.push(damm32(digits));

    let code = toString(digits);
    
    return [code.slice(0,4), code.slice(4,8)].join("-");
}

/**
 * Decodes a string to a number
 * 
 * @param input an encoded string
 * @returns a number
 */
export function decode(input: string): number {
    let str = normalize(input);
    let digits: number[] = [];

    for (let i = 0; i < str.length; i++) {
        digits.push(DECODE_TABLE[str[i]]);
    }
    
    if (damm32(digits) != 0) {
        throw Error("invalid check value '" + SYMBOLS[digits[digits.length-1]] + "' for string '" +  str + "'");
    }

    digits.pop();
    let number = unbitmask(fromArray(digits));

    return Number(number);
}
