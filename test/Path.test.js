import assert from "node:assert";
import { URL } from "../URL.mjs";

describe("Path Tests", () => {
	const url = new URL("https://example.com");

    it('should set and get pathname normal', () => {
        const url = new URL('https://example.com');
        url.pathname = 'test/path';
        assert.strictEqual(url.pathname, '/test/path');
        assert.strictEqual(url.href, 'https://example.com/test/path');
    });

    it('should set and get pathname ////', () => {
        const url = new URL('https://example.com');
        url.pathname = '///test/path';
        assert.strictEqual(url.pathname, '///test/path');
        assert.strictEqual(url.href, 'https://example.com///test/path');
    });

	it("should set and get pathname number 0", () => {
		url.pathname = 0;
		assert.strictEqual(url.pathname, '/0');
		assert.strictEqual(url.href, "https://example.com/0");
	});

	it("should set and get pathname number 12345", () => {
		url.pathname = 12345;
		assert.strictEqual(url.pathname, '/12345');
		assert.strictEqual(url.href, "https://example.com/12345");
	});

	it("should set and get pathname false", () => {
		url.pathname = false;
		assert.strictEqual(url.pathname, '/false');
		assert.strictEqual(url.href, "https://example.com/false");
	});

	it("should set and get pathname null", () => {
		url.pathname = null;
		assert.strictEqual(url.pathname, '/null');
		assert.strictEqual(url.href, "https://example.com/null");
	});

	it("should set and get pathname undefined", () => {
		url.pathname = undefined;
		assert.strictEqual(url.pathname, '/undefined');
		assert.strictEqual(url.href, "https://example.com/undefined");
	});

});
