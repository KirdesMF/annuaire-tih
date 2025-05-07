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

type UploadImageToCloudinaryProps = {
  type: "logo" | "gallery";
  file: File;
  companyId: string;
  companySlug: string;
};

export async function uploadImageToCloudinary({
  type,
  file,
  companyId,
  companySlug,
}: UploadImageToCloudinaryProps) {
  const path =
    type === "logo" ? `companies/${companySlug}/logo` : `companies/${companySlug}/gallery`;

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
    throw new Error("Failed to upload image to Cloudinary", { cause: error });
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
    throw new Error("Failed to update image in Cloudinary", { cause: error });
  }
}

//https://res.cloudinary.com/kirdes/image/upload/v1745353041/companies/kirdescorp-q1dBykLgOa/logo/L0xU7rCdIiwyOjHD_uGmtQPuXwq28qnd-1745019806996.jpg

export async function deleteImageFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete image from Cloudinary");
  }
}

export async function deleteCompanyFromCloudinary(slug: string) {
  try {
    const path = `companies/${slug}`;
    // delete all images in the company folder
    await cloudinary.api.delete_resources_by_prefix(path);

    // check if the logo folder exists
    const logoFolder = await cloudinary.api.resources({
      type: "upload",
      prefix: `${path}/logo`,
    });

    if (logoFolder.length > 0) {
      await cloudinary.api.delete_folder(`${path}/logo`);
    }

    // check if the gallery folder exists
    const galleryFolder = await cloudinary.api.resources({
      type: "upload",
      prefix: `${path}/gallery`,
    });

    if (galleryFolder.length > 0) {
      await cloudinary.api.delete_folder(`${path}/gallery`);
    }

    // delete the company folder
    await cloudinary.api.delete_folder(path);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete images from Cloudinary", { cause: error });
  }
}
