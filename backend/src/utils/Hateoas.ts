export interface HateoasLink {
	href: string;
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export interface HateoasOptions {
	update?: boolean;
	delete?: boolean;
	related?: Record<string, HateoasLink>;
}

export type HateoasLinks = Record<string, HateoasLink>;

export type HateoasResource<T> = T & {
	_links: HateoasLinks;
};

export interface HateoasCollection<T> {
	items: Array<HateoasResource<T>>;
	_links: HateoasLinks;
}

class Hateoas {
	static collection(resource: string): HateoasLinks {
		return {
			self: { href: `/api/v1/${resource}` },
			create: { href: `/api/v1/${resource}`, method: "POST" },
		};
	}

	static resource(resource: string, id: number, options: HateoasOptions = {}): HateoasLinks {
		const href = `/api/v1/${resource}/${id}`;
		const links: HateoasLinks = {
			self: { href },
			collection: { href: `/api/v1/${resource}` },
		};

		if (options.update !== false) {
			links.update = { href, method: "PUT" };
		}

		if (options.delete !== false) {
			links.delete = { href, method: "DELETE" };
		}

		return { ...links, ...options.related };
	}

	static item<T extends { id: number }>(
		data: T,
		resource: string,
		id: number,
		options: HateoasOptions = {},
	): HateoasResource<T> {
		return { ...data, _links: this.resource(resource, id, options) };
	}

	static list<T extends { id: number }>(items: T[], resource: string): HateoasCollection<T> {
		return {
			items: items.map((item) => this.item(item, resource, item.id)),
			_links: this.collection(resource),
		};
	}
}

module.exports = Hateoas;
