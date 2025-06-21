"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { IconCamera, IconPhoto, IconX } from "@tabler/icons-react";
import { Area, ImageCropper, createCroppedImage } from "./image-cropper";
import { cn } from "@/lib/utils";

interface ImagePickerProps {
  children?: ReactNode;
  dropable?: boolean;
  croppable?: boolean;
  aspectRatio?: number;
  maxSize?: number; // in MB
  acceptedFileTypes?: string;
  onImageSelect?: (file: File) => void;
  onChange?: (file: File) => void;
  image?: File;
  className?: string;
  dropzoneText?: string;
  dropzoneIcon?: ReactNode;
}

export function ImagePicker({
  children,
  dropable = false,
  croppable = false,
  aspectRatio = 1,
  maxSize = 5, // 5MB default
  acceptedFileTypes = "image/*",
  onImageSelect,
  onChange,
  image,
  className,
  dropzoneText = "Drag & drop an image or click to browse",
  dropzoneIcon = <IconPhoto className="w-8 h-8 mb-2 text-muted-foreground" />,
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size should not exceed ${maxSize}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      if (croppable) {
        setSelectedImage(result);
        setIsCropperOpen(true);
      } else {
        if (onImageSelect) onImageSelect(file);
        if (onChange) onChange(file);
      }
    };
    reader.readAsDataURL(file);
  }, [croppable, maxSize, onChange, onImageSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleCropComplete = useCallback(async (croppedAreaPixels: Area) => {
    if (selectedImage) {
      try {
        const croppedFile = await createCroppedImage(selectedImage, croppedAreaPixels);
        if (onImageSelect) onImageSelect(croppedFile);
        if (onChange) onChange(croppedFile);
        setIsCropperOpen(false);
        setSelectedImage(null);
      } catch (error) {
        console.error("Error creating cropped image:", error);
      }
    }
  }, [selectedImage, onImageSelect, onChange]);

  const handleCropCancel = useCallback(() => {
    setIsCropperOpen(false);
    setSelectedImage(null);
  }, []);

  return (
    <div className={cn("space-y-1.5", className)}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleInputChange}
      />
      
      {dropable ? (
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            className
          )}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {dropzoneIcon}
          <p className="text-sm text-muted-foreground">{dropzoneText}</p>
        </div>
      ) : children ? (
        <div onClick={handleClick}>
          {children}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-accent transition-colors"
        >
          <IconCamera className="w-4 h-4" />
          <span>Select Image</span>
        </button>
      )}
      
      {croppable && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          open={isCropperOpen}
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
}
