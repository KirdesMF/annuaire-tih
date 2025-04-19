import { create } from "zustand";
import type { AddCompanyData, UpdateCompanyData } from "../validator/company.schema";

type AddPreviewStore = {
	preview: AddCompanyData | null;
	setPreview: (preview: AddCompanyData) => void;
};

export const useAddPreviewStore = create<AddPreviewStore>((set) => ({
	preview: null,
	setPreview: (preview: AddCompanyData) => set({ preview }),
}));

type UpdatePreviewStore = {
	preview: UpdateCompanyData | null;
	setPreview: (preview: UpdateCompanyData) => void;
};

export const useUpdatePreviewStore = create<UpdatePreviewStore>((set) => ({
	preview: null,
	setPreview: (preview: UpdateCompanyData) => set({ preview }),
}));
