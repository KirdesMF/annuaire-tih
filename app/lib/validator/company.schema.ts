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
	website: v.union([v.literal(""), v.pipe(v.string(), v.url("Veuillez entrer une url valide"))]),
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
	logo: v.optional(
		v.pipe(
			v.instance(File),
			v.mimeType(
				["image/png", "image/jpeg", "image/jpg", "image/webp"],
				"Veuillez entrer un fichier valide pour le logo",
			),
			v.maxSize(1024 * 1024 * 3, "La taille du fichier doit être inférieure à 3MB"),
		),
	),
	gallery: v.optional(
		v.pipe(
			v.array(
				v.pipe(
					v.instance(File),
					v.mimeType(
						["image/png", "image/jpeg", "image/jpg", "image/webp"],
						"Veuillez entrer un fichier valide pour la galerie",
					),
					v.maxSize(1024 * 1024 * 2, "La taille du fichier doit être inférieure à 2MB"),
				),
			),
			v.maxLength(2, "Veuillez entrer au plus 2 images"),
		),
	),
	facebook: v.union([
		v.literal(""),
		v.pipe(
			v.string(),
			v.url("Veuillez entrer une url valide"),
			v.startsWith("https://www.facebook.com/", "Veuillez entrer une url facebook valide"),
		),
	]),
	instagram: v.union([
		v.literal(""),
		v.pipe(
			v.string(),
			v.url("Veuillez entrer une url valide"),
			v.startsWith("https://www.instagram.com/", "Veuillez entrer une url instagram valide"),
		),
	]),
	linkedin: v.union([
		v.literal(""),
		v.pipe(
			v.string(),
			v.url("Veuillez entrer une url valide"),
			v.startsWith("https://www.linkedin.com/company/", "Veuillez entrer une url linkedin valide"),
		),
	]),
	calendly: v.union([
		v.literal(""),
		v.pipe(
			v.string(),
			v.url("Veuillez entrer une url valide"),
			v.startsWith("https://calendly.com/", "Veuillez entrer une url calendly valide"),
		),
	]),
});

export type AddCompanyData = v.InferOutput<typeof AddCompanySchema>;
