'use client';

import React from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';

interface InputCustomProps {
  hasBorder?: boolean;
  hasRadius?: boolean;
  hasIcon?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputCustom: React.FC<InputCustomProps> = ({
  hasBorder = true,
  hasRadius = true,
  hasIcon = true,
  placeholder = 'Search...',
  className = '',
  inputClassName = '',
  value,
  onChange,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-2 w-full max-w-sm px-3 py-2 bg-white',
        'focus-within:ring-2 focus-within:ring-purple-400 transition-all duration-200',
        {
          'border border-gray-300': hasBorder,
          'rounded-lg': hasRadius,
        },
        className
      )}
    >
      {hasIcon && (
        <Search className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={2} />
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx(
          'my-search-input flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent',
          inputClassName
        )}
      />
    </div>
  );
};

export default InputCustom;
