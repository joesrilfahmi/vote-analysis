import React from "react";
import { Search } from "lucide-react";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  isSearch,
  className = "",
  ...props
}) => {
  return (
    <div className="relative">
      {isSearch && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        type={type}
        className={`w-full bg-white dark:bg-gray-800 
          border border-gray-300 dark:border-gray-700 
          rounded-md px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-blue-500
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-500
          ${isSearch ? "pl-10" : "pl-4"} 
          ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default Input;
