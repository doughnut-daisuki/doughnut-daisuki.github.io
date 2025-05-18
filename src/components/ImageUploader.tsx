// components/ImageUploader.tsx
import React, { useRef } from "react";

interface ImageUploaderProps {
  onImageUpload: (image: HTMLImageElement) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        onImageUpload(img);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="my-4">
      <label className="block font-bold mb-1">
        画像アップロード（立ち絵）
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2"
      />
    </div>
  );
};

export default ImageUploader;
