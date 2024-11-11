import assert from "node:assert";
import { URL } from "../URL.mjs";

describe("Real Tests", () => {
    const url = new URL('https://vod-ftc-na-west-1.media.dssott.com/dvt1=exp=1702087989~url=%2Fgrn%2Fps01%2Fdisney%2F216914b5-fbab-4884-bebb-ac3bd12d0477%2F~aid=2a1ae660-dca0-472a-a9f1-429cfebb150d~did=f4a363ef-2cc7-483b-a2ac-a93adfb78ede~kid=k01~hmac=6fdf76de350af32ddea2ba69d6a078ddf8c8fe3c062ae4339384422c76cba9bc/grn/ps01/disney/216914b5-fbab-4884-bebb-ac3bd12d0477/r/f7594446-bcb8-409a-a93c-db9b8b8f5bfa/45f2-MAIN/06/subtitles_1/subtitles.m3u8?subtype=Translate&lang=EN');
    it('should create a URL object', () => {
        assert.strictEqual(url.href, 'https://vod-ftc-na-west-1.media.dssott.com/dvt1=exp=1702087989~url=%2Fgrn%2Fps01%2Fdisney%2F216914b5-fbab-4884-bebb-ac3bd12d0477%2F~aid=2a1ae660-dca0-472a-a9f1-429cfebb150d~did=f4a363ef-2cc7-483b-a2ac-a93adfb78ede~kid=k01~hmac=6fdf76de350af32ddea2ba69d6a078ddf8c8fe3c062ae4339384422c76cba9bc/grn/ps01/disney/216914b5-fbab-4884-bebb-ac3bd12d0477/r/f7594446-bcb8-409a-a93c-db9b8b8f5bfa/45f2-MAIN/06/subtitles_1/subtitles.m3u8?subtype=Translate&lang=EN');
    });

    it('should set and get searchParams', () => {
        assert.strictEqual(url.searchParams.get("type"), undefined);
        url.searchParams.set("type", "newType");
        assert.strictEqual(url.searchParams.get("type"), 'newType');
    });

    it('should append searchParams', () => {
        url.searchParams.append("new", "value");
        assert.strictEqual(url.searchParams.get("new"), 'value');
    });

    it('should update search', () => {
        assert.strictEqual(url.search, '?subtype=Translate&lang=EN&type=newType&new=value');
    });

	it("should convert URL object to JSON", () => {
		const json = url.toJSON();
		const expectedJson = JSON.stringify({
			hash: "",
			host: "vod-ftc-na-west-1.media.dssott.com",
			hostname: "vod-ftc-na-west-1.media.dssott.com",
			href: "https://vod-ftc-na-west-1.media.dssott.com/dvt1=exp=1702087989~url=%2Fgrn%2Fps01%2Fdisney%2F216914b5-fbab-4884-bebb-ac3bd12d0477%2F~aid=2a1ae660-dca0-472a-a9f1-429cfebb150d~did=f4a363ef-2cc7-483b-a2ac-a93adfb78ede~kid=k01~hmac=6fdf76de350af32ddea2ba69d6a078ddf8c8fe3c062ae4339384422c76cba9bc/grn/ps01/disney/216914b5-fbab-4884-bebb-ac3bd12d0477/r/f7594446-bcb8-409a-a93c-db9b8b8f5bfa/45f2-MAIN/06/subtitles_1/subtitles.m3u8?subtype=Translate&lang=EN&type=newType&new=value",
			origin: "https://vod-ftc-na-west-1.media.dssott.com",
			password: "",
			pathname: "/dvt1=exp=1702087989~url=%2Fgrn%2Fps01%2Fdisney%2F216914b5-fbab-4884-bebb-ac3bd12d0477%2F~aid=2a1ae660-dca0-472a-a9f1-429cfebb150d~did=f4a363ef-2cc7-483b-a2ac-a93adfb78ede~kid=k01~hmac=6fdf76de350af32ddea2ba69d6a078ddf8c8fe3c062ae4339384422c76cba9bc/grn/ps01/disney/216914b5-fbab-4884-bebb-ac3bd12d0477/r/f7594446-bcb8-409a-a93c-db9b8b8f5bfa/45f2-MAIN/06/subtitles_1/subtitles.m3u8",
			port: "",
			protocol: "https:",
			search: "?subtype=Translate&lang=EN&type=newType&new=value",
			searchParams: {},
			username: "",
		});
		assert.strictEqual(json, expectedJson);
	});
});
