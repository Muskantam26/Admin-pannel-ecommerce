import { Plus } from "lucide-react";

const ImageUpload = ({ images = [], setImages, selectedColor }) => {

  const onFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages([...images, ...newFiles]);
  };

  return (
    <div className="border border-(--input-border) rounded-xl p-4">

      {/* Main Preview */}
      <div className="h-48 flex items-center justify-center rounded-lg mb-3 relative overflow-hidden">
  {images.length ? (
    <>
      <img
        src={URL.createObjectURL(images[0])}
        alt=""
        className="h-full object-contain relative z-10"
      />

      {/* COLOR OVERLAY */}
      {selectedColor && (
        <div
          className="absolute inset-0 z-20 mix-blend-multiply opacity-40"
          style={{ backgroundColor: selectedColor }}
        />
      )}
    </>
  ) : (
    <p className="text-sm text-(--text-third)">Upload image</p>
  )}
</div>

      {/* Hidden Input */}
      <input
        type="file"
        multiple
        id="imageUpload"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Thumbnails */}
      <div className="flex gap-2 mt-3">
        {images.map((file, index) => (
          <div key={index} className="w-16 h-16 border border-(--input-border) rounded">
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}

        {/* Plus Button */}
        <label
          htmlFor="imageUpload"
          className="w-16 h-16 border-dashed border rounded flex items-center justify-center cursor-pointer"
        >
          <Plus size={18} />
        </label>
      </div>

    </div>
  );
};

export default ImageUpload;
