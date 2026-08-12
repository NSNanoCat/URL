/**
 * 提供符合 `application/x-www-form-urlencoded` 解析与序列化规则的 URL 查询字符串 polyfill。
 *
 * A URL query-string polyfill with `application/x-www-form-urlencoded`
 * parsing and serialization.
 */
export declare class URLSearchParams {
    #private;
    /**
     * 创建查询参数集合。
     *
     * Creates a query-parameter collection.
     *
     * @param params - 查询字符串、名称与值组成的可迭代对象，或普通对象。 A query string, an iterable of name-value pairs, or an object.
     * @param onUpdate - 集合变化时使用序列化后的查询字符串调用。 Called with the serialized query whenever the collection changes.
     */
    constructor(params?: string | Iterable<[string, string]> | object, onUpdate?: (search: string) => void);
    /**
     * 追加一组新的名称与值。
     *
     * Appends a new name-value pair.
     *
     * @param name - 参数名称。 The parameter name.
     * @param value - 参数值。 The parameter value.
     */
    append(name: string, value: string): void;
    /**
     * 删除所有使用指定名称的参数对。
     *
     * Removes all pairs with the supplied name.
     *
     * @param name - 要删除的参数名称。 The parameter name to remove.
     * @param value - 为兼容性保留；目前会删除所有名称匹配的参数。 Reserved for compatibility; currently all matching names are removed.
     */
    delete(name: string, value?: string): void;
    /**
     * 按插入顺序返回名称与值组成的参数对。
     *
     * Returns the name-value pairs in insertion order.
     *
     * @returns 参数对数组。 An array of parameter pairs.
     */
    entries(): Array<[string, string]>;
    /**
     * 返回与指定名称关联的第一个值。
     *
     * Returns the first value associated with a name.
     *
     * @param name - 要查找的参数名称。 The parameter name to find.
     * @returns 第一个匹配值；不存在时返回 `undefined`。 The first matching value, or `undefined` when absent.
     */
    get(name: string): string | undefined;
    /**
     * 返回与指定名称关联的所有值。
     *
     * Returns every value associated with a name.
     *
     * @param name - 要查找的参数名称。 The parameter name to find.
     * @returns 按插入顺序排列的匹配值。 The matching values in insertion order.
     */
    getAll(name: string): Array<string>;
    /**
     * 检查指定参数名称是否存在。
     *
     * Tests whether a parameter name exists.
     *
     * @param name - 要查找的参数名称。 The parameter name to find.
     * @param value - 为兼容性保留；目前只检查名称。 Reserved for compatibility; currently only the name is tested.
     */
    has(name: string, value?: string): boolean;
    /** 按插入顺序返回参数名称。 Returns the parameter names in insertion order. */
    keys(): Array<string>;
    /**
     * 设置指定名称的值，并删除该名称对应的其他参数对。
     *
     * Sets the value for a name and removes any additional pairs with that name.
     *
     * @param name - 要设置的参数名称。 The parameter name to set.
     * @param value - 替换后的值。 The replacement value.
     */
    set(name: string, value: string): void;
    /** 按字典序排列所有名称与值组成的参数对。 Sorts all name-value pairs lexicographically. */
    sort(): void;
    /** 返回不含开头 `?` 的序列化查询字符串。 Returns the serialized query string without a leading `?`. */
    toString: () => string;
    /** 返回按插入顺序遍历参数值的迭代器。 Returns an iterator over parameter values in insertion order. */
    values: () => Iterator<string>;
}
