import { create } from "zustand";
import type { AddCompanyData } from "../validator/company.schema";

type PreviewStore = {
	preview: AddCompanyData | null;
	setPreview: (preview: AddCompanyData) => void;
};

export const usePreviewStore = create<PreviewStore>((set) => ({
	preview: null,
	setPreview: (preview: AddCompanyData) => set({ preview }),
}));
