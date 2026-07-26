const categories = [
	["Pizzas tradicionais", "Sabores clássicos da casa"],
	["Pizzas especiais", "Combinações especiais da Pizza Express"],
	["Pizzas vegetarianas", "Opções com ingredientes frescos"],
	["Pizzas premium", "Ingredientes selecionados e sabores sofisticados"],
	["Pizzas doces", "Pizzas doces para finalizar a refeição"],
	["Lanches", "Lanches artesanais preparados na hora"],
	["Porções", "Porções para compartilhar"],
	["Bebidas", "Bebidas geladas para acompanhar"],
].map(([name, description]) => ({ name, description }));

const productBases = [
	["Margherita", "Molho de tomate, muçarela e manjericão", 3500],
	["Calabresa", "Calabresa, cebola e muçarela", 3800],
	["Portuguesa", "Presunto, ovos, cebola, ervilha e muçarela", 4200],
	["Frango com Catupiry", "Frango desfiado, milho e Catupiry", 4400],
	["Quatro Queijos", "Muçarela, provolone, parmesão e gorgonzola", 4600],
	["Bacon", "Bacon crocante, cebola e muçarela", 4300],
	["Pepperoni", "Pepperoni artesanal e muçarela", 4500],
];

const products = categories.flatMap((category, categoryIndex) =>
	productBases.map(([name, description, base_price], productIndex) => ({
		name: `${name} ${categoryIndex + 1}`,
		description,
		base_price: base_price + categoryIndex * 300 + productIndex * 100,
		highlighted: (categoryIndex + productIndex) % 5 === 0,
		category_name: category.name,
	})),
);

module.exports = {
	admin: { name: "Administrador", email: "admin@pizzaexpress.com", password: "Admin@123" },
	customers: Array.from({ length: 12 }, (_, index) => ({
		name: index === 0 ? "Cliente Demo" : `Cliente Mock ${String(index + 1).padStart(2, "0")}`,
		email: index === 0 ? "cliente@pizzaexpress.com" : `cliente${index + 1}@pizzaexpress.com`,
		password: "Cliente@123",
	})),
	store: { id: 1, name: "Pizza Express", description: "Loja principal da Pizza Express", opening_hours: "18:00 às 23:00", delivery_fee: 700, min_order_value: 2000 },
	categories,
	products,
	sizes: [
		{ name: "Individual", code: "SMALL", description: "Até 1 sabor", additional_price: 0 },
		{ name: "Média", code: "MEDIUM", description: "Até 2 sabores", additional_price: 0 },
		{ name: "Grande", code: "LARGE", description: "Até 3 sabores", additional_price: 1000 },
		{ name: "Família", code: "FAMILY", description: "Até 4 sabores", additional_price: 2200 },
	],
	edges: [
		{ name: "Catupiry", description: "Borda recheada com Catupiry", additional_price: 800 },
		{ name: "Cheddar", description: "Borda recheada com cheddar", additional_price: 800 },
		{ name: "Chocolate", description: "Borda doce de chocolate", additional_price: 1000 },
		{ name: "Cream cheese", description: "Borda recheada com cream cheese", additional_price: 900 },
	],
	additionals: [
		{ name: "Bacon", description: "Porção extra de bacon", price: 700 },
		{ name: "Azeitona", description: "Porção extra de azeitona", price: 400 },
		{ name: "Milho", description: "Porção extra de milho", price: 300 },
		{ name: "Tomate seco", description: "Porção extra de tomate seco", price: 600 },
		{ name: "Frango", description: "Porção extra de frango desfiado", price: 800 },
		{ name: "Muçarela", description: "Porção extra de muçarela", price: 700 },
	],
};
