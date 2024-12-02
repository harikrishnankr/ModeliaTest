import React, { useState } from "react";

interface DateInputProps {
  label: string;
  onChange?: (e: string) => void;
  onError?: (e: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, onChange, onError }) => {
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Allow only numbers and dashes
    if (!/^\d{0,4}-?\d{0,2}-?\d{0,2}$/.test(input)) {
      return;
    }

    // Auto-add dashes at appropriate positions
    const formattedDate = input
      .replace(/-/g, "")
      .replace(/(\d{4})(\d{2})?(\d{2})?/, (_match, y, m, d) =>
        [y, m, d].filter(Boolean).join("-")
      );
    setDate(formattedDate);
    if (onChange) {
      onChange(formattedDate);
    }
    setError(""); // Clear error on valid input
    if (onError) {
      onError("");
    }
  };

  const validateDate = () => {
    const [year, month, day] = date.split("-").map(Number);
    const isValidDate =
      year >= 1900 &&
      year <= 2100 &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= new Date(year, month, 0).getDate();
    let error = ""
    if (!isValidDate) {
      error = "Invalid date. Please use yyyy-mm-dd format. Between 1900/01 and 2100/12";
    } else {
      error = "";
    }
    if (onError) {
      onError(error);
    }
    setError(error);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="date-input" className="block mb-2 text-sm font-medium">
        {label}
      </label>
      <input
        id="date-input"
        type="text"
        value={date}
        onChange={handleChange}
        onBlur={validateDate}
        placeholder="YYYY-MM-DD"
        className="border p-2 rounded w-full"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DateInput;
