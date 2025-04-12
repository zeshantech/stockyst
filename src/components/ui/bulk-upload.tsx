"use client";

import * as React from "react";
import {
  IconDownload,
  IconFileSpreadsheet,
  IconFileText,
  IconUpload,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";

export interface BulkUploadProps {
  title: string;
  description: string;
  onUpload: (formData: FormData) => Promise<void>;
  onExport: (format: "csv" | "excel" | "json") => void;
  buttonText?: string;
}

export function BulkUpload({
  title,
  description,
  onUpload,
  onExport,
  buttonText = "Bulk Upload",
}: BulkUploadProps) {
  const [uploadMethod, setUploadMethod] = React.useState<
    "csv" | "excel" | "json"
  >("csv");
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("method", uploadMethod);

      await onUpload(formData);
      toast.success(`${title} uploaded successfully`);
      setUploadFile(null);
    } catch (error) {
      console.error(`Error uploading ${title.toLowerCase()}:`, error);
      toast.error(`Failed to upload ${title.toLowerCase()}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <IconUpload />
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Bulk Upload {title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Method</label>
            <Select
              value={uploadMethod}
              onValueChange={(value: "csv" | "excel" | "json") =>
                setUploadMethod(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select upload method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV File</SelectItem>
                <SelectItem value="excel">Excel File</SelectItem>
                <SelectItem value="json">JSON File</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">File</label>
            <Input
              type="file"
              accept={
                uploadMethod === "csv"
                  ? ".csv"
                  : uploadMethod === "excel"
                  ? ".xlsx,.xls"
                  : ".json"
              }
              onChange={handleFileChange}
            />
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
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={!uploadFile || isUploading}
          >
            {isUploading ? "Uploading..." : `Upload ${title}`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
