import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Loader2, Sparkles, RefreshCw, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function AIProductImageUploader({ onUploadComplete, onCancel }) {
  const [state, setState] = useState('EMPTY'); // EMPTY, SELECTED, PROCESSING, GENERATED, UPLOADING
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [generatedBlobUrl, setGeneratedBlobUrl] = useState(null);
  const [generatedBlob, setGeneratedBlob] = useState(null);
  const [preset, setPreset] = useState('studio');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (generatedBlobUrl) URL.revokeObjectURL(generatedBlobUrl);
    };
  }, [originalUrl, generatedBlobUrl]);

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
        responseType: 'blob', // Important pour récupérer le fichier binaire directement en JS
        timeout: 90000 // L'IA peut prendre du temps (jusqu'à 90s)
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      setGeneratedBlob(blob);
      if (generatedBlobUrl) URL.revokeObjectURL(generatedBlobUrl);
      setGeneratedBlobUrl(URL.createObjectURL(blob));
      setState('GENERATED');
      toast.success('Image générée avec succès !');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du traitement IA. Vérifiez vos identifiants Cloudflare.');
      setState('SELECTED');
    }
  };

  const uploadFinalImage = async (fileOrBlob, filename = 'image.webp') => {
    setState('UPLOADING');
    const formData = new FormData();
    // Si c'est un blob sans nom, on lui en donne un
    const fileToUpload = fileOrBlob instanceof File ? fileOrBlob : new File([fileOrBlob], filename, { type: fileOrBlob.type });
    formData.append('image', fileToUpload);

    try {
      const res = await api.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onUploadComplete(res.data.imageUrl);
      toast.success('Image ajoutée au produit !');
      // On peut réinitialiser ou laisser le composant parent gérer la fermeture
      if (onCancel) onCancel(); 
      else setState('EMPTY');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de l\'enregistrement final');
      setState('GENERATED'); // Revenir à l'état généré pour réessayer
    }
  };

  return (
    <div className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-5 shadow-sm mt-4 relative overflow-hidden">
      {/* Background gradient subtle */}
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
            Votre photo ne sera pas sauvegardée avant validation
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
                  <Sparkles size={16} /> Générer le rendu
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
          <p className="text-sm text-[var(--gray)] mt-1">Génération du rendu avec Cloudflare IA</p>
        </div>
      )}

      {state === 'GENERATED' && (
        <div className="space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-[var(--gray)]">Originale</p>
              <div className="aspect-[4/5] overflow-hidden rounded border border-[var(--border)] bg-gray-50">
                <img src={originalUrl} alt="Originale" className="h-full w-full object-cover grayscale-[30%] opacity-80" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-[#C2185B]">Version IA</p>
              <div className="aspect-[4/5] overflow-hidden rounded border-2 border-[#C2185B] bg-gray-50 shadow-[var(--shadow-md)]">
                <img src={generatedBlobUrl} alt="Générée" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
            <button type="button" onClick={() => uploadFinalImage(selectedFile)} className="flex items-center justify-center gap-2 rounded border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--dark)] hover:bg-gray-50 transition-colors">
              Garder l'originale
            </button>
            <button type="button" onClick={processImage} className="flex items-center justify-center gap-2 rounded border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--dark)] hover:bg-gray-50 transition-colors">
              <RefreshCw size={16} /> Régénérer
            </button>
            <button type="button" onClick={() => uploadFinalImage(generatedBlob, 'ai-generated.webp')} className="flex items-center justify-center gap-2 rounded bg-[#C2185B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A0134A] transition-colors shadow-md">
              <Check size={16} /> Valider l'IA
            </button>
          </div>
        </div>
      )}

      {state === 'UPLOADING' && (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[#F9F9F9] relative z-10">
          <Loader2 className="mb-4 animate-spin text-[var(--primary)]" size={32} />
          <p className="font-medium text-[var(--dark)]">Enregistrement définitif...</p>
        </div>
      )}
    </div>
  );
}
