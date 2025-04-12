import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadCompanyImageProps = {
	companyId: string;
	file: string;
	type: "logo" | "gallery";
};

export async function uploadCompanyImage(props: UploadCompanyImageProps) {
	const path =
		props.type === "logo"
			? `companies/${props.companyId}/logo`
			: `companies/${props.companyId}/gallery`;

	try {
		const res = await cloudinary.uploader.upload(props.file, {
			folder: path,
			resource_type: "auto",
			public_id: `${props.companyId}-${props.type}`,
			allowed_formats: ["jpg", "png", "jpeg"],
		});

		return {
			secure_url: res.secure_url,
			public_id: res.public_id,
		};
	} catch (error) {
		console.error(error);
		throw new Error("Failed to upload image to Cloudinary");
	}
}

export async function updateCompanyImage(props: {
	file: string;
	publicId: string;
}) {
	try {
		const res = await cloudinary.uploader.upload(props.file, {
			public_id: props.publicId,
			overwrite: true,
			invalidate: true,
			allowed_formats: ["jpg", "png", "jpeg"],
		});

		return {
			secure_url: res.secure_url,
			public_id: res.public_id,
		};
	} catch (error) {
		console.error(error);
		throw new Error("Failed to update image in Cloudinary");
	}
}

export async function deleteCompanyImage(publicId: string) {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to delete image from Cloudinary");
	}
}

export async function deleteAllCompanyImages(companyId: string) {
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
