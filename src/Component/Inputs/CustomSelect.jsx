import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck, FiSearch, FiX } from "react-icons/fi";

const CustomSelect = ({
    label,
    options = [],
    value,
    onChange,
    placeholder = "Select an option",
    searchable = true,
    name,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options based on search
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
        setSearchTerm("");
    };

    const clearSelection = (e) => {
        e.stopPropagation();
        onChange({ target: { name, value: "" } });
    };

    return (
        <div className="w-full relative" ref={dropdownRef}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

            {/* Trigger Button */}
            <div
                className={`w-full border rounded-lg px-3 py-2.5 flex justify-between items-center bg-white cursor-pointer transition-all
                    ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 hover:border-gray-400'}
                    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''}
                `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 truncate">
                    {selectedOption ? (
                        <span className="text-gray-900">{selectedOption.label}</span>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {value && !disabled && (
                        <div
                            onClick={clearSelection}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <FiX size={14} />
                        </div>
                    )}
                    <FiChevronDown
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col animation-fade-in-down">

                    {/* Search Input */}
                    {searchable && (
                        <div className="p-2 border-b border-gray-100 bg-gray-50">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}

                    {/* Options List */}
                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`px-4 py-2.5 text-sm cursor-pointer flex justify-between items-center transition-colors
                                        ${value === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                                    `}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && <FiCheck className="text-blue-600" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
