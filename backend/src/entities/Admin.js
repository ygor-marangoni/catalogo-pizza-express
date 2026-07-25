class Admin {
	constructor(
		id,
		name,
		email,
		password_hash,
		last_login,
		created_at,
		updated_at,
		deleted_at,
	) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.password_hash = password_hash;
		this.last_login = last_login;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.deleted_at = deleted_at;
	}
}

module.exports = Admin;