"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Star } from "lucide-react";
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

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  isFeatured: boolean;
  order: number;
}

interface MultipleImageUploadProps {
  maxImages?: number;
  maxSizePerImage?: number; // in MB
  supportedFormats?: string[];
  onChange?: (images: UploadedImage[]) => void;
  onFeaturedChange?: (image: UploadedImage | null) => void;
  className?: string;
  value?: UploadedImage[];
}

interface SortableImageProps {
  image: UploadedImage;
  onRemove: (id: string) => void;
  onFeaturedChange: (id: string) => void;
}

const SortableImage = ({ image, onRemove, onFeaturedChange }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

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
            onChange={() => onFeaturedChange(image.id)}
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
          onClick={() => onRemove(image.id)}
        >
          <X className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
};

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  maxImages = 10,
  maxSizePerImage = 2,
  supportedFormats = ["JPG", "JPEG", "PNG"],
  onChange,
  onFeaturedChange,
  className,
  value = [],
}) => {
  const [images, setImages] = useState<UploadedImage[]>(value);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    const newImages: UploadedImage[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizePerImage) {
        errors.push(`${file.name} exceeds ${maxSizePerImage}MB limit`);
        return;
      }

      // Check file format
      const fileExtension = file.name.split('.').pop()?.toUpperCase();
      if (fileExtension && !supportedFormats.includes(fileExtension)) {
        errors.push(`${file.name} format is not supported`);
        return;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      
      newImages.push({
        id: crypto.randomUUID(),
        file,
        preview,
        isFeatured: images.length === 0 && newImages.length === 0, // First image is featured by default
        order: images.length + newImages.length,
      });
    });

    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    setError(null);

    if (onChange) {
      onChange(updatedImages);
    }

    // If this is the first image, set it as featured
    if (images.length === 0 && newImages.length > 0 && onFeaturedChange) {
      onFeaturedChange(newImages[0]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [images, maxImages, maxSizePerImage, supportedFormats, onChange, onFeaturedChange]);

  const handleRemove = useCallback((id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    const wasFeautured = imageToRemove?.isFeatured;

    const updatedImages = images.filter(img => img.id !== id).map((img, index) => ({
      ...img,
      order: index,
    }));

    setImages(updatedImages);
    
    if (onChange) {
      onChange(updatedImages);
    }

    // If we removed the featured image, set the first remaining image as featured
    if (wasFeautured && updatedImages.length > 0 && onFeaturedChange) {
      const newFeatured = { ...updatedImages[0], isFeatured: true };
      onFeaturedChange(newFeatured);
      setImages(updatedImages.map(img => ({
        ...img,
        isFeatured: img.id === newFeatured.id,
      })));
    } else if (wasFeautured && updatedImages.length === 0 && onFeaturedChange) {
      onFeaturedChange(null);
    }

    URL.revokeObjectURL(imageToRemove?.preview || "");
  }, [images, onChange, onFeaturedChange]);

  const handleFeaturedChange = useCallback((id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isFeatured: img.id === id
    }));

    setImages(updatedImages);
    
    if (onChange) {
      onChange(updatedImages);
    }

    if (onFeaturedChange) {
      const featuredImage = updatedImages.find(img => img.id === id) || null;
      onFeaturedChange(featuredImage);
    }
  }, [images, onChange, onFeaturedChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.id === active.id);
      const newIndex = images.findIndex(img => img.id === over.id);

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
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors",
              error && "border-destructive bg-destructive/5"
            )}
          >
            <Upload className={cn(
              "h-8 w-8",
              error ? "text-destructive" : "text-muted-foreground"
            )} />
            <div className="text-sm text-center">
              <p className="font-medium">Upload images</p>
              <p className="text-xs text-muted-foreground">
                {supportedFormats.join(', ')} formats are supported
              </p>
              <p className="text-xs text-muted-foreground">
                Max. {maxImages} images, up to {maxSizePerImage}MB each
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Image Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
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