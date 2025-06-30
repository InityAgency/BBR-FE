"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Star, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  isFeatured: boolean;
  order: number;
}

// Interfejs za slike u edit modu
export interface EditModeImage {
  preview: string;
  isFeatured: boolean;
  order: number;
  mediaId: string;
}

type ImageType = UploadedImage | EditModeImage;

// Helper funkcija za prepoznavanje tipa slike
function isUploadedImage(image: ImageType): image is UploadedImage {
  return 'file' in image;
}

function isEditModeImage(image: ImageType): image is EditModeImage {
  return 'mediaId' in image;
}

interface ValidationError {
  type: 'size' | 'format' | 'count' | 'general';
  message: string;
  fileName?: string;
}

interface MultipleImageUploadProps {
  maxImages?: number;
  maxSizePerImage?: number; // in MB
  supportedFormats?: string[];
  onChange?: (images: ImageType[]) => void;
  onFeaturedChange?: (image: ImageType | null) => void;
  className?: string;
  initialImages?: EditModeImage[];
}

interface SortableImageProps {
  image: ImageType;
  onRemove: (id: string) => void;
  onFeaturedChange: (id: string) => void;
}

const SortableImage = ({ image, onRemove, onFeaturedChange }: SortableImageProps) => {
  const imageId = isUploadedImage(image) ? image.id : image.mediaId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: imageId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative group aspect-square rounded-lg overflow-hidden border border-border cursor-move"
      >
        <Image
          src={image.preview}
          alt="Preview"
          className="w-full h-full object-cover"
          width={200}
          height={200}
          unoptimized={true}
        />
        {image.isFeatured && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs">
            Featured
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="featured"
            checked={image.isFeatured}
            onChange={() => onFeaturedChange(imageId)}
            className="w-4 h-4 text-primary"
          />
          <label className="text-sm text-muted-foreground">
            Set as featured
          </label>
        </div>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          className="h-8 px-2"
          onClick={() => onRemove(imageId)}
        >
          <X className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
};

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  maxImages = 20,
  maxSizePerImage = 2,
  supportedFormats = ["JPG", "JPEG", "PNG", "SVG", "WEBP"],
  onChange,
  onFeaturedChange,
  className,
  initialImages = [],
}) => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial image loading
  useEffect(() => {
    if (initialImages.length > 0 && images.length === 0) {
      setImages(initialImages);
    }
  }, [initialImages, images.length]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Enhanced file validation
  const validateFiles = (files: File[]): { validFiles: File[], errors: ValidationError[] } => {
    const validFiles: File[] = [];
    const newErrors: ValidationError[] = [];

    // Check if adding files would exceed maximum image count
    if (images.length + files.length > maxImages) {
      newErrors.push({
        type: 'count',
        message: `You can upload a maximum of ${maxImages} images. You currently have ${images.length} images and are trying to add ${files.length} more.`
      });
      return { validFiles: [], errors: newErrors };
    }

    files.forEach((file) => {
      let fileValid = true;

      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizePerImage) {
        newErrors.push({
          type: 'size',
          fileName: file.name,
          message: `File "${file.name}" (${fileSizeInMB.toFixed(1)}MB) exceeds the maximum allowed size of ${maxSizePerImage}MB.`
        });
        fileValid = false;
      }

      // Check file format
      const fileExtension = file.name.split('.').pop()?.toUpperCase();
      if (!fileExtension || !supportedFormats.includes(fileExtension)) {
        newErrors.push({
          type: 'format',
          fileName: file.name,
          message: `File format "${file.name}" is not supported. Allowed formats are: ${supportedFormats.join(', ')}.`
        });
        fileValid = false;
      }

      // Additional validation - check if file is actually an image
      if (!file.type.startsWith('image/')) {
        newErrors.push({
          type: 'format',
          fileName: file.name,
          message: `File "${file.name}" is not a valid image.`
        });
        fileValid = false;
      }

      // Check if file is empty
      if (file.size === 0) {
        newErrors.push({
          type: 'size',
          fileName: file.name,
          message: `File "${file.name}" is empty.`
        });
        fileValid = false;
      }

      if (fileValid) {
        validFiles.push(file);
      }
    });

    return { validFiles, errors: newErrors };
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) {
      return;
    }

    // Očisti prethodne greške
    setErrors([]);

    // Validiraj fajlove
    const { validFiles, errors: validationErrors } = validateFiles(files);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      
      // Resetuj input čak i ako ima grešaka
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Ako nema validnih fajlova, zaustavi proces
      if (validFiles.length === 0) {
        return;
      }
    }

    const newImages: UploadedImage[] = [];

    validFiles.forEach((file, index) => {
      try {
        // Kreiranje preview-a
        const preview = URL.createObjectURL(file);
        
        newImages.push({
          id: crypto.randomUUID(),
          file,
          preview,
          isFeatured: images.length === 0 && index === 0, // Prva slika je featured po defaultu
          order: images.length + index,
        });
      } catch (error) {
        console.error('Greška pri kreiranju preview-a za fajl:', file.name, error);
        setErrors(prev => [...prev, {
          type: 'general',
          fileName: file.name,
          message: `Greška pri obradi fajla "${file.name}".`
        }]);
      }
    });

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);

      if (onChange) {
        onChange(updatedImages);
      }

      // Ako je ovo prva slika, postavi je kao featured
      if (images.length === 0 && onFeaturedChange) {
        onFeaturedChange(newImages[0]);
      }
    }

    // Resetuj input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [images, maxImages, maxSizePerImage, supportedFormats, onChange, onFeaturedChange]);

  const handleRemove = useCallback((id: string) => {
    const imageToRemove = images.find(img => isUploadedImage(img) ? img.id === id : img.mediaId === id);
    const wasFeatured = imageToRemove?.isFeatured;

    // If it's an UploadedImage, we need to revoke the URL object for preview
    if (imageToRemove && isUploadedImage(imageToRemove)) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Update order numbers when an image is removed
    const updatedImages = images
      .filter(img => isUploadedImage(img) ? img.id !== id : img.mediaId !== id)
      .map((img, index) => ({
        ...img,
        order: index,
      }));

    setImages(updatedImages);
    
    // Clear errors when an image is removed
    setErrors([]);
    
    if (onChange) {
      onChange(updatedImages);
    }

    // If we removed the featured image, set the first remaining image as featured
    if (wasFeatured && updatedImages.length > 0 && onFeaturedChange) {
      const newFeatured = { ...updatedImages[0], isFeatured: true };
      onFeaturedChange(newFeatured);
      setImages(updatedImages.map(img => ({
        ...img,
        isFeatured: isUploadedImage(img) 
          ? isUploadedImage(newFeatured) && img.id === newFeatured.id
          : isEditModeImage(newFeatured) && img.mediaId === newFeatured.mediaId,
      })));
    } else if (wasFeatured && updatedImages.length === 0 && onFeaturedChange) {
      onFeaturedChange(null);
    }
  }, [images, onChange, onFeaturedChange]);

  const handleFeaturedChange = useCallback((id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isFeatured: isUploadedImage(img) ? img.id === id : img.mediaId === id
    }));

    setImages(updatedImages);
    
    if (onChange) {
      onChange(updatedImages);
    }

    if (onFeaturedChange) {
      const featuredImage = updatedImages.find(img => 
        isUploadedImage(img) ? img.id === id : img.mediaId === id
      ) || null;
      
      onFeaturedChange(featuredImage);
    }
  }, [images, onChange, onFeaturedChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => 
        isUploadedImage(img) ? img.id === active.id : img.mediaId === active.id
      );
      const newIndex = images.findIndex(img => 
        isUploadedImage(img) ? img.id === over.id : img.mediaId === over.id
      );

      const updatedImages = [...images];
      const [movedImage] = updatedImages.splice(oldIndex, 1);
      updatedImages.splice(newIndex, 0, movedImage);

      const reorderedImages = updatedImages.map((img, index) => ({
        ...img,
        order: index,
      }));

      setImages(reorderedImages);
      
      if (onChange) {
        onChange(reorderedImages);
      }
    }
  }, [images, onChange]);

  // Function to clear all errors
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={supportedFormats.map(format => `.${format.toLowerCase()}`).join(',')}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          {/* Upload Zone */}
          <div
            onClick={() => {
              clearErrors();
              fileInputRef.current?.click();
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors",
              errors.length > 0 && "border-destructive bg-destructive/5"
            )}
          >
            <Upload className={cn(
              "h-8 w-8",
              errors.length > 0 ? "text-destructive" : "text-muted-foreground"
            )} />
            <div className="text-sm text-center">
              <p className="font-medium">Upload images</p>
              <p className="text-xs text-muted-foreground">
                {supportedFormats.join(', ')} formats are supported
              </p>
              <p className="text-xs text-muted-foreground">
                Max. {maxImages} images, up to {maxSizePerImage}MB each
              </p>
              <p className="text-xs text-muted-foreground">
                Currently: {images.length}/{maxImages} images
              </p>
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
                      {error.type === 'count' && 'Too Many Images'}
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

          {/* Image Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <SortableContext 
                items={images.map(img => isUploadedImage(img) ? img.id : img.mediaId)} 
                strategy={rectSortingStrategy}
              >
                {images.map((image) => (
                  <SortableImage
                    key={isUploadedImage(image) ? image.id : image.mediaId}
                    image={image}
                    onRemove={handleRemove}
                    onFeaturedChange={handleFeaturedChange}
                  />
                ))}
              </SortableContext>
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default MultipleImageUpload;