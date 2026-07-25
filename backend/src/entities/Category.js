class Category {
	constructor(
		id,
		name,
		description,
		icon_url,
		created_at,
		updated_at,
		deleted_at,
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.icon_url = icon_url;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.deleted_at = deleted_at;
	}
}

module.exports = Category;