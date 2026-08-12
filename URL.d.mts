import { URLSearchParams } from "./URLSearchParams.mts";
/**
 * 为未提供 Web URL API 的 JavaScriptCore 环境提供 URL polyfill。
 *
 * A URL polyfill for JavaScriptCore environments that do not provide the Web
 * URL API.
 */
export declare class URL {
    #private;
    /**
     * 使用绝对 URL，或相对 URL 与基础 URL 创建 URL 实例。
     *
     * Creates a URL from an absolute URL string or a relative URL with a base.
     *
     * @param url - 要解析的绝对或相对 URL。<br />
     * The absolute or relative URL to parse.
     * @param base - 用于解析相对 URL 的绝对基础 URL。<br />
     * The absolute base URL used to resolve a relative URL.
     */
    constructor(url: string, base?: string);
    /**
     * URL 片段；存在时包含开头的 `#`。<br />
     * The URL fragment, including the leading `#` when present.
     */
    get hash(): string;
    set hash(value: string);
    /**
     * URL 的主机名与端口。<br />
     * The hostname and port of the URL.
     */
    get host(): string;
    set host(value: string);
    /**
     * URL 编码后的主机名。<br />
     * The encoded hostname of the URL.
     */
    get hostname(): string;
    set hostname(value: string);
    /**
     * 完整序列化后的 URL。<br />
     * The complete serialized URL.
     */
    get href(): string;
    set href(value: string);
    /**
     * 由协议与主机组成的序列化源。<br />
     * The serialized origin, consisting of the protocol and host.
     */
    get origin(): string;
    /**
     * 主机名前指定的编码后密码。<br />
     * The encoded password specified before the host.
     */
    get password(): string;
    set password(value: string);
    /**
     * URL 路径，包含开头的 `/`。<br />
     * The URL path, including the leading `/`.
     */
    get pathname(): string;
    set pathname(value: string);
    /**
     * 显式端口；使用协议默认端口时为空字符串。<br />
     * The explicit port, or an empty string for the protocol's default port.
     */
    get port(): string;
    set port(value: string);
    /**
     * URL 协议，包含结尾的 `:`。<br />
     * The URL scheme, including the trailing `:`.
     */
    get protocol(): string;
    set protocol(value: string);
    /**
     * 序列化后的查询字符串；存在时包含开头的 `?`。<br />
     * The serialized query string, including the leading `?` when present.
     */
    get search(): string;
    set search(value: string);
    /**
     * URL 查询参数的可变视图。<br />
     * A mutable view of the URL query parameters.
     */
    get searchParams(): URLSearchParams;
    /**
     * 主机名前指定的编码后用户名。<br />
     * The encoded username specified before the host.
     */
    get username(): string;
    set username(value: string);
    /**
     * 使用与构造函数相同的输入解析 URL。
     *
     * Parses a URL using the same inputs accepted by the constructor.
     *
     * @param url - 要解析的绝对或相对 URL。<br />
     * The absolute or relative URL to parse.
     * @param base - 用于解析相对 URL 的绝对基础 URL。<br />
     * The absolute base URL used to resolve a relative URL.
     * @returns 解析得到的 URL 实例。<br />
     * A parsed URL instance.
     */
    static parse: (url: string, base?: string) => URL;
    /**
     * 返回 URL 的字符串表示。
     *
     * Returns the string representation of the URL.
     *
     * @returns 完整序列化后的 URL。<br />
     * The complete serialized URL.
     */
    toString: () => string;
    /**
     * 将 URL 对象的公开属性转换为 JSON 字符串。
     *
     * Converts the URL object properties to a JSON string.
     *
     * @returns 包含 URL 公开属性的 JSON 字符串。<br />
     * A JSON string containing the public URL properties.
     */
    toJSON: () => string;
}
