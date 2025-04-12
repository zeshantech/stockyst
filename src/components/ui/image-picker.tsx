"use client";

import { useState, useRef, useCallback } from "react";
import { IconCamera, IconPhoto, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Area, ImageCropper, createCroppedImage } from "./image-cropper";

interface ImagePickerProps {
  image?: string;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  className?: string;
  cropOptions?: {
    crop: boolean;
    ratio?: number;
  };
  label?: string;
}

export function ImagePicker({
  image,
  onChange,
  onRemove,
  className = "",
  cropOptions = { crop: false, ratio: 1 },
  label,
}: ImagePickerProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aspectRatio = cropOptions.ratio || 1;

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: File) => {
      if (cropOptions.crop) {
        // Create a temporary URL for the selected image
        const tempImageUrl = URL.createObjectURL(file);
        setCropperImage(tempImageUrl);
      } else {
        // No cropping needed, pass the file directly
        onChange(file);
      }
    },
    [cropOptions.crop, onChange]
  );

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle drag and drop events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle cropping
  const handleCropComplete = async (croppedAreaPixels: Area) => {
    if (cropperImage) {
      try {
        const croppedFile = await createCroppedImage(
          cropperImage,
          croppedAreaPixels
        );
        // Revoke the temporary URL to avoid memory leaks
        URL.revokeObjectURL(cropperImage);
        setCropperImage(null);
        onChange(croppedFile);
      } catch (error) {
        console.error("Error cropping image:", error);
        URL.revokeObjectURL(cropperImage);
        setCropperImage(null);
      }
    }
  };

  const handleCropCancel = () => {
    if (cropperImage) {
      URL.revokeObjectURL(cropperImage);
      setCropperImage(null);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium">{label}</p>}

      <div
        className={`relative border rounded-md overflow-hidden transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : image
            ? "border"
            : "border-dashed"
        } ${className}`}
        style={{
          aspectRatio: aspectRatio.toString(),
          minHeight: "80px",
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !image && fileInputRef.current?.click()}
      >
        {image ? (
          <div className="relative w-full h-full">
            {/* Image */}
            <img
              src={image}
              alt={label || "Selected image"}
              className="w-full h-full object-cover"
            />

            {/* Hover overlay with subtle action buttons */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <IconCamera className="size-3.5" />
                </button>
                {onRemove && (
                  <button
                    className="p-1 rounded-full bg-black/50 text-white hover:bg-red-500/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                  >
                    <IconX className="size-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 cursor-pointer">
            <IconPhoto className="size-6 text-muted-foreground mb-2" />
            <p className="text-sm text-center text-muted-foreground">
              Drop image here or click to browse
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
          accept="image/*"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Cropper dialog */}
      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          open={!!cropperImage}
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
}
