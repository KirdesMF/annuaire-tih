import * as v from "valibot";

export const AddCompanySchema = v.object({
	name: v.pipe(
		v.string(),
		v.nonEmpty("Veuillez entrer le nom de l'entreprise"),
		v.maxLength(255, "Le nom de l'entreprise doit contenir au plus 255 caractères"),
	),
	siret: v.pipe(
		v.string(),
		v.nonEmpty("Veuillez entrer le siret de l'entreprise"),
		v.maxLength(14, "Le siret de l'entreprise doit contenir 14 caractères"),
	),
	description: v.pipe(
		v.string(),
		v.maxLength(1500, "La description de l'entreprise doit contenir au plus 1500 caractères"),
	),
	categories: v.pipe(
		v.array(v.string()),
		v.minLength(1, "Veuillez sélectionner au moins une catégorie"),
		v.maxLength(3, "Veuillez sélectionner au plus 3 catégories"),
	),
	logo: v.optional(
		v.pipe(
			v.file("Veuillez entrer un fichier valide"),
			v.mimeType(["image/png", "image/jpeg", "image/jpg"], "Veuillez entrer un fichier valide"),
			v.maxSize(1024 * 1024 * 3, "La taille du fichier doit être inférieure à 3MB"),
		),
	),
});

export type AddCompanyData = v.InferOutput<typeof AddCompanySchema>;
