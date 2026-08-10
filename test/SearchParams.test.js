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

	it("should set and get searchParams json", () => {
		const value = "{\"glossary\":{\"title\":\"example glossary\",\"GlossDiv\":{\"title\":\"S\",\"GlossList\":{\"GlossEntry\":{\"ID\":\"SGML\",\"SortAs\":\"SGML\",\"GlossTerm\":\"Standard Generalized Markup Language\",\"Acronym\":\"SGML\",\"Abbrev\":\"ISO 8879:1986\",\"GlossDef\":{\"para\":\"A meta-markup language, used to create markup languages such as DocBook.\",\"GlossSeeAlso\":[\"GML\",\"XML\"]},\"GlossSee\":\"markup\"}}}}}";
		url.searchParams.set("type6", value);
		const serializedValue = new globalThis.URLSearchParams([["type6", value]]).toString();
		const expectedSearch = `?type1=12345&type2=0&type3=false&type4=null&type5&${serializedValue}`;
		assert.strictEqual(url.search, expectedSearch);
		assert.strictEqual(url.href, `https://example.com/${expectedSearch}`);
	});

	it("should encode comma in parameter value", () => {
		const url2 = new URL("https://example.com");
		url2.searchParams.set("list", "apple,banana,cherry");

		assert.strictEqual(url2.search, "?list=apple%2Cbanana%2Ccherry");
		assert.strictEqual(url2.href, "https://example.com/?list=apple%2Cbanana%2Ccherry");
		assert.strictEqual(url2.searchParams.get("list"), "apple,banana,cherry");
	});

	it("should encode comma in parameter key", () => {
		const url3 = new URL("https://example.com");
		url3.searchParams.set("item,1", "value");

		assert.strictEqual(url3.search, "?item%2C1=value");
		assert.strictEqual(url3.href, "https://example.com/?item%2C1=value");
		assert.strictEqual(url3.searchParams.get("item,1"), "value");
	});

	it("should parse comma from query string correctly", () => {
		const url4 = new URL("https://example.com?list=apple,banana,cherry");

		assert.strictEqual(url4.searchParams.get("list"), "apple,banana,cherry");
		assert.strictEqual(url4.search, "?list=apple,banana,cherry");
		assert.strictEqual(url4.searchParams.toString(), "list=apple%2Cbanana%2Ccherry");
	});

	it("should handle already encoded comma", () => {
		const url5 = new URL("https://example.com?list=apple%2Cbanana");

		assert.strictEqual(url5.searchParams.get("list"), "apple,banana");
		assert.strictEqual(url5.searchParams.toString(), "list=apple%2Cbanana");
	});

	it("should handle mixed special characters", () => {
		const url6 = new URL("https://example.com");
		url6.searchParams.set("data", "a,b&c=d");

		assert.strictEqual(url6.search, "?data=a%2Cb%26c%3Dd");
		assert.strictEqual(url6.href, "https://example.com/?data=a%2Cb%26c%3Dd");
	});

	it("should use form URL encoding for plus and special characters", () => {
		const url7 = new URL("https://example.com?space=a+b&plus=%2B&special=%7E%21%27%28%29%2A%2C");

		assert.strictEqual(url7.searchParams.get("space"), "a b");
		assert.strictEqual(url7.searchParams.get("plus"), "+");
		assert.strictEqual(url7.searchParams.toString(), "space=a+b&plus=%2B&special=%7E%21%27%28%29*%2C");

		const url8 = new URL("https://example.com");
		url8.searchParams.set("value", "a b+~!'()*,");
		assert.strictEqual(url8.search, "?value=a+b%2B%7E%21%27%28%29*%2C");
	});

	it("should preserve equals signs in parameter values", () => {
		const url9 = new URL("https://example.com?value=a=b=c");

		assert.strictEqual(url9.searchParams.get("value"), "a=b=c");
		assert.strictEqual(url9.searchParams.toString(), "value=a%3Db%3Dc");
	});
});
