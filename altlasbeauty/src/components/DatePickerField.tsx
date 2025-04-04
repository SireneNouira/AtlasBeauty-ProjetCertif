// components/DatePickerField.tsx
"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerFieldProps {
  id: string;
  name: string;
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  required?: boolean;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  id,
  name,
  label,
  selected,
  onChange,
  className = "",
  required = false,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <DatePicker
        id={id}
        name={name}
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        className={`border rounded px-3 py-2 ${className}`}
        isClearable
        placeholderText="Sélectionnez une date"
        required={required}
      />
    </div>
  );
};