import { z } from "zod";

// Define os formatos aceitos pelas entradas principais da API.
const positiveInteger = z.number().int().positive();
const nonNegativeInteger = z.number().int().nonnegative();

export const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) }).strict();
export const registerUserSchema = z
	.object({
		name: z.string().trim().min(2).max(120),
		email: z.string().trim().email(),
		password: z.string().min(8).max(128),
	})
	.strict();
export const updateUserSchema = z
	.object({
		name: z.string().trim().min(2).max(120).optional(),
		email: z.string().trim().email().optional(),
		password: z.string().min(8).max(128).optional(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Informe ao menos um campo para atualização",
	});
export const favoriteSchema = z.object({ product_id: positiveInteger }).strict();
export const orderSchema = z
	.object({
		items: z
			.array(z.object({
				product_id: positiveInteger,
				quantity: positiveInteger,
				size_id: positiveInteger.optional(),
				edge_id: positiveInteger.nullable().optional(),
				additional_ids: z.array(positiveInteger).max(50).optional(),
				note: z.string().max(300).optional(),
			}).strict())
			.min(1)
			.max(50),
	})
	.strict();
export const categoryCreateSchema = z
	.object({
		name: z.string().trim().min(1).max(120),
		description: z.string().nullable().optional(),
		icon_url: z.string().url().nullable().optional(),
	})
	.strict();
export const categoryUpdateSchema = categoryCreateSchema.partial().refine((data) => Object.keys(data).length > 0, {
	message: "Informe ao menos um campo para atualização",
});
export const productCreateSchema = z
	.object({
		name: z.string().trim().min(1).max(160),
		description: z.string().nullable().optional(),
		category_id: positiveInteger,
		base_price: nonNegativeInteger,
		image_url: z.string().url().nullable().optional(),
		available: z.boolean().optional(),
		highlighted: z.boolean().optional(),
		size_ids: z.array(positiveInteger).max(20).optional(),
		edge_ids: z.array(positiveInteger).max(20).optional(),
		additional_ids: z.array(positiveInteger).max(50).optional(),
	})
	.strict();
export const productUpdateSchema = productCreateSchema.partial().refine((data) => Object.keys(data).length > 0, {
	message: "Informe ao menos um campo para atualização",
});
const productSizeConfigurationSchema = z.object({
	size_id: positiveInteger,
	price: nonNegativeInteger,
	is_default: z.boolean(),
	available: z.boolean(),
}).strict();
const productEdgeConfigurationSchema = z.object({
	edge_id: positiveInteger,
	price_override: nonNegativeInteger.nullable().optional(),
	available: z.boolean(),
}).strict();
const productAdditionalConfigurationSchema = z.object({
	additional_id: positiveInteger,
	price_override: nonNegativeInteger.nullable().optional(),
	available: z.boolean(),
}).strict();
export const productConfigurationSchema = z.object({
	sizes: z.array(productSizeConfigurationSchema).max(50),
	edges: z.array(productEdgeConfigurationSchema).max(100),
	additionals: z.array(productAdditionalConfigurationSchema).max(100),
}).strict()
	.refine((data) => new Set(data.sizes.map((item) => item.size_id)).size === data.sizes.length, {
		message: "Não repita tamanhos na configuração", path: ["sizes"],
	})
	.refine((data) => new Set(data.edges.map((item) => item.edge_id)).size === data.edges.length, {
		message: "Não repita bordas na configuração", path: ["edges"],
	})
	.refine((data) => new Set(data.additionals.map((item) => item.additional_id)).size === data.additionals.length, {
		message: "Não repita adicionais na configuração", path: ["additionals"],
	})
	.refine((data) => data.sizes.length === 0 || data.sizes.filter((item) => item.is_default).length === 1, {
		message: "Selecione exatamente um tamanho padrão", path: ["sizes"],
	})
	.refine((data) => data.sizes.length === 0 || data.sizes.some((item) => item.available), {
		message: "Mantenha ao menos um tamanho disponível", path: ["sizes"],
	})
	.refine((data) => data.sizes.length === 0 || data.sizes.some((item) => item.is_default && item.available), {
		message: "O tamanho padrão precisa estar disponível", path: ["sizes"],
	});
export const orderStatusSchema = z
	.object({
		status: z.enum(["PENDING", "PREPARING", "DELIVERED", "CANCELLED"]),
	})
	.strict();
export const storeUpdateSchema = z
	.object({
		name: z.string().trim().min(1).max(160).optional(),
		description: z.string().nullable().optional(),
		phone: z.string().max(40).nullable().optional(),
		email: z.string().email().nullable().optional(),
		address: z.string().nullable().optional(),
		opening_hours: z.string().nullable().optional(),
		estimated_time: z.string().max(40).nullable().optional(),
		delivery_fee: nonNegativeInteger.optional(),
		min_order_value: nonNegativeInteger.optional(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Informe ao menos um campo para atualização",
	});
export const storeStatusSchema = z.object({ is_open: z.boolean() }).strict();
const couponBaseSchema = z.object({
	code: z.string().trim().min(2, "O código do cupom deve ter pelo menos 2 caracteres").max(40, "O código do cupom deve ter no máximo 40 caracteres"),
	description: z.string().max(240).nullable().optional(),
	discount_type: z.enum(["PERCENTAGE", "FIXED"]),
	discount_value: z.number().int().positive(),
	min_order_value: z.number().int().nonnegative().optional(),
	active: z.boolean().optional(),
	expires_at: z.string().datetime().nullable().optional(),
}).strict();
export const couponSchema = couponBaseSchema.refine((data) => data.discount_type !== "PERCENTAGE" || data.discount_value <= 100, {
	message: "O desconto percentual não pode ser maior que 100",
	path: ["discount_value"],
});
export const couponUpdateSchema = couponBaseSchema.partial()
	.refine((data) => Object.keys(data).length > 0, { message: "Informe ao menos um campo para atualização" })
	.refine((data) => data.discount_type !== "PERCENTAGE" || data.discount_value === undefined || data.discount_value <= 100, {
		message: "O desconto percentual não pode ser maior que 100",
		path: ["discount_value"],
	});
export const couponValidationSchema = z.object({
	code: z.string().trim().min(2, "O código do cupom deve ter pelo menos 2 caracteres").max(40, "O código do cupom deve ter no máximo 40 caracteres"),
	subtotal: z.number().int().nonnegative(),
}).strict();

export const validationSchemas = {
	loginSchema,
	registerUserSchema,
	updateUserSchema,
	favoriteSchema,
	orderSchema,
	categoryCreateSchema,
	categoryUpdateSchema,
	productCreateSchema,
	productUpdateSchema,
	orderStatusSchema,
};
