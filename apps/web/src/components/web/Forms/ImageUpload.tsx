import React, { useRef, useState } from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_SIZE_MB = 1;
const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

interface ValidationError {
  type: 'size' | 'format' | 'general';
  message: string;
  fileName?: string;
}

export default function ImageUpload({ 
    onFileChange,
    title = "Upload your company logo",
    preview,
    onRemove,
    maxSizePerImage = 1,
    supportedFormats = ["JPG", "JPEG", "PNG"]
}: { 
    onFileChange: (file: File | null) => void;
    title?: string;
    preview?: string;
    onRemove?: () => void;
    maxSizePerImage?: number;
    supportedFormats?: string[];
}) {
    const [previewState, setPreviewState] = useState<string | null>(preview || null);
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync preview prop if it changes
    React.useEffect(() => {
        if (!file) {
            setPreviewState(preview || null);
        }
    }, [preview]);

    // Enhanced file validation
    const validateFile = (file: File): { isValid: boolean, errors: ValidationError[] } => {
        const newErrors: ValidationError[] = [];

        // Check file size
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > maxSizePerImage) {
            newErrors.push({
                type: 'size',
                fileName: file.name,
                message: `File "${file.name}" (${fileSizeInMB.toFixed(1)}MB) exceeds the maximum allowed size of ${maxSizePerImage}MB.`
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

        // Additional validation - check if file is actually an image
        if (!file.type.startsWith('image/')) {
            newErrors.push({
                type: 'format',
                fileName: file.name,
                message: `File "${file.name}" is not a valid image.`
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrors([]);
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate the file
        const { isValid, errors: validationErrors } = validateFile(selectedFile);

        if (!isValid) {
            setErrors(validationErrors);
            onFileChange(null);
            // Reset input
            if (inputRef.current) {
                inputRef.current.value = '';
            }
            return;
        }

        try {
            setFile(selectedFile);
            setPreviewState(URL.createObjectURL(selectedFile));
            onFileChange(selectedFile);
        } catch (error) {
            console.error('Error creating preview for file:', selectedFile.name, error);
            setErrors([{
                type: 'general',
                fileName: selectedFile.name,
                message: `Error processing file "${selectedFile.name}".`
            }]);
            onFileChange(null);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setPreviewState(preview || null);
        setErrors([]);
        if (inputRef.current) inputRef.current.value = '';
        onFileChange(null);
        if (onRemove) onRemove();
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Clear errors when clicking to upload
        setErrors([]);
        // Ako je kliknuto na X dugme, ignorisi
        if ((e.target as HTMLElement).closest('button')) return;
        inputRef.current?.click();
    };

    const clearErrors = () => {
        setErrors([]);
    };

    return (
        <div className="space-y-4">
            <div
                className={`flex items-center gap-6 border rounded-2xl p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    errors.length > 0 ? "border-destructive bg-destructive/5" : ""
                }`}
                onClick={handleCardClick}
            >
                <div className="logo-upload relative w-[100px] h-[100px] min-w-[100px] min-h-[100px] max-w-[100px] max-h-[100px] flex items-center justify-center border border-dashed rounded-lg bg-secondary">
                    {previewState ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img 
                                src={previewState} 
                                alt="Logo preview" 
                                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }} 
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-1 right-1 bg-secondary border hover:bg-white/20 transition-all duration-300 rounded-full p-1 shadow"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="placeholder flex items-center justify-center w-[40%] h-[40%] flex items-center justify-center text-3xl text-muted-foreground bg-[#F6F4ED] rounded-full">
                            <Plus size={24} color={errors.length > 0 ? "#ef4444" : "#000"}/>
                        </div>
                    )}
                    <input
                        id="logo-input"
                        type="file"
                        accept={supportedFormats.map(format => `.${format.toLowerCase()}`).join(',')}
                        style={{ display: "none" }}
                        ref={inputRef}
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <div className="text-white text-md font-medium mb-1">{title}</div>
                    <div className="text-muted-foreground text-sm">
                        {supportedFormats.join(', ')} files are supported. Optimal dimensions 500×500 px. Max size – up to {maxSizePerImage} MB.
                    </div>
                </div>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="space-y-2">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-destructive font-medium">
                                    {error.type === 'size' && 'File Size Error'}
                                    {error.type === 'format' && 'Unsupported Format'}
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
}