class Store {
	constructor(
		id,
		name,
		description,
		phone,
		email,
		address,
		opening_hours,
		is_open,
		delivery_fee,
		min_order_value,
		created_at,
		updated_at,
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.phone = phone;
		this.email = email;
		this.address = address;
		this.opening_hours = opening_hours;
		this.is_open = is_open;
		this.delivery_fee = delivery_fee; // em centavos
		this.min_order_value = min_order_value; // em centavos
		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}

module.exports = Store;