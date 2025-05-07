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

const options = {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// generate signature for cloudinary upload
async function generateSignature(params: Record<string, unknown>, secret: string) {
  const paramsString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const signature = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(paramsString + secret),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function uploadImageToCloudinary({
  type,
  file,
  companyId,
  companySlug,
}: UploadImageToCloudinaryProps): Promise<UploadApiResponse> {
  if (!options.name || !options.api_key || !options.api_secret) {
    throw new Error("Cloudinary credentials are not set");
  }

  const publicId = `${companyId}-${Date.now()}`;
  const path =
    type === "logo" ? `companies/${companySlug}/logo` : `companies/${companySlug}/gallery`;

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", options.api_key);
    formData.append("folder", path);
    formData.append("public_id", publicId);

    const timestamp = Math.floor(Date.now() / 1000);
    formData.append("timestamp", timestamp.toString());

    // generate signature
    const params = {
      timestamp: timestamp,
      folder: path,
      public_id: publicId,
    };

    const signature = await generateSignature(params, options.api_secret);
    formData.append("signature", signature);

    // make the request to cloudinary
    const url = `https://api.cloudinary.com/v1_1/${options.name}/upload`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to upload image to Cloudinary: ${errorData.error.message}`);
    }

    const result = await response.json();

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload image to Cloudinary", { cause: error });
  }
}

export async function updateImageInCloudinary({
  file,
  publicId,
}: { file: File; publicId: string }) {
  if (!options.name || !options.api_key || !options.api_secret) {
    throw new Error("Cloudinary credentials are not set");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", options.api_key);
    formData.append("public_id", publicId);
    formData.append("overwrite", "true");
    formData.append("invalidate", "true");

    const timestamp = Math.floor(Date.now() / 1000);
    formData.append("timestamp", timestamp.toString());

    // generate signature
    const params = {
      timestamp: timestamp,
      public_id: publicId,
      overwrite: "true",
      invalidate: "true",
    };

    const signature = await generateSignature(params, options.api_secret);
    formData.append("signature", signature);

    // make the request to cloudinary
    const url = `https://api.cloudinary.com/v1_1/${options.name}/upload`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update image in Cloudinary: ${errorData.error.message}`);
    }

    const result = await response.json();

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update image in Cloudinary", { cause: error });
  }
}

export async function deleteImageFromCloudinary(publicId: string) {
  if (!options.name || !options.api_key || !options.api_secret) {
    throw new Error("Cloudinary credentials are not set");
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);

    const params = {
      timestamp: timestamp,
      public_id: publicId,
    };

    const signature = await generateSignature(params, options.api_secret);

    const formData = new FormData();
    formData.append("api_key", options.api_key);
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    // Make the request
    const response = await fetch(`https://api.cloudinary.com/v1_1/${options.name}/image/destroy`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Cloudinary API delete image error: ${errorData.error?.message || "Unknown error"}`,
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete image from Cloudinary", { cause: error });
  }
}

export async function deleteCompanyFromCloudinary(slug: string) {
  if (!options.name || !options.api_key || !options.api_secret) {
    throw new Error("Cloudinary credentials are not set");
  }

  try {
    const path = `companies/${slug}`;

    // list all resources in path
    const url = new URL(`https://api.cloudinary.com/v1_1/${options.name}/resources/image/upload`);
    url.searchParams.set("prefix", path);

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${options.api_key}:${options.api_secret}`).toString("base64")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Cloudinary API get resources error: ${errorData.error?.message || "Unknown error"}`,
      );
    }

    // delete all resources
    const result = (await response.json()) as { resources: { public_id: string }[] };
    const publicIds = result.resources.map((resource) => resource.public_id);

    if (result.resources.length > 0) {
      const url = new URL(`https://api.cloudinary.com/v1_1/${options.name}/resources/image/upload`);
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(`${options.api_key}:${options.api_secret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: publicIds.map((id) => `public_ids[]=${id}`).join("&"),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Cloudinary API delete resources error: ${errorData.error?.message || "Unknown error"}`,
        );
      }

      const result = await response.json();
      console.log("Deleted resources:", result);
    }

    // delete the folder
    const folders = [`${path}/logo`, `${path}/gallery`, path];
    await Promise.all(
      folders.map(async (folder) => {
        const folderURL = new URL(
          `https://api.cloudinary.com/v1_1/${options.name}/folders/${folder}`,
        );

        const response = await fetch(folderURL, {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${Buffer.from(`${options.api_key}:${options.api_secret}`).toString("base64")}`,
          },
        });

        console.log("Deleted folder:", folder);

        // if the folder is not found, it's ok
        if (!response.ok && response.status !== 404) {
          const errorData = await response.json();
          throw new Error(
            `Cloudinary API delete folder error: ${errorData.error?.message || "Unknown error"} from ${folderURL}`,
          );
        }
      }),
    );
  } catch (error) {
    console.error("Failed to delete images from Cloudinary", { cause: error });
    throw new Error("Failed to delete images from Cloudinary", { cause: error });
  }
}
