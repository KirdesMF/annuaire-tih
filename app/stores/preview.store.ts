import { create } from "zustand";
import type {
  CreateCompanyData,
  UpdateCompanyInfosData,
  UpdateCompanyMediaData,
} from "~/lib/validator/company.schema";

type Create = CreateCompanyData & { logoUrl?: string; galleryUrls?: string[] };

const INITIAL_PREVIEW: Create = {
  name: "",
  siret: "",
  categories: [],
  business_owner: "",
  description: "",
  website: "",
  service_area: "",
  subdomain: "",
  email: "",
  phone: "",
  location: "",
  user_id: "",
  work_mode: "not_specified",
  social_media: {
    facebook: "",
    instagram: "",
    linkedin: "",
    calendly: "",
  },
  gallery: [],
  logo: undefined,
  logoUrl: undefined,
  galleryUrls: [],
};

type AddPreviewStore = {
  preview: Create;
  setPreview: (preview: Create) => void;
  revokeAll: () => void;
  reset: () => void;
};

export const useAddPreviewStore = create<AddPreviewStore>((set) => ({
  preview: INITIAL_PREVIEW,
  setPreview: (preview) => set({ preview }),
  revokeAll: () =>
    set((state) => {
      if (state.preview.logoUrl) {
        URL.revokeObjectURL(state.preview.logoUrl);
        state.preview.logoUrl = undefined;
      }

      if (state.preview.galleryUrls) {
        for (const url of state.preview.galleryUrls) {
          URL.revokeObjectURL(url);
        }
        state.preview.galleryUrls = [];
      }

      return state;
    }),
  reset: () => set({ preview: INITIAL_PREVIEW }),
}));

type UpdatePreviewStore = {
  preview: (UpdateCompanyInfosData & UpdateCompanyMediaData) | null;
  setPreview: (preview: UpdateCompanyInfosData & UpdateCompanyMediaData) => void;
};

export const useUpdatePreviewStore = create<UpdatePreviewStore>((set) => ({
  preview: null,
  setPreview: (preview) => set({ preview }),
}));
