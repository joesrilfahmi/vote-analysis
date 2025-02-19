import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper function to get display text for current value
  const getDisplayText = () => {
    // If options is an array of objects with value/label
    if (
      options.length > 0 &&
      typeof options[0] === "object" &&
      "value" in options[0]
    ) {
      const selectedOption = options.find((opt) => opt.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
    // If options is an array of strings
    return value || placeholder;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        className="w-full p-2.5 flex items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getDisplayText()}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => {
            const isObject = typeof option === "object";
            const optionValue = isObject ? option.value : option;
            const optionLabel = isObject ? option.label : option;

            return (
              <button
                key={index}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  value === optionValue ? "bg-gray-100 dark:bg-gray-600" : ""
                }`}
                onClick={() => {
                  onChange(optionValue);
                  setIsOpen(false);
                }}
              >
                {optionLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
