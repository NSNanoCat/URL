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
		assert.strictEqual(url.search, "?type1=12345&type2=0&type3=false&type4=null&type5&type6=%7B%22glossary%22%3A%7B%22title%22%3A%22example%20glossary%22%2C%22GlossDiv%22%3A%7B%22title%22%3A%22S%22%2C%22GlossList%22%3A%7B%22GlossEntry%22%3A%7B%22ID%22%3A%22SGML%22%2C%22SortAs%22%3A%22SGML%22%2C%22GlossTerm%22%3A%22Standard%20Generalized%20Markup%20Language%22%2C%22Acronym%22%3A%22SGML%22%2C%22Abbrev%22%3A%22ISO%208879%3A1986%22%2C%22GlossDef%22%3A%7B%22para%22%3A%22A%20meta-markup%20language%2C%20used%20to%20create%20markup%20languages%20such%20as%20DocBook.%22%2C%22GlossSeeAlso%22%3A%5B%22GML%22%2C%22XML%22%5D%7D%2C%22GlossSee%22%3A%22markup%22%7D%7D%7D%7D%7D");
		assert.strictEqual(url.href, "https://example.com/?type1=12345&type2=0&type3=false&type4=null&type5&type6=%7B%22glossary%22%3A%7B%22title%22%3A%22example%20glossary%22%2C%22GlossDiv%22%3A%7B%22title%22%3A%22S%22%2C%22GlossList%22%3A%7B%22GlossEntry%22%3A%7B%22ID%22%3A%22SGML%22%2C%22SortAs%22%3A%22SGML%22%2C%22GlossTerm%22%3A%22Standard%20Generalized%20Markup%20Language%22%2C%22Acronym%22%3A%22SGML%22%2C%22Abbrev%22%3A%22ISO%208879%3A1986%22%2C%22GlossDef%22%3A%7B%22para%22%3A%22A%20meta-markup%20language%2C%20used%20to%20create%20markup%20languages%20such%20as%20DocBook.%22%2C%22GlossSeeAlso%22%3A%5B%22GML%22%2C%22XML%22%5D%7D%2C%22GlossSee%22%3A%22markup%22%7D%7D%7D%7D%7D");
	});

});
