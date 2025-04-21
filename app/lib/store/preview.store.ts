import { create } from "zustand";
import type {
	CreateCompanyData,
	UpdateCompanyInfosData,
	UpdateCompanyMediaData,
} from "../validator/company.schema";

type AddPreviewStore = {
	preview: CreateCompanyData | null;
	setPreview: (preview: CreateCompanyData) => void;
};

export const useAddPreviewStore = create<AddPreviewStore>((set) => ({
	preview: null,
	setPreview: (preview: CreateCompanyData) => set({ preview }),
}));

type UpdatePreviewStore = {
	preview: (UpdateCompanyInfosData & UpdateCompanyMediaData) | null;
	setPreview: (preview: UpdateCompanyInfosData & UpdateCompanyMediaData) => void;
};

export const useUpdatePreviewStore = create<UpdatePreviewStore>((set) => ({
	preview: null,
	setPreview: (preview: UpdateCompanyInfosData & UpdateCompanyMediaData) => set({ preview }),
}));
