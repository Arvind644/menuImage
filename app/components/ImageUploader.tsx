"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onUpload, isLoading }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: isLoading,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 cursor-pointer text-center 
        transition-colors duration-200 ease-in-out
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center py-6">
        {isDragActive ? (
          <Image className="h-12 w-12 text-blue-500 mb-3" />
        ) : (
          <Upload className="h-12 w-12 text-gray-400 mb-3" />
        )}
        <p className="mb-2 text-sm font-semibold">
          {isDragActive
            ? "Drop the menu image here..."
            : "Drag & drop menu image here, or click to select"}
        </p>
        <p className="text-xs text-gray-500">
          Supports JPG, JPEG, PNG, and WebP
        </p>
        {isLoading && (
          <p className="mt-2 text-sm text-blue-500 font-medium">
            Uploading and processing...
          </p>
        )}
      </div>
    </div>
  );
} 