/**
 * A URL query-string polyfill with `application/x-www-form-urlencoded`
 * parsing and serialization.
 */
export class URLSearchParams {
	/**
	 * Creates a query-parameter collection.
	 *
	 * @param params - A query string, an iterable of name-value pairs, or an object.
	 * @param onUpdate - Called with the serialized query whenever the collection changes.
	 */
	constructor(params?: string | Iterable<[string, string]> | object, onUpdate?: (search: string) => void) {
		switch (typeof params) {
			case "string": {
				if (params.length === 0) break;
				if (params.startsWith("?")) params = params.slice(1);
				const pairs: [string, string][] = params.split("&").map(pair => {
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
				} else if (Symbol.iterator in Object(params)) {
					for (const [key, value] of params as Iterable<[string, string]>) {
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
	#params: string[] = [];
	#values: string[] = [];
	#onUpdate?: (search: string) => void;

	#decodeQueryComponent(str: string): string {
		return decodeURIComponent(str.replace(/\+/g, " "));
	}

	#encodeQueryComponent(str: string): string {
		return encodeURIComponent(str)
			.replace(/%20/g, "+")
			.replace(/[!'()~]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
	}

	// Update the search property of the URL instance with the new params and values.
	#updateSearchString(params: string[], values: string[]) {
		if (params.length === 0) this.#param = "";
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
	 * Appends a new name-value pair.
	 *
	 * @param name - The parameter name.
	 * @param value - The parameter value.
	 */
	append(name: string, value: string): void {
		this.#params.push(name);
		this.#values.push(value);
		this.#updateSearchString(this.#params, this.#values);
	}

	/**
	 * Removes all pairs with the supplied name.
	 *
	 * @param name - The parameter name to remove.
	 * @param value - Reserved for compatibility; currently all matching names are removed.
	 */
	delete(name: string, value?: string): void {
		while (this.#params.indexOf(name) > -1) {
			this.#values.splice(this.#params.indexOf(name), 1);
			this.#params.splice(this.#params.indexOf(name), 1);
		}
		this.#updateSearchString(this.#params, this.#values);
	}

	/**
	 * Returns the name-value pairs in insertion order.
	 *
	 * @returns An array of parameter pairs.
	 */
	entries(): Array<[string, string]> {
		return this.#params.map((param, index) => [param, this.#values[index]]);
	}

	/**
	 * Returns the first value associated with a name.
	 *
	 * @param name - The parameter name to find.
	 * @returns The first matching value, or `undefined` when absent.
	 */
	get(name: string): string | undefined {
		return this.#values[this.#params.indexOf(name)];
	}

	/**
	 * Returns every value associated with a name.
	 *
	 * @param name - The parameter name to find.
	 * @returns The matching values in insertion order.
	 */
	getAll(name: string): Array<string> {
		return this.#values.filter((value, index) => this.#params[index] === name);
	}

	/**
	 * Tests whether a parameter name exists.
	 *
	 * @param name - The parameter name to find.
	 * @param value - Reserved for compatibility; currently only the name is tested.
	 */
	has(name: string, value?: string): boolean {
		return this.#params.indexOf(name) > -1;
	}

	/** Returns the parameter names in insertion order. */
	keys(): Array<string> {
		return this.#params;
	}

	/**
	 * Sets the value for a name and removes any additional pairs with that name.
	 *
	 * @param name - The parameter name to set.
	 * @param value - The replacement value.
	 */
	set(name: string, value: string): void {
		if (this.#params.indexOf(name) === -1) {
			this.append(name, value); // If the given param doesn't already exist, append it.
		} else {
			let first = true;
			const newValues: string[] = [];

			// If the param already exists, change the value of the first occurance and remove any remaining occurances.
			this.#params = this.#params.filter((currentParam, index) => {
				if (currentParam !== name) {
					newValues.push(this.#values[index]);
					return true;
					// If the currentParam matches the one being changed and it's the first one, keep the param and change its value to the given one.
				} else if (first) {
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

	/** Sorts all name-value pairs lexicographically. */
	sort(): void {
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

	/** Returns the serialized query string without a leading `?`. */
	toString = (): string => this.#param;

	/** Returns an iterator over parameter values in insertion order. */
	values = (): Iterator<string> => this.#values.values();
}
