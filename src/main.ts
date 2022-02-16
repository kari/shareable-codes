import { decode, encode, MAX_NUMBER } from './shareable-codes.ts';

const inputEncode = <HTMLInputElement>document.getElementById("inputEncode")!;
const inputDecode = <HTMLInputElement>document.getElementById("inputDecode")!;

function encodeInput() {
    const input = Number(inputEncode.value);
    let result;
    if (input < 1 || input >= MAX_NUMBER) {
        inputEncode.className = "form-control is-invalid";
        inputDecode.value = "";
        return;
    } else {
        inputEncode.className = "form-control is-valid";
        inputDecode.className = "form-control";
    }
    try {
        result = encode(input);
    }
    catch(error) {
        console.error(error);
        inputEncode.className = "form-control is-invalid";
        inputDecode.value = "";
        return;
    }

    inputDecode.value = result;
}

function decodeInput() {
    const input = inputDecode.value;
    let result;
    if (input.length < 8 || input.length > 9) {
        inputDecode.className = "form-control is-invalid";
        inputEncode.value = "";
        return;
    }
    try {
        result = decode(input);
    }
    catch(error) {
        console.error(error);
        inputDecode.className = "form-control is-invalid";
        inputEncode.value = "";
        return;
    }
    if (result == 0) {
        inputDecode.className = "form-control is-invalid";
        inputEncode.value = "";
        return;
    }
    inputDecode.className = "form-control is-valid";
    inputEncode.className = "form-control";   
    inputEncode.value = result.toString();
}

(function () {
    document.getElementById("encode")!.addEventListener("click", encodeInput);
    document.getElementById("decode")!.addEventListener("click", decodeInput);
})();
