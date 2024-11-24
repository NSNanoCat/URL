import assert from "node:assert";
import { URL } from "../URL.mjs";

describe("SearchParams Tests", () => {
	const url = new URL("https://example.com");

	it("should set and get searchParams number", () => {
		url.searchParams.set("type1", 12345);
		assert.strictEqual(url.search, "?type1=12345");
		assert.strictEqual(url.href, "https://example.com/?type1=12345");
	});

	it("should set and get searchParams 0", () => {
		url.searchParams.set("type2", 0);
		assert.strictEqual(url.search, "?type1=12345&type2=0");
		assert.strictEqual(url.href, "https://example.com/?type1=12345&type2=0");
	});

	it("should set and get searchParams false", () => {
		url.searchParams.set("type3", false);
		assert.strictEqual(url.search, "?type1=12345&type2=0&type3=false");
		assert.strictEqual(url.href, "https://example.com/?type1=12345&type2=0&type3=false");
	});

	it("should set and get searchParams null", () => {
		url.searchParams.set("type4", null);
		assert.strictEqual(url.search, "?type1=12345&type2=0&type3=false&type4=null");
		assert.strictEqual(url.href, "https://example.com/?type1=12345&type2=0&type3=false&type4=null");
	});

	it("should set and get searchParams undefined", () => {
		url.searchParams.set("type5");
		assert.strictEqual(url.search, "?type1=12345&type2=0&type3=false&type4=null&type5");
		assert.strictEqual(url.href, "https://example.com/?type1=12345&type2=0&type3=false&type4=null&type5");
	});

});
