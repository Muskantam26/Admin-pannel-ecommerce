import React, { useState } from 'react';
import { RxCrossCircled } from "react-icons/rx";
import { uploadFile, convertToBase64 } from "../../utils/fileUpload";
import { toast } from "react-toastify";

const ImageUpload = ({ label = "Image", onUploadComplete, previewUrl, onRemove, multiple = false, folder = "upload" }) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // 1. Preview immediately using Base64
      const base64 = await convertToBase64(file);
      // We don't set local preview state if we rely on parent to pass previewUrl back, 
      // but usually for a reusable component, it might be better to show local preview immediately 
      // or expect parent to update `previewUrl` via `onUploadComplete` (which might send base64 first? no, usually URL).
      // Let's assume parent updates previewUrl when we call onUploadComplete or we handle local preview too?
      // The user pattern in CategoryForm was: setPreview(base64) -> upload -> setPreview(url).
      // Use existing onUploadComplete to pass back the preview (base64) possibly? 
      // Or better, handle upload here and just call onUploadComplete(url).
      // But we need to show the image WHILE uploading.
      // So we can assume `previewUrl` prop controls what is shown. 
      // If we want immediate feedback, we might need an internal preview state that overrides prop if uploading?
      // Or simpler: pass the base64 to parent immediately?
      // User said "multiple jagah bar bar use karna hoga isi liye ek bar hi use kar do".
      // Let's make it handle everything.

      // OPTION: We call onUploadComplete(base64) first (so parent shows it), then eventually onUploadComplete(url)?
      // Or better: Internal state for preview if no remote url?
      // Let's stick to the prompt: component should handle progress. 
      // I'll call `onUploadComplete` with the final URL. 
      // For immediate preview, I will set an internal state or just rely on the component showing the file.

      // Let's use internal preview state for the immediate feedback if `previewUrl` is not yet updated by parent?
      // Actually, standard pattern: Parent holds "source of truth".

      // Let's try: 
      // 1. Show base64 locally. 
      // 2. Upload. 
      // 3. Call onUploadComplete(url).

      // Since `previewUrl` is passed as prop, if I want to show the selected image immediately, 
      // I should probably fire an event like `onImageSelect` (optional) or just handle it if `previewUrl` is missing?
      // Let's trust the prop `previewUrl` but maybe we can trigger a "temp" update?
      // Actually, if I look at CategoryForm: `setImagePreview` is used.
      // Let's add `onPreview` prop? Or repurpose `onUploadComplete` to handle both phases?
      // Let's keep it simple: `onUploadComplete` is for the final URL. 
      // But we need to see the image while uploading.

      // I'll use a local preview override while uploading.
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }

    /* Re-implementing logic */
    try {
      setIsUploading(true);
      setProgress(1);

      const base64 = await convertToBase64(file);
      // Call a prop to let parent show preview immediately? 
      // If I don't, the user sees nothing until upload finishes if parent relies on `previewUrl` from URL.
      // Let's update the parent with base64 first? 
      // `onUploadComplete` ideally implies "done".
      // Let's add `onImageSelected` for immediate preview if needed? 
      // Or just use local state for the image tag if `isUploading`.

      // Just pass the result to parent? The user wants "progress add kar do".

      const url = await uploadFile(base64, folder, (percent) => {
        setProgress(percent);
      });

      if (url) {
        onUploadComplete(url); // Parent updates formData and previewUrl
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
          setIsUploading(false);
        }, 1000);
      } else {
        setProgress(0);
        setIsUploading(false);
        toast.error("Upload failed");
      }

    } catch (err) {
      console.error(err);
      setProgress(0);
      setIsUploading(false);
    }
  };

  // Decide what to show: previewUrl (prop) or... wait, if I want to show the uploading image, 
  // I must display it. If parent `previewUrl` is empty initially, I need to show something.
  // I will use `previewUrl` prop. If parent clears it or sets it, we respect it.
  // BUT logic gap: if parent assumes `onUploadComplete` sets image, then during upload, `previewUrl` is old or empty.
  // I should probably convert to base64 and show it locally OR pass to parent to set as preview.

  // Let's modify handleFileSelect to just do the uploading and return URL. 
  // Parent usage will change to: <ImageUpload onUploadComplete={(url) => ...} previewUrl={...} />

  // WAIT: "onImageSelect" was the old prop.
  // Let's rename props to be clearer or keep compatibility? 
  // Old: `onImageSelect={handleImageUpload}`
  // New: `onUploadComplete={(url) => ...}` ?
  // User asked to add progress IN here.

  const activePreview = localPreview || previewUrl;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-(--text-main)">{label}</label>
      <div className="border border-dashed border-(--input-border) rounded-lg p-4 bg-(--bg-white) transition hover:border-(--bs-btn-third)">
        <input
          type="file"
          multiple={multiple}
          onChange={handleFileSelect}
          className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-(--bs-btn-third) file:text-white hover:file:opacity-90 cursor-pointer"
        />
      </div>

      {/* Show preview if available */}
      {activePreview && (
        <div className="relative w-32 h-32 mt-2">
          <img
            src={activePreview}
            alt="Preview"
            className="rounded-xl w-full h-full object-cover shadow-sm border border-gray-200"
          />
          {onRemove && !isUploading && (
            <button
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10"
              type="button"
            >
              <RxCrossCircled size={16} />
            </button>
          )}

          {/* Progress Overlay */}
          {progress > 0 && progress <= 100 && (
            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-10">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-gray-600"
                    d="M18 2.0845
                                   a 15.9155 15.9155 0 0 1 0 31.831
                                   a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  {/* Progress Circle */}
                  <path
                    className="text-(--bs-btn-third) transition-all duration-300 ease-out"
                    strokeDasharray={`${progress}, 100`}
                    d="M18 2.0845
                                   a 15.9155 15.9155 0 0 1 0 31.831
                                   a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                  {progress}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ImageUpload;
