class Product {
	constructor(
		id,
		name,
		description,
		category_id,
		base_price,
		image_url,
		available,
		highlighted,
		created_at,
		updated_at,
		deleted_at,
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.category_id = category_id;
		this.base_price = base_price; // em centavos
		this.image_url = image_url;
		this.available = available;
		this.highlighted = highlighted;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.deleted_at = deleted_at;
	}
}

module.exports = Product;