import assert from "node:assert";
import { URL } from "../URL.mjs";

describe("Port Tests", () => {
	const url = new URL("https://example.com:80");

	it("should set and get port 443", () => {
		url.port = "443";
		assert.strictEqual(url.port, "");
		assert.strictEqual(url.host, "example.com");
		assert.strictEqual(url.href, "https://example.com/");
	});

	it("should set and get port 12345", () => {
		url.port = "12345";
		assert.strictEqual(url.port, "12345");
		assert.strictEqual(url.host, "example.com:12345");
		assert.strictEqual(url.href, "https://example.com:12345/");
	});

	it("should set and get port 0", () => {
		url.port = "0";
		assert.strictEqual(url.port, "0");
		assert.strictEqual(url.host, "example.com:0");
		assert.strictEqual(url.href, "https://example.com:0/");
	});

	it("should set and get port 65536", () => {
		url.port = 65536;
		assert.strictEqual(url.port, "0");
		assert.strictEqual(url.host, "example.com:0");
		assert.strictEqual(url.href, "https://example.com:0/");
	});

	it("should set and get port false", () => {
		url.port = false;
		assert.strictEqual(url.port, "0");
		assert.strictEqual(url.host, "example.com:0");
		assert.strictEqual(url.href, "https://example.com:0/");
	});

	it("should set and get port null", () => {
		url.port = null;
		assert.strictEqual(url.port, "0");
		assert.strictEqual(url.host, "example.com:0");
		assert.strictEqual(url.href, "https://example.com:0/");
	});

	it("should set and get port undefined", () => {
		url.port = undefined;
		assert.strictEqual(url.port, "0");
		assert.strictEqual(url.host, "example.com:0");
		assert.strictEqual(url.href, "https://example.com:0/");
	});

});
