import assert from "node:assert";
import { URL } from "../URL.mjs";

describe("Search Tests", () => {
	const url = new URL("https://example.com");

	it("should set and get search number", () => {
		url.search = 12345;
		assert.strictEqual(url.search, "?12345");
		assert.strictEqual(url.href, "https://example.com/?12345");
	});

	it("should set and get search 0", () => {
		url.search = 0;
		assert.strictEqual(url.search, "?0");
		assert.strictEqual(url.href, "https://example.com/?0");
	});

	it("should set and get search false", () => {
		url.search = false;
		assert.strictEqual(url.search, "?false");
		assert.strictEqual(url.href, "https://example.com/?false");
	});

	it("should set and get search null", () => {
		url.search = null;
		assert.strictEqual(url.search, "?null");
		assert.strictEqual(url.href, "https://example.com/?null");
	});

	it("should set and get search undefined", () => {
		url.search = undefined;
		assert.strictEqual(url.search, "?undefined");
		assert.strictEqual(url.href, "https://example.com/?undefined");
	});

	it("should set and get search %25", () => {
		url.search = "%25";
		assert.strictEqual(url.search, "?%25");
		assert.strictEqual(url.href, "https://example.com/?%25");
	});

});
