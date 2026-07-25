import multer from "multer";

export const productImageUpload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, callback) => {
		if (file.mimetype.startsWith("image/")) return callback(null, true);
		callback(new Error("INVALID_IMAGE"));
	},
}).single("image");

export function normalizeProductMultipart(req, _res, next): void {
	if (!req.is("multipart/form-data")) return next();
	for (const field of ["category_id", "base_price"])
		if (req.body[field] !== undefined) req.body[field] = Number(req.body[field]);
	for (const field of ["available", "highlighted"]) {
		if (req.body[field] === "true") req.body[field] = true;
		if (req.body[field] === "false") req.body[field] = false;
	}
	next();
}
