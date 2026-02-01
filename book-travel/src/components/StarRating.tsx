import React from 'react';

interface Props {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, onChange, size = 'md' }: Props) {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <span className={`inline-flex gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => onChange?.(n)}
          className={`${onChange ? 'cursor-pointer' : ''} ${
            n <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </span>
  );
}
