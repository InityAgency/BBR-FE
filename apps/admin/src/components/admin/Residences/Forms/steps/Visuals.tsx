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
    <div>
      <h1>Visuals</h1>
    </div>
  );
}