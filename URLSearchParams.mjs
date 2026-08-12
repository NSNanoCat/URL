/**
 * 提供符合 `application/x-www-form-urlencoded` 解析与序列化规则的 URL 查询字符串 polyfill。
 *
 * A URL query-string polyfill with `application/x-www-form-urlencoded`
 * parsing and serialization.
 */
export class URLSearchParams {
    /**
     * 创建查询参数集合。
     *
     * Creates a query-parameter collection.
     *
     * @param params - 查询字符串、名称与值组成的可迭代对象，或普通对象。<br />
     * A query string, an iterable of name-value pairs, or an object.
     * @param onUpdate - 集合变化时使用序列化后的查询字符串调用。<br />
     * Called with the serialized query whenever the collection changes.
     */
    constructor(params, onUpdate) {
        switch (typeof params) {
            case "string": {
                if (params.length === 0)
                    break;
                if (params.startsWith("?"))
                    params = params.slice(1);
                const pairs = params.split("&").map(pair => {
                    const separator = pair.indexOf("=");
                    return separator < 0 ? [pair, ""] : [pair.slice(0, separator), pair.slice(separator + 1)];
                });
                pairs.forEach(([key, value]) => {
                    this.#params.push(key ? this.#decodeQueryComponent(key) : key);
                    this.#values.push(this.#decodeQueryComponent(value));
                });
                break;
            }
            case "object":
                if (Array.isArray(params)) {
                    Object.entries(params).forEach(([key, value]) => {
                        this.#params.push(key);
                        this.#values.push(value);
                    });
                }
                else if (Symbol.iterator in Object(params)) {
                    for (const [key, value] of params) {
                        this.#params.push(key);
                        this.#values.push(value);
                    }
                }
                break;
        }
        this.#updateSearchString(this.#params, this.#values);
        this.#onUpdate = onUpdate;
    }
    // Create 2 seperate arrays for the params and values to make management and lookup easier.
    #param = "";
    #params = [];
    #values = [];
    #onUpdate;
    #decodeQueryComponent(str) {
        return decodeURIComponent(str.replace(/\+/g, " "));
    }
    #encodeQueryComponent(str) {
        return encodeURIComponent(str)
            .replace(/%20/g, "+")
            .replace(/[!'()~]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
    }
    // Update the search property of the URL instance with the new params and values.
    #updateSearchString(params, values) {
        if (params.length === 0)
            this.#param = "";
        else
            this.#param = params
                .map((param, index) => {
                switch (typeof values[index]) {
                    case "object":
                        return `${this.#encodeQueryComponent(param)}=${this.#encodeQueryComponent(JSON.stringify(values[index]))}`;
                    case "boolean":
                    case "number":
                    case "string":
                        return `${this.#encodeQueryComponent(param)}=${this.#encodeQueryComponent(values[index])}`;
                    case "undefined":
                    default:
                        return this.#encodeQueryComponent(param);
                }
            })
                .join("&");
        this.#onUpdate?.(this.#param);
    }
    /**
     * 追加一组新的名称与值。
     *
     * Appends a new name-value pair.
     *
     * @param name - 参数名称。<br />
     * The parameter name.
     * @param value - 参数值。<br />
     * The parameter value.
     */
    append(name, value) {
        this.#params.push(name);
        this.#values.push(value);
        this.#updateSearchString(this.#params, this.#values);
    }
    /**
     * 删除所有使用指定名称的参数对。
     *
     * Removes all pairs with the supplied name.
     *
     * @param name - 要删除的参数名称。<br />
     * The parameter name to remove.
     * @param value - 为兼容性保留；目前会删除所有名称匹配的参数。<br />
     * Reserved for compatibility; currently all matching names are removed.
     */
    delete(name, value) {
        while (this.#params.indexOf(name) > -1) {
            this.#values.splice(this.#params.indexOf(name), 1);
            this.#params.splice(this.#params.indexOf(name), 1);
        }
        this.#updateSearchString(this.#params, this.#values);
    }
    /**
     * 按插入顺序返回名称与值组成的参数对。
     *
     * Returns the name-value pairs in insertion order.
     *
     * @returns 参数对数组。<br />
     * An array of parameter pairs.
     */
    entries() {
        return this.#params.map((param, index) => [param, this.#values[index]]);
    }
    /**
     * 返回与指定名称关联的第一个值。
     *
     * Returns the first value associated with a name.
     *
     * @param name - 要查找的参数名称。<br />
     * The parameter name to find.
     * @returns 第一个匹配值；不存在时返回 `undefined`。<br />
     * The first matching value, or `undefined` when absent.
     */
    get(name) {
        return this.#values[this.#params.indexOf(name)];
    }
    /**
     * 返回与指定名称关联的所有值。
     *
     * Returns every value associated with a name.
     *
     * @param name - 要查找的参数名称。<br />
     * The parameter name to find.
     * @returns 按插入顺序排列的匹配值。<br />
     * The matching values in insertion order.
     */
    getAll(name) {
        return this.#values.filter((value, index) => this.#params[index] === name);
    }
    /**
     * 检查指定参数名称是否存在。
     *
     * Tests whether a parameter name exists.
     *
     * @param name - 要查找的参数名称。<br />
     * The parameter name to find.
     * @param value - 为兼容性保留；目前只检查名称。<br />
     * Reserved for compatibility; currently only the name is tested.
     */
    has(name, value) {
        return this.#params.indexOf(name) > -1;
    }
    /**
     * 按插入顺序返回参数名称。<br />
     * Returns the parameter names in insertion order.
     */
    keys() {
        return this.#params;
    }
    /**
     * 设置指定名称的值，并删除该名称对应的其他参数对。
     *
     * Sets the value for a name and removes any additional pairs with that name.
     *
     * @param name - 要设置的参数名称。<br />
     * The parameter name to set.
     * @param value - 替换后的值。<br />
     * The replacement value.
     */
    set(name, value) {
        if (this.#params.indexOf(name) === -1) {
            this.append(name, value); // If the given param doesn't already exist, append it.
        }
        else {
            let first = true;
            const newValues = [];
            // If the param already exists, change the value of the first occurance and remove any remaining occurances.
            this.#params = this.#params.filter((currentParam, index) => {
                if (currentParam !== name) {
                    newValues.push(this.#values[index]);
                    return true;
                    // If the currentParam matches the one being changed and it's the first one, keep the param and change its value to the given one.
                }
                else if (first) {
                    first = false;
                    newValues.push(value);
                    return true;
                }
                // If the currentParam matches the one being changed, but it's not the first, remove it.
                return false;
            });
            this.#values = newValues;
            this.#updateSearchString(this.#params, this.#values);
        }
    }
    /**
     * 按字典序排列所有名称与值组成的参数对。<br />
     * Sorts all name-value pairs lexicographically.
     */
    sort() {
        // Call entries to make sorting easier, then rewrite the params and values in the new order.
        const sortedPairs = this.entries().sort();
        this.#params = [];
        this.#values = [];
        sortedPairs.forEach(pair => {
            this.#params.push(pair[0]);
            this.#values.push(pair[1]);
        });
        this.#updateSearchString(this.#params, this.#values);
    }
    /**
     * 返回不含开头 `?` 的序列化查询字符串。<br />
     * Returns the serialized query string without a leading `?`.
     */
    toString = () => this.#param;
    /**
     * 返回按插入顺序遍历参数值的迭代器。<br />
     * Returns an iterator over parameter values in insertion order.
     */
    values = () => this.#values.values();
}
