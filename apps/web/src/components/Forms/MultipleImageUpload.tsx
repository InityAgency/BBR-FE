import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Star } from "lucide-react";
import Image from "next/image";

export interface UploadedImage {
  file: File;
  preview: string;
  isFeatured: boolean;
  order: number;
}

interface MultipleImageUploadProps {
  onChange: (images: UploadedImage[]) => void;
  onFeaturedChange: (image: UploadedImage | null) => void;
  maxImages?: number;
  maxSizePerImage?: number; // in MB
  initialImages?: { preview: string; isFeatured: boolean; order: number; mediaId: string }[];
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onChange,
  onFeaturedChange,
  maxImages = 10,
  maxSizePerImage = 5,
  initialImages = [],
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        isFeatured: images.length === 0 && index === 0,
        order: images.length + index,
      }));

      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      setImages(updatedImages);
      onChange(updatedImages);

      if (newImages.some((img) => img.isFeatured)) {
        onFeaturedChange(newImages.find((img) => img.isFeatured) || null);
      }
    },
    [images, maxImages, onChange, onFeaturedChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: maxSizePerImage * 1024 * 1024,
    maxFiles: maxImages - images.length,
  });

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange(updatedImages);

    if (images[index].isFeatured && updatedImages.length > 0) {
      const newFeatured = updatedImages[0];
      newFeatured.isFeatured = true;
      onFeaturedChange(newFeatured);
    } else if (updatedImages.length === 0) {
      onFeaturedChange(null);
    }
  };

  const setFeatured = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isFeatured: i === index,
    }));
    setImages(updatedImages);
    onChange(updatedImages);
    onFeaturedChange(updatedImages[index]);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & drop images here, or click to select files"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max {maxImages} images, {maxSizePerImage}MB per image
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={image.preview}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setFeatured(index)}
                    className={image.isFeatured ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {image.isFeatured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                    Featured
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload; 