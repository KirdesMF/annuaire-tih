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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", path);
    formData.append("resource_type", "auto");
    formData.append("public_id", `${companyId}-${Date.now()}`);
    formData.append("upload_preset", "annuaire-tih");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = (await res.json()) as UploadApiResponse;

    return data;
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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("public_id", publicId);
    formData.append("overwrite", "true");
    formData.append("upload_preset", "annuaire-tih");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = (await res.json()) as UploadApiResponse;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update image in Cloudinary");
  }
}

//https://res.cloudinary.com/kirdes/image/upload/v1745353041/companies/kirdescorp-q1dBykLgOa/logo/L0xU7rCdIiwyOjHD_uGmtQPuXwq28qnd-1745019806996.jpg

export async function deleteImageFromCloudinary(publicId: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?public_ids[]=${encodeURIComponent(publicId)}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return await res.json();
}

export async function deleteCompanyFromCloudinary(slug: string) {
  try {
    const path = `companies/${slug}`;
    // delete all images in the company folder
    await cloudinary.api.delete_resources_by_prefix(path);

    // delete subfolders
    await cloudinary.api.delete_folder(`${path}/gallery`);
    await cloudinary.api.delete_folder(`${path}/logo`);

    // delete the company folder
    await cloudinary.api.delete_folder(path);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete images from Cloudinary", { cause: error });
  }
}

export async function deleteFoldersAndContents(folderPaths: string[]) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  for (const folderPath of folderPaths) {
    // 1. Delete all resources in the folder
    const deleteResourcesUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${encodeURIComponent(folderPath)}`;
    await fetch(deleteResourcesUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
      },
    });

    // 2. Delete the folder itself
    const deleteFolderUrl = `https://api.cloudinary.com/v1_1/${cloudName}/folders/${folderPath}`;
    await fetch(deleteFolderUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
      },
    });
  }
}
