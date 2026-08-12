import { URLSearchParams } from "./URLSearchParams.mts";

/**
 * 为未提供 Web URL API 的 JavaScriptCore 环境提供 URL polyfill。
 *
 * A URL polyfill for JavaScriptCore environments that do not provide the Web
 * URL API.
 */
export class URL {
	/**
	 * 使用绝对 URL，或相对 URL 与基础 URL 创建 URL 实例。
	 *
	 * Creates a URL from an absolute URL string or a relative URL with a base.
	 *
	 * @param url - 要解析的绝对或相对 URL。 The absolute or relative URL to parse.
	 * @param base - 用于解析相对 URL 的绝对基础 URL。 The absolute base URL used to resolve a relative URL.
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

	/** URL 片段；存在时包含开头的 `#`。 The URL fragment, including the leading `#` when present. */
	get hash() {
		return this.#url.hash;
	}
	set hash(value: string) {
		if (value.length !== 0) {
			if (value.startsWith("#")) value = value.slice(1);
			this.#url.hash = `#${encodeURIComponent(value)}`;
		}
	}
	/** URL 的主机名与端口。 The hostname and port of the URL. */
	get host() {
		return this.port.length > 0 ? `${this.hostname}:${this.port}` : this.hostname;
	}
	set host(value: string) {
		[this.hostname, this.port] = value.split(":", 2);
	}
	/** URL 编码后的主机名。 The encoded hostname of the URL. */
	get hostname() {
		return encodeURIComponent(this.#url.hostname);
	}
	set hostname(value: string) {
		this.#url.hostname = value ?? "";
	}
	/** 完整序列化后的 URL。 The complete serialized URL. */
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
	/** 由协议与主机组成的序列化源。 The serialized origin, consisting of the protocol and host. */
	get origin() {
		return `${this.protocol}//${this.host}`;
	}
	/** 主机名前指定的编码后密码。 The encoded password specified before the host. */
	get password() {
		return encodeURIComponent(this.#url.password);
	}
	set password(value: string) {
		if (this.username.length > 0) this.#url.password = value ?? "";
	}
	/** URL 路径，包含开头的 `/`。 The URL path, including the leading `/`. */
	get pathname() {
		return `/${this.#url.pathname}`;
	}
	set pathname(value: string) {
		value = `${value}`;
		if (value.startsWith("/")) value = value.slice(1);
		this.#url.pathname = value;
	}
	/** 显式端口；使用协议默认端口时为空字符串。 The explicit port, or an empty string for the protocol's default port. */
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
	/** URL 协议，包含结尾的 `:`。 The URL scheme, including the trailing `:`. */
	get protocol() {
		return `${this.#url.protocol}:`;
	}
	set protocol(value: string) {
		if (value.endsWith(":")) value = value.slice(0, -1);
		this.#url.protocol = value;
	}
	/** 序列化后的查询字符串；存在时包含开头的 `?`。 The serialized query string, including the leading `?` when present. */
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
	/** URL 查询参数的可变视图。 A mutable view of the URL query parameters. */
	get searchParams() {
		return this.#url.searchParams;
	}
	/** 主机名前指定的编码后用户名。 The encoded username specified before the host. */
	get username() {
		return encodeURIComponent(this.#url.username);
	}
	set username(value: string) {
		this.#url.username = value ?? "";
	}

	/**
	 * 使用与构造函数相同的输入解析 URL。
	 *
	 * Parses a URL using the same inputs accepted by the constructor.
	 *
	 * @param url - 要解析的绝对或相对 URL。 The absolute or relative URL to parse.
	 * @param base - 用于解析相对 URL 的绝对基础 URL。 The absolute base URL used to resolve a relative URL.
	 * @returns 解析得到的 URL 实例。 A parsed URL instance.
	 */
	static parse = (url: string, base?: string) => new URL(url, base);

	/**
	 * 返回 URL 的字符串表示。
	 *
	 * Returns the string representation of the URL.
	 *
	 * @returns 完整序列化后的 URL。 The complete serialized URL.
	 */
	toString = (): string => this.href;

	/**
	 * 将 URL 对象的公开属性转换为 JSON 字符串。
	 *
	 * Converts the URL object properties to a JSON string.
	 *
	 * @returns 包含 URL 公开属性的 JSON 字符串。 A JSON string containing the public URL properties.
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
