const UploadFile = ({ label }) => {
  return (
    <div>
      <label className="text-xs text-(--text-main) font-semibold ">{label}</label>

      <div className="flex">
        <label className="bg-(--bs-btn) text-(--text-white) px-5 py-2 rounded-sm text-sm font-extralight cursor-pointer flex items-center whitespace-nowrap">
          Upload File
          <input type="file" hidden />
        </label>

        <input
          type="text"
          disabled
          placeholder="No File Choose"
          className="border border-(--bs-border) w-full px-3 text-sm"
        />
      </div>
    </div>
  );
};

export default UploadFile;
