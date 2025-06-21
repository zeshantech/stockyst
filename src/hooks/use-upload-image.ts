import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export interface UploadImageResponse {
  url: string;
  id: string;
}

const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "techyst"); // Replace with your Cloudinary upload preset

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/djvfnekle/image/upload`, // Replace with your Cloudinary cloud name
      formData
    );

    const data = response.data as { secure_url: string; public_id: string };

    return {
      url: data.secure_url,
      id: data.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export function useUploadImage() {
  const mutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      toast.success("Image uploaded successfully");
    },
    onError: (error) => {
      toast.error(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });

  return {
    upload: mutation.mutateAsync,
    isUploading: mutation.isPending,
    data: mutation.data,
  };
}
