"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Trash2, X } from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";

interface VisualsProps {
  residenceId: string | null;
}

interface UploadedImage {
  id: string;
  url: string;
  isFeatured: boolean;
}

export default function Visuals({ residenceId }: VisualsProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      if (!residenceId) {
        toast.error("Residence ID is missing. Cannot upload images.");
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        toast.error("Please drop image files only");
        return;
      }

      // Check max 10 images
      if (uploadedImages.length + imageFiles.length > 10) {
        toast.error("Maximum 10 images allowed");
        return;
      }

      await uploadImages(imageFiles);
    },
    [residenceId, uploadedImages.length]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !residenceId) return;

      const files = Array.from(e.target.files);
      const imageFiles = files.filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        toast.error("Please select image files only");
        return;
      }

      // Check max 10 images
      if (uploadedImages.length + imageFiles.length > 10) {
        toast.error("Maximum 10 images allowed");
        return;
      }

      await uploadImages(imageFiles);

      // Reset input
      e.target.value = "";
    },
    [residenceId, uploadedImages.length]
  );

  const uploadImages = async (files: File[]) => {
    if (!residenceId) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}/images`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.status}`);
        }

        const data = await response.json();
        return {
          id: data.data.id,
          url: `/api/media/${data.data.id}`,
          isFeatured: false,
        };
      });

      const newImages = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...newImages]);
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!residenceId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}/images/${imageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete image: ${response.status}`);
      }

      setUploadedImages((prev) =>
        prev.filter((image) => image.id !== imageId)
      );
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  const setAsFeatured = async (imageId: string) => {
    if (!residenceId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}/images/${imageId}/feature`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to set featured image: ${response.status}`);
      }

      setUploadedImages((prev) =>
        prev.map((image) => ({
          ...image,
          isFeatured: image.id === imageId,
        }))
      );
      toast.success("Featured image updated successfully");
    } catch (error) {
      console.error("Error setting featured image:", error);
      toast.error("Failed to update featured image. Please try again.");
    }
  };

  const saveVideoUrl = async () => {
    if (!residenceId || !videoUrl) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ videoUrl }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save video URL: ${response.status}`);
      }

      toast.success("Video URL saved successfully");
    } catch (error) {
      console.error("Error saving video URL:", error);
      toast.error("Failed to save video URL. Please try again.");
    }
  };

  // Fetch existing images on component mount
  React.useEffect(() => {
    const fetchImages = async () => {
      if (!residenceId) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}/images`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.status}`);
        }

        const data = await response.json();
        const images = data.data.map((img: any) => ({
          id: img.id,
          url: `/api/media/${img.id}`,
          isFeatured: img.isFeatured,
        }));

        setUploadedImages(images);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load existing images.");
      }
    };

    const fetchResidence = async () => {
      if (!residenceId) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch residence: ${response.status}`);
        }

        const data = await response.json();
        if (data.data.videoUrl) {
          setVideoUrl(data.data.videoUrl);
        }
      } catch (error) {
        console.error("Error fetching residence:", error);
      }
    };

    fetchImages();
    fetchResidence();
  }, [residenceId]);

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Main Gallery</h3>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              Maximum 10 photos
            </p>
          </div>

          <div
            className={`border-2 border-dashed rounded-md p-8 transition-colors text-center ${
              dragging
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, JPEG and PNG formats are supported
            </p>
            <p className="text-xs text-muted-foreground">
              Max. upload size - 5MB
            </p>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outline"
                className="mt-4"
                disabled={uploading || uploadedImages.length >= 10}
                type="button"
              >
                {uploading
                  ? "Uploading..."
                  : uploadedImages.length >= 10
                  ? "Maximum images reached"
                  : "Select files"}
              </Button>
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className="relative group border rounded-md overflow-hidden aspect-square"
                >
                  <img
                    src={image.url}
                    alt="Residence"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                    <Button
                      variant={image.isFeatured ? "default" : "secondary"}
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setAsFeatured(image.id)}
                    >
                      {image.isFeatured ? "Featured" : "Select as featured"}
                    </Button>
                  </div>
                  {image.isFeatured && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Video Tour</h3>

          <div className="flex space-x-2">
            <Input
              placeholder="Enter Youtube video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button onClick={saveVideoUrl} disabled={!videoUrl}>
              Save
            </Button>
          </div>

          {videoUrl && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <div className="aspect-video rounded-md overflow-hidden border">
                <iframe
                  src={
                    videoUrl.includes("youtube.com/watch?v=")
                      ? videoUrl.replace(
                          "youtube.com/watch?v=",
                          "youtube.com/embed/"
                        )
                      : videoUrl.includes("youtu.be/")
                      ? videoUrl.replace("youtu.be/", "youtube.com/embed/")
                      : videoUrl
                  }
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-muted-foreground text-sm">OR</p>
          </div>

          <div
            className="border-2 border-dashed rounded-md p-8 transition-colors text-center mt-4 hover:border-primary/50"
          >
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop or click to browse up to 10 pictures
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, JPEG and PNG formats are supported
            </p>
            <p className="text-xs text-muted-foreground">
              Max. upload size - 5MB
            </p>
            <Button variant="outline" className="mt-4">
              Upload video tour
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}