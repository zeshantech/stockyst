"use client";

import * as React from "react";
import { IconDownload, IconUpload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { Selector } from "./selector";

export interface BulkUploadProps<T extends string> {
  title: string;
  description: string;
  onUpload: (formData: FormData) => Promise<void>;
  onExport: (format: T) => void;
  buttonText?: string;
  isUploading?: boolean;
  allowedTypes?: string[];
  exportFormats?: Array<{
    value: T;
    label: string;
  }>;
  defaultFormat?: T;
  trigger?: React.ReactNode;
}

export function BulkUpload<T extends string = "csv" | "excel" | "json">({
  title,
  description,
  onUpload,
  onExport,
  buttonText = "Bulk Upload",
  isUploading = false,
  allowedTypes = [".csv", ".xlsx", ".xls"],
  exportFormats = [
    { value: "csv" as T, label: "CSV File" },
    { value: "excel" as T, label: "Excel File" },
    { value: "json" as T, label: "JSON File" },
  ],
  defaultFormat,
  trigger,
}: BulkUploadProps<T>) {
  const [uploadMethod, setUploadMethod] = React.useState<T>(
    defaultFormat || (exportFormats[0]?.value as T)
  );
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      validateAndSetFile(uploadedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      validateAndSetFile(uploadedFile);
    }
  };

  const validateAndSetFile = (uploadedFile: File) => {
    // Check file extension
    const fileExt = `.${uploadedFile.name.split(".").pop()?.toLowerCase()}`;
    if (!allowedTypes.includes(fileExt)) {
      alert(
        `File type not supported. Please upload one of: ${allowedTypes.join(
          ", "
        )}`
      );
      return;
    }

    setUploadFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("method", uploadMethod as string);

    try {
      await onUpload(formData);
      toast.success(`${title} uploaded successfully`);
      setUploadFile(null);
    } catch (error) {
      console.error(`Error uploading ${title.toLowerCase()}:`, error);
      toast.error(`Failed to upload ${title.toLowerCase()}`);
    }
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bulk Upload {title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Selector
            label="Upload Method"
            value={uploadMethod as string}
            onChange={(value) => setUploadMethod(value as T)}
            placeholder="Select upload method"
            options={exportFormats.map((format) => ({
              label: format.label,
              value: format.value as string,
            }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">File</label>
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors 
                ${
                  dragActive
                    ? "border-primary bg-secondary/20"
                    : "border-border hover:border-primary/50"
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="rounded-full bg-secondary p-2">
                <IconUpload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Drag & drop your file</h3>
              <p className="text-sm text-muted-foreground">
                or click to browse your computer
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: {allowedTypes.join(", ")}
              </p>
              <input
                type="file"
                ref={inputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept={allowedTypes.join(",")}
              />
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                Browse Files
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Template</label>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onExport(uploadMethod)}
          >
            <IconDownload />
            Download Template
          </Button>
        </div>
        <DrawerFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!uploadFile || isUploading}
            loading={isUploading}
          >
            {isUploading ? "Uploading..." : `Upload ${title}`}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
