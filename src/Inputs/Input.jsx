const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium  text-(--text-second)">{label}</label>
    <input
      {...props}
      className="border border-(--input-border) bg-(--input-bg) rounded-lg px-3 py-2 focus:outline-none focus:border-none w-full "
    />
  </div>
);

export default Input;
