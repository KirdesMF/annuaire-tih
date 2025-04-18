import { useState } from "react";

type ImagePreviews = {
	logo?: string;
	gallery: string[];
};

export function useImagePreview() {
	const [imagePreviews, setImagePreviews] = useState<ImagePreviews>({
		gallery: [],
	});

	function readImage(type: "logo" | "gallery", file: File, index: number) {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			setImagePreviews((prev) => {
				if (type === "logo") {
					return { ...prev, logo: result };
				}

				if (type === "gallery" && typeof index === "number") {
					const newGallery = [...prev.gallery];
					newGallery[index] = result;
					return { ...prev, gallery: newGallery };
				}

				return prev;
			});
		};
		reader.readAsDataURL(file);
	}

	return {
		imagePreviews,
		readImage,
	};
}
