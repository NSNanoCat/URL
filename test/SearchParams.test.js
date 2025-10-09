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
		url.searchParams.set("type6", "{\"glossary\":{\"title\":\"example glossary\",\"GlossDiv\":{\"title\":\"S\",\"GlossList\":{\"GlossEntry\":{\"ID\":\"SGML\",\"SortAs\":\"SGML\",\"GlossTerm\":\"Standard Generalized Markup Language\",\"Acronym\":\"SGML\",\"Abbrev\":\"ISO 8879:1986\",\"GlossDef\":{\"para\":\"A meta-markup language, used to create markup languages such as DocBook.\",\"GlossSeeAlso\":[\"GML\",\"XML\"]},\"GlossSee\":\"markup\"}}}}}");
		assert.strictEqual(url.search, "?type1=12345&type2=0&type3=false&type4=null&type5&type6=%7B%22glossary%22%3A%7B%22title%22%3A%22example%20glossary%22,%22GlossDiv%22%3A%7B%22title%22%3A%22S%22,%22GlossList%22%3A%7B%22GlossEntry%22%3A%7B%22ID%22%3A%22SGML%22,%22SortAs%22%3A%22SGML%22,%22GlossTerm%22%3A%22Standard%20Generalized%20Markup%20Language%22,%22Acronym%22%3A%22SGML%22,%22Abbrev%22%3A%22ISO%208879%3A1986%22,%22GlossDef%22%3A%7B%22para%22%3A%22A%20meta-markup%20language,%20used%20to%20create%20markup%20languages%20such%20as%20DocBook.%22,%22GlossSeeAlso%22%3A%5B%22GML%22,%22XML%22%5D%7D,%22GlossSee%22%3A%22markup%22%7D%7D%7D%7D%7D");
		assert.strictEqual(url.href, "https://example.com/?type1=12345&type2=0&type3=false&type4=null&type5&type6=%7B%22glossary%22%3A%7B%22title%22%3A%22example%20glossary%22,%22GlossDiv%22%3A%7B%22title%22%3A%22S%22,%22GlossList%22%3A%7B%22GlossEntry%22%3A%7B%22ID%22%3A%22SGML%22,%22SortAs%22%3A%22SGML%22,%22GlossTerm%22%3A%22Standard%20Generalized%20Markup%20Language%22,%22Acronym%22%3A%22SGML%22,%22Abbrev%22%3A%22ISO%208879%3A1986%22,%22GlossDef%22%3A%7B%22para%22%3A%22A%20meta-markup%20language,%20used%20to%20create%20markup%20languages%20such%20as%20DocBook.%22,%22GlossSeeAlso%22%3A%5B%22GML%22,%22XML%22%5D%7D,%22GlossSee%22%3A%22markup%22%7D%7D%7D%7D%7D");
	});

	// Comma handling tests
	it("should handle comma in parameter value correctly", () => {
		const url2 = new URL("https://example.com");
		url2.searchParams.set("list", "apple,banana,cherry");
		
		// 逗号是合法字符，不应该被编码
		assert.strictEqual(url2.search, "?list=apple,banana,cherry");
		assert.strictEqual(url2.href, "https://example.com/?list=apple,banana,cherry");
		
		// 验证可以正确获取
		assert.strictEqual(url2.searchParams.get("list"), "apple,banana,cherry");
	});

	it("should handle comma in parameter key correctly", () => {
		const url3 = new URL("https://example.com");
		url3.searchParams.set("item,1", "value");
		
		// 键中的逗号也是合法的
		assert.strictEqual(url3.search, "?item,1=value");
		assert.strictEqual(url3.href, "https://example.com/?item,1=value");
		assert.strictEqual(url3.searchParams.get("item,1"), "value");
	});

	it("should parse comma from query string correctly", () => {
		const url4 = new URL("https://example.com?list=apple,banana,cherry");
		
		assert.strictEqual(url4.searchParams.get("list"), "apple,banana,cherry");
		assert.strictEqual(url4.search, "?list=apple,banana,cherry");
	});

	it("should handle already encoded comma", () => {
		// 如果用户明确编码了逗号，应该保持编码状态
		const url5 = new URL("https://example.com?list=apple%2Cbanana");
		
		// 这种情况下，%2C 会被解码为逗号
		assert.strictEqual(url5.searchParams.get("list"), "apple,banana");
	});

	it("should handle mixed special characters", () => {
		const url6 = new URL("https://example.com");
		url6.searchParams.set("data", "a,b&c=d");
		
		// & 和 = 需要被编码，但逗号不需要
		assert.strictEqual(url6.search, "?data=a,b%26c%3Dd");
		assert.strictEqual(url6.href, "https://example.com/?data=a,b%26c%3Dd");
	});

});
