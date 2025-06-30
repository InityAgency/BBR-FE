import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

interface ValidationError {
  type: 'size' | 'format' | 'general' | 'required';
  message: string;
  fileName?: string;
}

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
  const [errors, setErrors] = useState<ValidationError[]>([]);
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
      setErrors([{
        type: 'required',
        message: "This field is required"
      }]);
      if (onValidation) onValidation(false);
    } else if (errors.some(e => e.type === 'required')) {
      setErrors(prev => prev.filter(e => e.type !== 'required'));
      if (onValidation) onValidation(true);
    }
  }, [value, required, touched, onValidation]);

  // Enhanced file validation
  const validateFile = (file: File): { isValid: boolean, errors: ValidationError[] } => {
    const newErrors: ValidationError[] = [];

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      newErrors.push({
        type: 'size',
        fileName: file.name,
        message: `File "${file.name}" (${fileSizeInMB.toFixed(1)}MB) exceeds the maximum allowed size of ${maxSize}MB.`
      });
    }

    // Check file format
    const fileExtension = file.name.split('.').pop()?.toUpperCase();
    if (!fileExtension || !supportedFormats.includes(fileExtension)) {
      newErrors.push({
        type: 'format',
        fileName: file.name,
        message: `File format "${file.name}" is not supported. Allowed formats are: ${supportedFormats.join(', ')}.`
      });
    }

    // Check if file is empty
    if (file.size === 0) {
      newErrors.push({
        type: 'size',
        fileName: file.name,
        message: `File "${file.name}" is empty.`
      });
    }

    return { isValid: newErrors.length === 0, errors: newErrors };
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    setTouched(true);
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Validate the file
    const { isValid, errors: validationErrors } = validateFile(file);
    
    if (!isValid) {
      setErrors(validationErrors);
      if (onChange) onChange(null);
      if (onValidation) onValidation(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    try {
      // Set file name
      setFileName(file.name);
      
      if (onChange) onChange(file);
      if (onValidation) onValidation(true);
    } catch (error) {
      console.error('Error processing file:', file.name, error);
      setErrors([{
        type: 'general',
        fileName: file.name,
        message: `Error processing file "${file.name}".`
      }]);
      if (onChange) onChange(null);
      if (onValidation) onValidation(false);
    }
  };

  const handleClick = () => {
    // Clear errors when clicking to upload
    setErrors([]);
    fileInputRef.current?.click();
    setTouched(true);
  };

  const handleRemove = () => {
    setFileName(null);
    setTouched(true);
    setErrors([]);
    
    if (required) {
      setErrors([{
        type: 'required',
        message: "This field is required"
      }]);
      if (onValidation) onValidation(false);
    } else {
      if (onValidation) onValidation(true);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) onChange(null);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const hasErrors = errors.length > 0;

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
        <div className={`flex items-center justify-between p-3 border rounded-md ${hasErrors ? 'border-destructive' : 'border-border'}`}>
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
          className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-6 cursor-pointer hover:bg-secondary transition-colors ${hasErrors ? 'border-destructive bg-destructive/5' : ''}`}
        >
          <Upload className={`h-8 w-8 ${hasErrors ? 'text-destructive' : 'text-muted-foreground'}`} />
          <div className="text-sm text-center">
            <p className="font-medium">Upload your files</p>
            <p className="text-xs text-muted-foreground">
              {supportedFormats.join(', ')} formats are supported
            </p>
            <p className="text-xs text-muted-foreground">
              Max. upload size - {maxSize}MB
            </p>
            {required && (
              <p className={`text-xs font-medium mt-1 ${hasErrors ? 'text-destructive' : 'text-muted-foreground'}`}>
                This field is required
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Error Messages */}
      {hasErrors && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-destructive font-medium">
                  {error.type === 'size' && 'File Size Error'}
                  {error.type === 'format' && 'Unsupported Format'}
                  {error.type === 'required' && 'Required Field'}
                  {error.type === 'general' && 'Error'}
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                  {error.message}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                onClick={() => setErrors(prev => prev.filter((_, i) => i !== index))}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;