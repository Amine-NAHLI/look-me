import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUploader({ onUploadComplete, initialImage = null }) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const fileInputRef = useRef(null);

  const validateImage = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Format non supporté. JPG, PNG ou WebP uniquement.');
    }
    if (file.size > MAX_SIZE) {
      throw new Error('Image trop lourde. Maximum 5MB.');
    }
    return true;
  };

  const processUpload = async (file) => {
    try {
      validateImage(file);
    } catch (err) {
      return toast.error(err.message);
    }

    setIsUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Configuration pour un appel depuis API locale
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('lookme_token')}`
        },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        }
      };

      const res = await axios.post('http://localhost:5000/api/upload', formData, config);
      setImageUrl(res.data.imageUrl);
      onUploadComplete(res.data.imageUrl);
      toast.success("Image téléversée avec succès");
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du téléversement');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processUpload(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    onUploadComplete(null);
  };

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="relative aspect-[4/5] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[#F5F5F5] overflow-hidden group">
          <img src={`http://localhost:5000${imageUrl}`} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-white/90 text-[var(--error)] p-3 rounded-full hover:bg-white hover:text-[#880E4F] hover:scale-110 transition-all shadow-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-[4/5] flex flex-col items-center justify-center rounded-[var(--radius-sm)] border-2 border-dashed transition-all cursor-pointer bg-[#F9F9F9] ${
            isDragging ? 'border-[#C2185B] bg-[#FFF8FB]' : 'border-[var(--border)] hover:border-[var(--dark)]'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-[#C2185B]" size={32} />
              <div className="w-[120px] bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-[#C2185B] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <span className="font-body text-[11px] font-medium text-[var(--gray)]">{progress}%</span>
            </div>
          ) : (
            <>
              <div className="p-4 bg-white rounded-full shadow-[var(--shadow-sm)] mb-4">
                <UploadCloud size={32} className="text-[var(--gray)]" strokeWidth={1.5} />
              </div>
              <p className="font-body text-[13px] font-medium text-[var(--dark)] text-center px-4">
                Glissez une image ou cliquez pour parcourir
              </p>
              <p className="font-body text-[10px] uppercase font-semibold text-[var(--gray)] mt-2">
                JPG, PNG, WEBP (Max 5MB)
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/jpeg, image/png, image/webp"
          />
        </div>
      )}
    </div>
  );
}
