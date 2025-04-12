import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UploadImageResponse {
  url: string;
  id: string;
}

/**
 * Upload an image to the server/cloud storage
 */
const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  // In a real app, you would upload to your backend or directly to Cloudinary
  // This is a mock implementation
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({
        url: URL.createObjectURL(file),
        id: `image_${Date.now()}`,
      });
    }, 800);
  });
};

/**
 * Hook for uploading images
 */
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
    upload: mutation.mutate,
    isUploading: mutation.isPending,
    data: mutation.data,
  };
}
