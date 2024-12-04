import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  placeholder?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  className?: string; // Additional custom styles
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  label,
  placeholder = "Enter text...",
  rows = 4,
  cols = 50,
  maxLength,
  className = "",
  error = "",
  ...rest
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="text-area-input"
        className="block mb-2 text-sm font-medium"
      >
        {label}
      </label>
      <textarea
        id="text-area-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        className={`border p-2 rounded resize-none ${className}`}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextArea;
