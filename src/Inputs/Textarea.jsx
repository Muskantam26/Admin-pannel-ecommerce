const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-(--text-second)">{label}</label>
    <textarea
      {...props}
      rows={4}
      className="border border-(--input-border) bg-(--input-bg) rounded-lg px-3 py-2 focus:outline-none focus:border-none"
    />
  </div>
);

export default Textarea;
