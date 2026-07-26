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
		delivery_fee: nonNegativeInteger.optional(),
		min_order_value: nonNegativeInteger.optional(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Informe ao menos um campo para atualização",
	});
export const storeStatusSchema = z.object({ is_open: z.boolean() }).strict();

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
