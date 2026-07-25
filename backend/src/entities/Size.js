class Size {
	constructor(
		id,
		name,
		code,
		description,
		additional_price,
		created_at,
		updated_at,
		deleted_at,
	) {
		this.id = id;
		this.name = name;
		this.code = code; // ex: 'P', 'M', 'G'
		this.description = description;
		this.additional_price = additional_price; // em centavos
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.deleted_at = deleted_at;
	}
}

module.exports = Size;