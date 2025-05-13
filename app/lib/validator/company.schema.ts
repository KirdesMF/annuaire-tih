import * as v from "valibot";
import { COMPANY_WORK_MODES } from "~/db/schema/companies";

export const LogoCompanySchema = v.object({
  companyId: v.string(),
  logo_public_id: v.optional(v.string()),
  logo: v.optional(
    v.pipe(
      v.instance(File),
      v.mimeType(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
      v.maxSize(1024 * 1024 * 3, "La taille du fichier doit être inférieure à 3MB"),
    ),
  ),
});

export const GalleryCompanySchema = v.object({
  companyId: v.string(),
  gallery_public_id: v.optional(v.array(v.string())),
  gallery: v.optional(
    v.pipe(v.array(v.instance(File)), v.maxLength(2, "Veuillez entrer au plus 2 images")),
  ),
});

export const CompanyInfosSchema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty("Veuillez entrer le nom de l'entreprise"),
    v.maxLength(255, "Le nom de l'entreprise doit contenir au plus 255 caractères"),
  ),
  siret: v.pipe(
    v.string(),
    v.nonEmpty("Veuillez entrer le siret de l'entreprise"),
    v.length(14, "Le siret de l'entreprise doit contenir 14 caractères"),
  ),
  categories: v.pipe(
    v.array(v.string()),
    v.minLength(1, "Veuillez sélectionner au moins une catégorie"),
    v.maxLength(3, "Veuillez sélectionner au plus 3 catégories"),
  ),
  business_owner: v.union([
    v.literal(""),
    v.pipe(
      v.string(),
      v.nonEmpty("Veuillez entrer le nom du responsable de l'entreprise"),
      v.maxLength(
        255,
        "Le nom du responsable de l'entreprise doit contenir au plus 255 caractères",
      ),
    ),
  ]),
  description: v.union([
    v.literal(""),
    v.pipe(
      v.string(),
      v.maxLength(1500, "La description de l'entreprise doit contenir au plus 1500 caractères"),
    ),
  ]),
  website: v.union([
    v.literal(""),
    v.pipe(v.string(), v.url("Veuillez entrer une url de site web valide")),
  ]),
  location: v.optional(
    v.union([
      v.literal(""),
      v.pipe(v.string(), v.maxLength(255, "La localisation doit contenir au plus 255 caractères")),
    ]),
  ),
  service_area: v.union([
    v.literal(""),
    v.pipe(v.string(), v.maxLength(255, "La zone de service doit contenir au plus 255 caractères")),
  ]),
  subdomain: v.union([
    v.literal(""),
    v.pipe(v.string(), v.maxLength(100, "Le sous-domaine doit contenir au plus 100 caractères")),
  ]),
  email: v.union([
    v.literal(""),
    v.pipe(v.string(), v.email("Veuillez entrer une adresse email valide")),
  ]),
  phone: v.union([
    v.literal(""),
    v.pipe(
      v.string(),
      v.maxLength(24, "Le numéro de téléphone doit contenir au plus 24 caractères"),
    ),
  ]),
  work_mode: v.nullable(v.picklist(COMPANY_WORK_MODES)),
  rqth: v.optional(v.boolean()),
  social_media: v.optional(
    v.object({
      facebook: v.optional(
        v.pipe(
          v.string(),
          v.url("Veuillez entrer une url facebook valide"),
          v.includes("facebook", "Veuillez entrer une url facebook valide"),
        ),
      ),
      instagram: v.optional(
        v.pipe(
          v.string(),
          v.url("Veuillez entrer une url instagram valide"),
          v.includes("instagram", "Veuillez entrer une url instagram valide"),
        ),
      ),
      linkedin: v.optional(
        v.pipe(
          v.string(),
          v.url("Veuillez entrer une url linkedin valide"),
          v.includes("linkedin", "Veuillez entrer une url linkedin valide"),
        ),
      ),
      calendly: v.optional(
        v.pipe(
          v.string(),
          v.url("Veuillez entrer une url calendly valide"),
          v.includes("calendly", "Veuillez entrer une url calendly valide"),
        ),
      ),
      youtube: v.optional(
        v.pipe(
          v.string(),
          v.url("Veuillez entrer une url youtube valide"),
          v.includes("youtube", "Veuillez entrer une url youtube valide"),
        ),
      ),
      tiktok: v.optional(
        v.pipe(
          v.string(),
          v.url("Veuillez entrer une url tiktok valide"),
          v.includes("tiktok", "Veuillez entrer une url tiktok valide"),
        ),
      ),
      twitter: v.optional(
        v.pipe(
          v.string(),
          v.url("Veuillez entrer une url valide"),
          v.includes("twitter", "Veuillez entrer une url twitter valide"),
        ),
      ),
      spotify: v.optional(
        v.pipe(
          v.string(),
          v.url("Veuillez entrer une url valide"),
          v.includes("spotify", "Veuillez entrer une url spotify valide"),
        ),
      ),
    }),
  ),
});

export const CompanyMediaSchema = v.object({
  logo: v.optional(
    v.pipe(
      v.instance(File),
      v.mimeType(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
      v.maxSize(1024 * 1024 * 3, "La taille du fichier doit être inférieure à 3MB"),
    ),
  ),
  gallery: v.optional(
    v.pipe(
      v.array(
        v.optional(
          v.pipe(
            v.instance(File),
            v.mimeType(["image/png", "image/jpeg", "image/jpg", "image/webp"]),
            v.maxSize(1024 * 1024 * 2, "La taille du fichier doit être inférieure à 2MB"),
          ),
        ),
      ),
      v.maxLength(2, "Veuillez entrer au plus 2 images"),
    ),
  ),
});

export const CreateCompanySchema = v.object({
  user_id: v.string(),
  ...CompanyInfosSchema.entries,
  ...CompanyMediaSchema.entries,
});

export const UpdateCompanyInfosSchema = v.object({
  companyId: v.string(),
  ...CompanyInfosSchema.entries,
});

export const UpdateCompanyMediaSchema = v.object({
  companyId: v.string(),
  logo_public_id: v.optional(v.string()),
  gallery_public_id: v.optional(v.array(v.string())),
  ...CompanyMediaSchema.entries,
});

export type CreateCompanyData = v.InferOutput<typeof CreateCompanySchema>;
export type UpdateCompanyInfosData = v.InferOutput<typeof UpdateCompanyInfosSchema>;
export type UpdateCompanyMediaData = v.InferOutput<typeof UpdateCompanyMediaSchema>;
