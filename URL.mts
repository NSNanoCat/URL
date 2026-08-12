import { URLSearchParams } from "./URLSearchParams.mts";

/**
 * A URL polyfill for JavaScriptCore environments that do not provide the Web
 * URL API.
 */
export class URL {
	/**
	 * Creates a URL from an absolute URL string or a relative URL with a base.
	 *
	 * @param url - The absolute or relative URL to parse.
	 * @param base - The absolute base URL used to resolve a relative URL.
	 */
	constructor(url: string, base?: string) {
		switch (typeof url) {
			case "string": {
				const urlIsValid = /^(blob:|file:)?[a-zA-z]+:\/\/.*/.test(url);
				const baseIsValid = base ? /^(blob:|file:)?[a-zA-z]+:\/\/.*/.test(base) : false;
				// If a string is passed for url instead of location or link, then set the properties of the URL instance.
				if (urlIsValid) this.href = url;
				// If the url isn't valid, but the base is, then prepend the base to the url.
				else if (baseIsValid) this.href = base + url;
				// If no valid url or base is given, then throw a type error.
				else throw new TypeError('URL string is not valid. If using a relative url, a second argument needs to be passed representing the base URL. Example: new URL("relative/path", "http://www.example.com");');
				break;
			}
			case "object":
				break;
			default:
				throw new TypeError("Invalid argument type.");
		}
	}

	#url = {
		hash: "",
		host: "",
		hostname: "",
		href: "",
		password: "",
		pathname: "",
		port: Number.NaN,
		protocol: "",
		search: "",
		searchParams: new URLSearchParams(""),
		username: "",
	};

	// refer: http://www.ietf.org/rfc/rfc3986.txt
	static #URLRegExp = /^(?<scheme>([^:\/?#]+):)?(?:\/\/(?<authority>[^\/?#]*))?(?<path>[^?#]*)(?<query>\?([^#]*))?(?<hash>#(.*))?$/;
	static #AuthorityRegExp = /^(?<authentication>(?<username>[^:]*)(:(?<password>[^@]*))?@)?(?<hostname>[^:]+)(:(?<port>\d+))?$/;

	/** The URL fragment, including the leading `#` when present. */
	get hash() {
		return this.#url.hash;
	}
	set hash(value: string) {
		if (value.length !== 0) {
			if (value.startsWith("#")) value = value.slice(1);
			this.#url.hash = `#${encodeURIComponent(value)}`;
		}
	}
	/** The hostname and port of the URL. */
	get host() {
		return this.port.length > 0 ? `${this.hostname}:${this.port}` : this.hostname;
	}
	set host(value: string) {
		[this.hostname, this.port] = value.split(":", 2);
	}
	/** The encoded hostname of the URL. */
	get hostname() {
		return encodeURIComponent(this.#url.hostname);
	}
	set hostname(value: string) {
		this.#url.hostname = value ?? "";
	}
	/** The complete serialized URL. */
	get href() {
		let authority = "";
		if (this.username.length > 0) {
			authority += this.username;
			if (this.password.length > 0) authority += `:${this.password}`;
			authority += "@";
		}
		return `${this.protocol}//${authority}${this.host}${this.pathname}${this.search}${this.hash}`;
	}
	set href(value: string) {
		if (value.startsWith("blob:") || value.startsWith("file:")) value = value.slice(5);
		const urlMatch = value.match(URL.#URLRegExp);
		if (!urlMatch) throw new TypeError("Invalid URL format.");
		this.protocol = urlMatch.groups.scheme ?? "";
		const authorityMatch = urlMatch.groups.authority.match(URL.#AuthorityRegExp);
		this.username = authorityMatch.groups.username ?? "";
		this.password = authorityMatch.groups.password ?? "";
		this.hostname = authorityMatch.groups.hostname ?? "";
		this.port = authorityMatch.groups.port ?? "";
		this.pathname = urlMatch.groups.path ?? "";
		this.search = urlMatch.groups.query ?? "";
		this.hash = urlMatch.groups.hash ?? "";
	}
	/** The serialized origin, consisting of the protocol and host. */
	get origin() {
		return `${this.protocol}//${this.host}`;
	}
	/** The encoded password specified before the host. */
	get password() {
		return encodeURIComponent(this.#url.password);
	}
	set password(value: string) {
		if (this.username.length > 0) this.#url.password = value ?? "";
	}
	/** The URL path, including the leading `/`. */
	get pathname() {
		return `/${this.#url.pathname}`;
	}
	set pathname(value: string) {
		value = `${value}`;
		if (value.startsWith("/")) value = value.slice(1);
		this.#url.pathname = value;
	}
	/** The explicit port, or an empty string for the protocol's default port. */
	get port() {
		if (Number.isNaN(this.#url.port)) return "";
		const port = this.#url.port.toString();
		if (this.protocol === "ftp:" && port === "21") return "";
		if (this.protocol === "http:" && port === "80") return "";
		if (this.protocol === "https:" && port === "443") return "";
		return port;
	}
	set port(value: string) {
		switch (value) {
			case "":
				this.#url.port = Number.NaN;
				break;
			default: {
				const port = Number.parseInt(value, 10);
				if (port >= 0 && port < 65535) this.#url.port = port;
			}
		}
	}
	/** The URL scheme, including the trailing `:`. */
	get protocol() {
		return `${this.#url.protocol}:`;
	}
	set protocol(value: string) {
		if (value.endsWith(":")) value = value.slice(0, -1);
		this.#url.protocol = value;
	}
	/** The serialized query string, including the leading `?` when present. */
	get search() {
		if (this.#url.search.length > 0) return `?${this.#url.search}`;
		else return "";
	}
	set search(value: string) {
		value = `${value}`;
		if (value.startsWith("?")) value = value.slice(1);
		this.#url.search = value;
		this.#url.searchParams = new URLSearchParams(this.#url.search, search => {
			this.#url.search = search;
		});
	}
	/** A mutable view of the URL query parameters. */
	get searchParams() {
		return this.#url.searchParams;
	}
	/** The encoded username specified before the host. */
	get username() {
		return encodeURIComponent(this.#url.username);
	}
	set username(value: string) {
		this.#url.username = value ?? "";
	}

	/**
	 * Parses a URL using the same inputs accepted by the constructor.
	 *
	 * @param url - The absolute or relative URL to parse.
	 * @param base - The absolute base URL used to resolve a relative URL.
	 * @returns A parsed URL instance.
	 */
	static parse = (url: string, base?: string) => new URL(url, base);

	/**
	 * Returns the string representation of the URL.
	 *
	 * @returns The complete serialized URL.
	 */
	toString = (): string => this.href;

	/**
	 * Converts the URL object properties to a JSON string.
	 *
	 * @returns A JSON string containing the public URL properties.
	 */
	toJSON = (): string =>
		JSON.stringify({
			hash: this.hash,
			host: this.host,
			hostname: this.hostname,
			href: this.href,
			origin: this.origin,
			password: this.password,
			pathname: this.pathname,
			port: this.port,
			protocol: this.protocol,
			search: this.search,
			searchParams: this.searchParams,
			username: this.username,
		});
}
