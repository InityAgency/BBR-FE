// components/admin/Forms/ImageUpload.tsx
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  label?: string;
  description?: string;
  maxSize?: number; // in MB
  supportedFormats?: string[];
  aspectRatio?: string;
  onChange?: (file: File | null) => void;
  value?: File | string | null;
  className?: string;
  required?: boolean;
  onValidation?: (isValid: boolean) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  maxSize = 5, // default 5MB
  supportedFormats = ["JPG", "JPEG", "PNG"],
  aspectRatio,
  onChange,
  value,
  className,
  required = false,
  onValidation,
}) => {
  // State for preview URL (could be a File object or a string URL for existing images)
  const [preview, setPreview] = useState<string | null>(() => {
    if (!value) return null;
    if (typeof value === 'string') {
      return value;
    }
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return null;
  });
  
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate on mount and when value changes
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    
    if (typeof value === 'string') {
      setPreview(value);
    } else if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  useEffect(() => {
    // If the field is required and there's no value
    if (required && !value && touched) {
      setError("This field is required");
      if (onValidation) onValidation(false);
    } else {
      setError(null);
      if (onValidation) onValidation(true);
    }
  }, [value, required, touched, onValidation]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setTouched(true);
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit`);
      if (onChange) onChange(null);
      if (onValidation) onValidation(false);
      return;
    }
    
    // Check file format
    const fileExtension = file.name.split('.').pop()?.toUpperCase();
    if (fileExtension && !supportedFormats.includes(fileExtension)) {
      setError(`Unsupported file format. Please use ${supportedFormats.join(', ')}`);
      if (onChange) onChange(null);
      if (onValidation) onValidation(false);
      return;
    }
    
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    if (onChange) onChange(file);
    if (onValidation) onValidation(true);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
    setTouched(true);
  };

  const handleRemove = () => {
    setPreview(null);
    setTouched(true);
    
    if (required) {
      setError("This field is required");
      if (onValidation) onValidation(false);
    } else {
      setError(null);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) onChange(null);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={supportedFormats.map(format => `.${format.toLowerCase()}`).join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {preview ? (
        <div className={`relative border rounded-md overflow-hidden ${error ? 'border-destructive' : ''}`}>
          <Image
            src={preview} 
            alt="Preview" 
            className="w-full h-auto object-contain max-h-[200px]"
            width={200}
            height={200}
            unoptimized={true}
            onError={(e) => {
              setError('Failed to load image');
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 transition-opacity">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleClick}
              >
                Change
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-6 cursor-pointer hover:bg-secondary transition-colors ${error ? 'border-destructive bg-destructive/5' : ''}`}
        >
          <Upload className={`h-8 w-8 ${error ? 'text-destructive' : 'text-muted-foreground'}`} />
          <div className="text-sm text-center">
            <p className="font-medium">Upload image</p>
            <p className="text-xs text-muted-foreground">
              {supportedFormats.join(', ')} formats are supported
            </p>
            <p className="text-xs text-muted-foreground">
              Max. upload size - {maxSize}MB
            </p>
            {aspectRatio && (
              <p className="text-xs text-muted-foreground">
                Recommended aspect ratio {aspectRatio}
              </p>
            )}
            {required && (
              <p className={`text-xs font-medium mt-1 ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
                This field is required
              </p>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-destructive-foreground text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;