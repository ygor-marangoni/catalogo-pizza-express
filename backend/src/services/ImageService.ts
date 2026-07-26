import { v2 as cloudinary } from "cloudinary";
import { ErrorCode } from "../entities/enums";
import { CircuitBreaker, Semaphore, withRetry, withTimeout } from "../utils/Resilience";

const configured = Boolean(
	process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
);
if (configured)
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

class ImageService {
	// Faz upload de imagens com proteção contra falhas e excesso de concorrência.
	private readonly breaker = new CircuitBreaker(3, 60000);
	private readonly bulkhead = new Semaphore(3);

	async upload(data: string | Buffer, mimetype = "image/jpeg", folder = "products"): Promise<string> {
		if (Buffer.isBuffer(data)) data = `data:${mimetype};base64,${data.toString("base64")}`;
		if (!data || (!data.startsWith("data:image/") && !data.startsWith("http://") && !data.startsWith("https://")))
			throw new Error(ErrorCode.INVALID_IMAGE);
		if (!configured) return data;
		if (data.startsWith("http://") || data.startsWith("https://")) return data;
		const result = await this.bulkhead.run(() =>
			this.breaker.execute(() =>
				withRetry(
					() =>
						withTimeout(
							cloudinary.uploader.upload(data, {
								folder: `pizza-express/${folder}`,
							}),
							15000,
						),
					2,
					250,
				),
			),
		);
		return result.secure_url;
	}
}

export = new ImageService();
