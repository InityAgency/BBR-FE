import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadProps {
  label?: string;
  description?: string;
  maxSize?: number; // in MB
  supportedFormats?: string[];
  onChange?: (file: File | null) => void;
  value?: File | string | null;
  className?: string;
  required?: boolean;
  onValidation?: (isValid: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  maxSize = 2, // default 2MB
  supportedFormats = ["PDF", "DOC", "DOCX"],
  onChange,
  value,
  className,
  required = false,
  onValidation,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set filename if value is a File
  useEffect(() => {
    if (!value) {
      setFileName(null);
      return;
    }
    
    if (value instanceof File) {
      setFileName(value.name);
    } else if (typeof value === 'string') {
      // Extract filename from string path if needed
      const pathParts = value.split('/');
      setFileName(pathParts[pathParts.length - 1]);
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
    
    // Set file name
    setFileName(file.name);
    
    if (onChange) onChange(file);
    if (onValidation) onValidation(true);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
    setTouched(true);
  };

  const handleRemove = () => {
    setFileName(null);
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
      
      {fileName ? (
        <div className={`flex items-center justify-between p-3 border rounded-md ${error ? 'border-destructive' : 'border-border'}`}>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleClick}
            >
              Change
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleRemove}
              className="w-[32px]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-6 cursor-pointer hover:bg-muted/50 transition-colors ${error ? 'border-destructive bg-destructive/5' : ''}`}
        >
          <Upload className={`h-8 w-8 ${error ? 'text-destructive' : 'text-muted-foreground'}`} />
          <div className="text-sm text-center">
            <p className="font-medium">Upload your files</p>
            <p className="text-xs text-muted-foreground">
              {supportedFormats.join(', ')} formats are supported
            </p>
            <p className="text-xs text-muted-foreground">
              Max. upload size - {maxSize}MB
            </p>
            {required && (
              <p className={`text-xs font-medium mt-1 ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
                This field is required
              </p>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-destructive text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;