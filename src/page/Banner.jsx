import React, { useState, useRef } from "react";
import { InputField } from "../Component/InputBox";
import Button from "../Component/Btn";
import ImagePreviewModal from "../Component/Model/ImagePreviewModal";

const Banner = () => {
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [submittedData, setSubmittedData] = useState([]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!textInput || !imageFile) return;

    const newBanner = {
      text: textInput,
      imageUrl: URL.createObjectURL(imageFile),
    };

    setSubmittedData((prev) => [...prev, newBanner]);
    setTextInput("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openPreview = (url) => {
    setPreviewImage(url);
    setIsPreviewOpen(true);
  };

  return (
    <div className="pb-10 bg-transparent animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--text-main)">
            Banner Management
          </h1>
          <p className="text-sm text-(--text-second) mt-1">
            Add and manage application banners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-(--text-main) mb-6">
              Add New Banner
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Banner Text"
                placeholder="Enter marquee text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-(--text-main) font-semibold">
                  Banner Image
                </label>
                <div className="px-3 py-2 rounded-md border border-[var(--input-border)]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="w-full text-xs text-(--text-main) file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[var(--bs-btn)] file:text-white hover:file:bg-[var(--btn-hover)] cursor-pointer bg-transparent"
                  />
                </div>
                {imageFile && (
                  <p className="text-xs text-[var(--bs-primary)] mt-1.5 font-medium ml-1">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                title="Add Banner"
                className="w-full justify-center mt-2"
              />
            </form>
          </div>
        </div>

        {/* Right Column: Preview/List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[var(--bg-box)] p-6 rounded-2xl shadow-sm border border-[var(--bs-border)]">
            <h2 className="text-lg font-bold text-(--text-main) mb-6">
              Active Banners
            </h2>

            {submittedData.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-[var(--bs-border)] rounded-xl text-(--text-second) bg-[var(--bg-main)]">
                <div className="w-16 h-16 bg-[var(--bs-primary)]/10 text-[var(--bs-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm">No banners added yet.</p>
                <p className="text-xs mt-1 opacity-70">
                  Fill the form to add one.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {submittedData.map((data, idx) => (
                  <div
                    key={idx}
                    className="border border-[var(--bs-border)] rounded-xl overflow-hidden shadow-sm bg-(--bg-main) transition hover:shadow-md"
                  >
                    {/* Marquee text section */}
                    <div className="bg-[var(--bs-primary)] text-white py-2.5 px-4 shadow-inner">
            
                      <marquee
                        behavior="scroll"
                        direction="left"
                        className="text-sm font-medium tracking-wide text-(--text-main)"
                      >
                        {data.text}
                      </marquee>
                    </div>
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-20 h-16 rounded-lg bg-gray-100 border border-[var(--bs-border)] overflow-hidden cursor-pointer hover:opacity-80 transition flex-shrink-0 relative group"
                          onClick={() => openPreview(data.imageUrl)}
                          title="Click to view full image"
                        >
                          <img
                            src={data.imageUrl}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-(--text-main)">
                            Banner Element #{idx + 1}
                          </p>
                          <div
                            className="inline-flex items-center text-xs text-(--text-second) cursor-pointer hover:text-[var(--bs-primary)] transition gap-1"
                            onClick={() => openPreview(data.imageUrl)}
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Click image to preview
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => openPreview(data.imageUrl)}
                        className="bg-transparent border border-[var(--bs-primary)] text-[var(--bs-primary)] hover:bg-[var(--bs-primary)] hover:text-white text-xs px-4 py-2 self-start sm:self-auto rounded-lg font-medium transition-colors"
                        title="View Popup"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewImage}
        title="Banner Image Preview"
      />
    </div>
  );
};

export default Banner;
