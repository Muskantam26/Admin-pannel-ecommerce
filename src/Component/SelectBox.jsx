const SelectBox = ({ label, options = [] }) => {
  return (
    <div>
      <label className="text-xs text-(--text-main) font-semibold">{label}</label>

      <select className="w-full border border-(--bs-border) mt-1 p-2 rounded text-xs text-(--text-third)">
        <option>Choose</option>
        {options.map((item, index) => (
          <option key={index}>{item}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectBox;
  