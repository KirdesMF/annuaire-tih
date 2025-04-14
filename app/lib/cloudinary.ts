import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadApiResponse = {
	secure_url: string;
	public_id: string;
};

export async function uploadImageToCloudinary({
	type,
	file,
	companyId,
	companyName,
}: { type: "logo" | "gallery"; file: File; companyId: string; companyName: string }) {
	const path =
		type === "logo" ? `companies/${companyName}/logo` : `companies/${companyName}/gallery`;

	try {
		const buffer = await file.arrayBuffer();
		const res = await new Promise<UploadApiResponse>((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						folder: path,
						resource_type: "auto",
						public_id: `${companyId}-${Date.now()}`,
						allowed_formats: ["jpg", "png", "jpeg", "webp"],
					},
					(error, result) => {
						if (error) reject(error);
						if (result) resolve({ secure_url: result.secure_url, public_id: result.public_id });
					},
				)
				.end(Buffer.from(buffer));
		});

		return res;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to upload image to Cloudinary");
	}
}

export async function updateImageInCloudinary({
	file,
	publicId,
}: { file: File; publicId: string }) {
	try {
		const buffer = await file.arrayBuffer();
		const res = await new Promise<UploadApiResponse>((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						public_id: publicId,
						overwrite: true,
						invalidate: true,
						allowed_formats: ["jpg", "png", "jpeg", "webp"],
					},
					(error, result) => {
						if (error) reject(error);
						if (result) resolve({ secure_url: result.secure_url, public_id: result.public_id });
					},
				)
				.end(Buffer.from(buffer));
		});

		return res;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to upload image to Cloudinary");
	}
}

export async function deleteImageFromCloudinary(publicId: string) {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to delete image from Cloudinary");
	}
}

export async function deleteCompanyFromCloudinary(companyId: string) {
	try {
		// delete all images in the company folder
		await cloudinary.api.delete_resources_by_prefix(`companies/${companyId}`);

		// delete the company folder
		await cloudinary.api.delete_folder(`companies/${companyId}`);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to delete images from Cloudinary");
	}
}
