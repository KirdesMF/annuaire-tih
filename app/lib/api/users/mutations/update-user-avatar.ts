import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import * as v from "valibot";
import { auth } from "~/lib/auth/auth.server";
import { uploadImageToCloudinary } from "~/lib/cloudinary";

const AvatarSchema = v.pipe(
  v.instance(File, "Veuillez sélectionner une image"),
  v.mimeType(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
  v.maxSize(1024 * 1024 * 2, "La taille du fichier doit être inférieure à 2MB"),
);

const UpdateUserAvatarSchema = v.object({
  avatar: AvatarSchema,
});

export const updateUserAvatar = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    const avatar = data.get("avatar");

    return v.parse(UpdateUserAvatarSchema, {
      avatar:
        avatar instanceof File && avatar.size > 0
          ? avatar
          : "",
    });
  })
  .handler(async ({ data }) => {
    const request = getRequest();
    const session = await auth().api.getSession({ headers: request.headers });

    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    const result = await uploadImageToCloudinary({
      type: "avatar",
      file: data.avatar,
      userId: session.user.id,
    });

    await auth().api.updateUser({
      headers: request.headers,
      body: {
        image: result.secure_url,
      },
    });

    return { image: result.secure_url };
  });
