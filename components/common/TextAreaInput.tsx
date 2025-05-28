
import React from 'react';
import { Button } from './Button';
import { Icons } from '../../constants';

interface TextAreaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  isLoading: boolean;
  buttonText?: string;
  rows?: number;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  id,
  label,
  value,
  onChange,
  onSubmit,
  placeholder,
  isLoading,
  buttonText = "Submit",
  rows = 4
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor={id} className="block text-lg font-semibold text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
        disabled={isLoading}
      />
      <Button type="submit" isLoading={isLoading} icon={Icons.Search} className="w-full sm:w-auto">
        {isLoading ? "Processing..." : buttonText}
      </Button>
    </form>
  );
};
