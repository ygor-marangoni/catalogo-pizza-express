class Additional {
	constructor(
		id,
		name,
		description,
		price,
		created_at,
		updated_at,
		deleted_at,
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price; // em centavos
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.deleted_at = deleted_at;
	}
}

module.exports = Additional;