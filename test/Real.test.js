import assert from "node:assert";
import { URL } from "../URL.mjs";

describe("Real Tests", () => {
    const url = new URL('blob:https://anonymous:flabada@developer.mozilla.org:8080/zh-CN/docs/Web/API/URL/password?fr=yset_ie_syc_oracle&type=orcl_hpset#page0');
    it('should create a URL object', () => {
        assert.strictEqual(url.href, 'https://anonymous:flabada@developer.mozilla.org:8080/zh-CN/docs/Web/API/URL/password?fr=yset_ie_syc_oracle&type=orcl_hpset#page0');
    });

    it('should set and get searchParams', () => {
        assert.strictEqual(url.searchParams.get("type"), 'orcl_hpset');
        url.searchParams.set("type", "newType");
        assert.strictEqual(url.searchParams.get("type"), 'newType');
    });

    it('should append searchParams', () => {
        url.searchParams.append("new", "value");
        assert.strictEqual(url.searchParams.get("new"), 'value');
    });

    it('should update search', () => {
        assert.strictEqual(url.search, '?fr=yset_ie_syc_oracle&type=newType&new=value');
    });

	it("should convert URL object to JSON", () => {
		const json = url.toJSON();
		const expectedJson = JSON.stringify({
			hash: "#page0",
			host: "developer.mozilla.org:8080",
			hostname: "developer.mozilla.org",
			href: "https://anonymous:flabada@developer.mozilla.org:8080/zh-CN/docs/Web/API/URL/password?fr=yset_ie_syc_oracle&type=newType&new=value#page0",
			origin: "https://developer.mozilla.org:8080",
			password: "flabada",
			pathname: "/zh-CN/docs/Web/API/URL/password",
			port: "8080",
			protocol: "https:",
			search: "?fr=yset_ie_syc_oracle&type=newType&new=value",
			searchParams: {},
			username: "anonymous",
		});
		assert.strictEqual(json, expectedJson);
	});
});
