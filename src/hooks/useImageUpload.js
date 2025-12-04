// src/hooks/useImageUpload.js
import { useState } from 'react';
import { storage, ID, BUCKET_ID, getImageUrl } from '../config/appwrite';

export const useImageUpload = (bucketId = BUCKET_ID) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Pick image from device (click input)
   */
  const pickImage = async () => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          resolve(file);
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  };

  /**
   * Drag & Drop support
   */
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      return file;
    }
    return null;
  };

  /**
   * Upload file with progress
   */
  const uploadImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image');
      return null;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const fileId = ID.unique();

      const promise = storage.createFile(
        bucketId,
        fileId,
        file,
        ['read("any")'], // public read access
        (progressEvent) => {
          if (progressEvent.total > 0) {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setProgress(percent);
          }
        }
      );

      const uploadedFile = await promise;

      const url = getImageUrl(uploadedFile.$id);

      setProgress(100);

      return {
        id: uploadedFile.$id,
        url,
        name: uploadedFile.name,
      };
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  /**
   * Combined: pick + upload in one step
   */
  const pickAndUpload = async () => {
    const file = await pickImage();
    if (!file) return null;
    return await uploadImage(file);
  };

  return {
    uploading,
    progress,
    error,
    pickImage,
    uploadImage,
    pickAndUpload,
    handleDrop,
  };
};