import assert from 'node:assert';
import { URL } from '../URL.mjs';

describe('Base Tests', () => {
    it('should create a URL object', () => {
        const url = new URL('https://example.com');
        assert.strictEqual(url.href, 'https://example.com/');
    });

    it('should throw an error for invalid URL', () => {
        assert.throws(() => {
            new URL('invalid-url');
        }, Error);
    });

    it('should create a URL object with base', () => {
        const url = new URL('/path', 'https://example.com');
        assert.strictEqual(url.href, 'https://example.com/path');
    });

    it('should set and get hash', () => {
        const url = new URL('https://example.com');
        url.hash = 'test';
        assert.strictEqual(url.hash, '#test');
        assert.strictEqual(url.href, 'https://example.com/#test');
    });

    it('should set and get host', () => {
        const url = new URL('https://example.com');
        url.host = 'example.org:8080';
        assert.strictEqual(url.host, 'example.org:8080');
        assert.strictEqual(url.port, '8080');
        assert.strictEqual(url.href, 'https://example.org:8080/');
    });

    it('should set and get hostname', () => {
        const url = new URL('https://example.com');
        url.hostname = 'example.org';
        assert.strictEqual(url.hostname, 'example.org');
        assert.strictEqual(url.href, 'https://example.org/');
    });

    it('should set and get search', () => {
        const url = new URL('https://example.com');
        url.search = 'query=1';
        assert.strictEqual(url.search, '?query=1');
        assert.strictEqual(url.href, 'https://example.com/?query=1');
    });

    it('should set and get username and password normal', () => {
        const url = new URL('https://example.com');
        url.username = 'user';
        url.password = 'pass';
        assert.strictEqual(url.username, 'user');
        assert.strictEqual(url.password, 'pass');
        assert.strictEqual(url.href, 'https://user:pass@example.com/');
    });

    it('should set and get username and password special', () => {
        const url = new URL('https://example.com');
        url.username = '0';
        url.password = '0';
        assert.strictEqual(url.username, '0');
        assert.strictEqual(url.password, '0');
        assert.strictEqual(url.href, 'https://0:0@example.com/');
    });

    it('should convert URL object to JSON', () => {
        const url = new URL('https://example.com');
        const json = url.toJSON();
        const expectedJson = JSON.stringify({
            hash: '',
            host: 'example.com',
            hostname: 'example.com',
            href: 'https://example.com/',
            origin: 'https://example.com',
            password: '',
            pathname: '/',
            port: '',
            protocol: 'https:',
            search: '',
            searchParams: new URLSearchParams(''),
            username: '',
        });
        assert.strictEqual(json, expectedJson);
    });
});
