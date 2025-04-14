import * as v from "valibot";
import { COMPANY_WORK_MODES } from "~/db/schema/companies";

export const AddCompanySchema = v.object({
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
	business_owner: v.optional(
		v.pipe(
			v.string(),
			v.nonEmpty("Veuillez entrer le nom du responsable de l'entreprise"),
			v.maxLength(
				255,
				"Le nom du responsable de l'entreprise doit contenir au plus 255 caractères",
			),
		),
	),
	description: v.optional(
		v.pipe(
			v.string(),
			v.maxLength(1500, "La description de l'entreprise doit contenir au plus 1500 caractères"),
		),
	),
	website: v.optional(v.pipe(v.string(), v.url("Veuillez entrer une url valide"))),
	location: v.optional(
		v.pipe(v.string(), v.maxLength(255, "La localisation doit contenir au plus 255 caractères")),
	),
	service_area: v.optional(
		v.pipe(v.string(), v.maxLength(255, "La zone de service doit contenir au plus 255 caractères")),
	),
	subdomain: v.optional(
		v.pipe(v.string(), v.maxLength(100, "Le sous-domaine doit contenir au plus 100 caractères")),
	),
	work_mode: v.optional(v.picklist(COMPANY_WORK_MODES)),
	email: v.optional(v.pipe(v.string(), v.email("Veuillez entrer une adresse email valide"))),
	phone: v.optional(
		v.pipe(
			v.string(),
			v.maxLength(24, "Le numéro de téléphone doit contenir au plus 24 caractères"),
		),
	),
	rqth: v.optional(v.picklist(["true", "false"])),
	logo: v.optional(
		v.pipe(
			v.instance(File, "Veuillez entrer un fichier valide"),
			v.mimeType(["image/png", "image/jpeg", "image/jpg"], "Veuillez entrer un fichier valide"),
			v.maxSize(1024 * 1024 * 3, "La taille du fichier doit être inférieure à 3MB"),
		),
	),
	gallery: v.optional(
		v.pipe(
			v.array(v.file("Veuillez entrer un fichier valide")),
			v.maxLength(2, "Veuillez entrer au plus 2 images"),
		),
	),
	social_media: v.optional(
		v.object({
			facebook: v.optional(v.pipe(v.string(), v.url("Veuillez entrer une url valide"))),
			instagram: v.optional(v.pipe(v.string(), v.url("Veuillez entrer une url valide"))),
			linkedin: v.optional(v.pipe(v.string(), v.url("Veuillez entrer une url valide"))),
			calendly: v.optional(v.pipe(v.string(), v.url("Veuillez entrer une url valide"))),
		}),
	),
	categories: v.pipe(
		v.array(v.string()),
		v.minLength(1, "Veuillez sélectionner au moins une catégorie"),
		v.maxLength(3, "Veuillez sélectionner au plus 3 catégories"),
	),
});

export type AddCompanyData = v.InferOutput<typeof AddCompanySchema>;
