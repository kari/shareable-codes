import { decode, encode, MAX_NUMBER } from "./shareable-codes.js";

const inputEncode = document.getElementById("inputEncode") as HTMLInputElement;
const inputDecode = document.getElementById("inputDecode") as HTMLInputElement;

function encodeInput() {
	const input = Number(inputEncode.value);
	if (input < 1 || input >= MAX_NUMBER) {
		inputEncode.className = "form-control is-invalid";
		inputDecode.value = "";
		return;
	}
	inputEncode.className = "form-control is-valid";
	inputDecode.className = "form-control";
	let result: string | undefined;
	try {
		result = encode(input);
	} catch (error) {
		console.error(error);
		inputEncode.className = "form-control is-invalid";
		inputDecode.value = "";
		return;
	}

	inputDecode.value = result;
}

function decodeInput() {
	const input = inputDecode.value;
	if (input.length < 8 || input.length > 9) {
		inputDecode.className = "form-control is-invalid";
		inputEncode.value = "";
		return;
	}
	let result: number | undefined;
	try {
		result = decode(input);
	} catch (error) {
		console.error(error);
		inputDecode.className = "form-control is-invalid";
		inputEncode.value = "";
		return;
	}
	if (result === 0) {
		inputDecode.className = "form-control is-invalid";
		inputEncode.value = "";
		return;
	}
	inputDecode.className = "form-control is-valid";
	inputEncode.className = "form-control";
	inputEncode.value = result.toString();
}

(() => {
	document.getElementById("encode")?.addEventListener("click", encodeInput);
	document.getElementById("decode")?.addEventListener("click", decodeInput);
})();
