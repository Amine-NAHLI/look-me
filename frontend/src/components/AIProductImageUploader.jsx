import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Loader2, Sparkles, RefreshCw, Check, CheckCircle2, Circle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function AIProductImageUploader({ onUploadComplete, onCancel }) {
  const [state, setState] = useState('EMPTY'); // EMPTY, SELECTED, PROCESSING, GENERATED, UPLOADING
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [aiImages, setAiImages] = useState([]);
  const [selections, setSelections] = useState({ original: false, ai0: false, ai1: false });
  const [preset, setPreset] = useState('studio');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    };
  }, [originalUrl]);

  const validateImage = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Format non supporté. JPG, PNG ou WebP uniquement.');
    if (file.size > MAX_SIZE) throw new Error('Image trop lourde. Maximum 5MB.');
    return true;
  };

  const handleFileSelect = (file) => {
    try {
      validateImage(file);
      setSelectedFile(file);
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      setOriginalUrl(URL.createObjectURL(file));
      setState('SELECTED');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) handleFileSelect(e.dataTransfer.files[0]);
  };

  const processImage = async () => {
    if (!selectedFile) return;
    setState('PROCESSING');
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('preset', preset);

    try {
      const response = await api.post('/ai/process-image', formData, {
        timeout: 120000 // Les 2 générations peuvent prendre du temps
      });

      setAiImages(response.data.images);
      setSelections({ original: false, ai0: true, ai1: false }); // Sélectionner la première IA par défaut
      setState('GENERATED');
      toast.success('Images générées avec succès !');
    } catch (err) {
      console.error(err);
      // Extraire le message d'erreur renvoyé par le backend
      const errorMsg = err.response?.data?.error?.message || 'Erreur lors du traitement IA. Vérifiez vos identifiants Cloudflare.';
      toast.error(errorMsg, { duration: 6000 });
      setState('SELECTED');
    }
  };

  const base64ToFile = async (base64Str, filename) => {
    const res = await fetch(base64Str);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const uploadSelectedImages = async () => {
    const hasSelection = selections.original || selections.ai0 || selections.ai1;
    if (!hasSelection) return toast.error('Veuillez sélectionner au moins une image.');

    setState('UPLOADING');
    
    try {
      const filesToUpload = [];
      if (selections.original) filesToUpload.push(selectedFile);
      if (selections.ai0 && aiImages[0]) filesToUpload.push(await base64ToFile(aiImages[0], 'ai-1.webp'));
      if (selections.ai1 && aiImages[1]) filesToUpload.push(await base64ToFile(aiImages[1], 'ai-2.webp'));

      // Uploader toutes les images sélectionnées une par une
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        onUploadComplete(res.data.imageUrl); // Ajouter l'image au produit
      }

      toast.success(`${filesToUpload.length} image(s) ajoutée(s) au produit !`);
      if (onCancel) onCancel();
      else setState('EMPTY');

    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de l\'enregistrement final');
      setState('GENERATED'); 
    }
  };

  const toggleSelection = (key) => setSelections(p => ({ ...p, [key]: !p[key] }));
  
  const getSelectedCount = () => [selections.original, selections.ai0, selections.ai1].filter(Boolean).length;

  return (
    <div className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-5 shadow-sm mt-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8FB] to-transparent opacity-50 pointer-events-none" />
      
      <div className="mb-4 flex items-center justify-between relative z-10">
        <h3 className="flex items-center gap-2 font-heading text-xl text-[var(--dark)]">
          <Sparkles className="text-[#C2185B]" size={20} /> Studio Photo IA
        </h3>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-medium text-[var(--gray)] hover:text-[var(--dark)] flex items-center gap-1">
            <X size={16} /> Fermer
          </button>
        )}
      </div>

      {state === 'EMPTY' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-[var(--radius-sm)] border-2 border-dashed bg-[#F9F9F9] transition-all relative z-10 ${
            isDragging ? 'border-[#C2185B] bg-[#FFF8FB]' : 'border-[var(--border)] hover:border-[var(--dark)]'
          }`}
        >
          <div className="mb-4 rounded-full bg-white p-4 shadow-[var(--shadow-sm)]">
            <UploadCloud size={32} className="text-[var(--gray)]" strokeWidth={1.5} />
          </div>
          <p className="px-4 text-center font-body text-[13px] font-medium text-[var(--dark)]">
            Glissez une photo brute ou cliquez pour parcourir
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wide text-[var(--gray)] font-semibold">
            Nous générerons 2 propositions IA !
          </p>
          <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" accept="image/jpeg, image/png, image/webp" />
        </div>
      )}

      {state === 'SELECTED' && (
        <div className="space-y-4 relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="aspect-[4/5] w-32 shrink-0 overflow-hidden rounded border border-[var(--border)] bg-gray-50">
              <img src={originalUrl} alt="Originale" className="h-full w-full object-cover" />
            </div>
            <div className="flex w-full flex-col justify-center space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--dark)]">Style de rendu IA</label>
                <select value={preset} onChange={(e) => setPreset(e.target.value)} className="w-full rounded border border-[var(--border)] p-2 text-sm bg-white outline-none focus:border-[var(--primary)]">
                  <option value="studio">Studio Classique (Fond clair, professionnel)</option>
                  <option value="minimal">Minimaliste (Très épuré, ombres douces)</option>
                  <option value="premium">Premium (Contraste luxueux, mode)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setState('EMPTY')} className="rounded border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--dark)] hover:bg-gray-50 transition-colors">
                  Changer
                </button>
                <button type="button" onClick={processImage} className="flex flex-1 items-center justify-center gap-2 rounded bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
                  <Sparkles size={16} /> Générer 2 propositions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {state === 'PROCESSING' && (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[#F9F9F9] relative z-10">
          <Loader2 className="mb-4 animate-spin text-[#C2185B]" size={32} />
          <p className="font-heading text-lg text-[var(--dark)]">La magie opère...</p>
          <p className="text-sm text-[var(--gray)] mt-1">Génération de 2 rendus en cours...</p>
        </div>
      )}

      {state === 'GENERATED' && (
        <div className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Originale */}
            <div 
              className={`cursor-pointer rounded border-2 transition-all p-1 ${selections.original ? 'border-[var(--dark)] bg-gray-50' : 'border-transparent hover:border-gray-200'}`}
              onClick={() => toggleSelection('original')}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gray)]">Originale</p>
                {selections.original ? <CheckCircle2 size={18} className="text-[var(--dark)]" /> : <Circle size={18} className="text-gray-300" />}
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded border border-[var(--border)] bg-gray-50">
                <img src={originalUrl} alt="Originale" className="h-full w-full object-cover grayscale-[30%] opacity-80" />
              </div>
            </div>
            
            {/* IA 1 */}
            <div 
              className={`cursor-pointer rounded border-2 transition-all p-1 ${selections.ai0 ? 'border-[#C2185B] bg-[#FFF8FB]' : 'border-transparent hover:border-pink-100'}`}
              onClick={() => toggleSelection('ai0')}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#C2185B]">Version 1</p>
                {selections.ai0 ? <CheckCircle2 size={18} className="text-[#C2185B]" /> : <Circle size={18} className="text-gray-300" />}
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded border border-[var(--border)] bg-gray-50 shadow-sm">
                <img src={aiImages[0]} alt="IA 1" className="h-full w-full object-cover" />
              </div>
            </div>

            {/* IA 2 */}
            <div 
              className={`cursor-pointer rounded border-2 transition-all p-1 ${selections.ai1 ? 'border-[#C2185B] bg-[#FFF8FB]' : 'border-transparent hover:border-pink-100'}`}
              onClick={() => toggleSelection('ai1')}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#C2185B]">Version 2</p>
                {selections.ai1 ? <CheckCircle2 size={18} className="text-[#C2185B]" /> : <Circle size={18} className="text-gray-300" />}
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded border border-[var(--border)] bg-gray-50 shadow-sm">
                <img src={aiImages[1]} alt="IA 2" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-end items-center border-t border-[var(--border)] mt-4">
            <button type="button" onClick={processImage} className="flex items-center justify-center gap-2 rounded border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--dark)] hover:bg-gray-50 transition-colors sm:mr-auto">
              <RefreshCw size={16} /> Relancer l'IA
            </button>
            <span className="text-sm font-medium text-[var(--gray)] mr-2">
              {getSelectedCount()} sélectionnée(s)
            </span>
            <button 
              type="button" 
              onClick={uploadSelectedImages} 
              disabled={getSelectedCount() === 0}
              className="flex items-center justify-center gap-2 rounded bg-[#C2185B] px-6 py-2 text-sm font-semibold text-white hover:bg-[#A0134A] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} /> Ajouter {getSelectedCount() > 1 ? 'les images' : 'l\'image'}
            </button>
          </div>
        </div>
      )}

      {state === 'UPLOADING' && (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[#F9F9F9] relative z-10">
          <Loader2 className="mb-4 animate-spin text-[var(--primary)]" size={32} />
          <p className="font-medium text-[var(--dark)]">Enregistrement des images sélectionnées...</p>
        </div>
      )}
    </div>
  );
}
