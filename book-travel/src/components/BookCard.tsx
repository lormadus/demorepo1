import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../types';

export default function BookCard({ book }: { book: Book }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/book/${book.id}`)}
      className="flex-shrink-0 w-32 cursor-pointer"
    >
      <div className="relative">
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-32 h-44 object-cover rounded-lg shadow-md"
        />
        <div
          className="absolute top-2 right-2 w-3 h-3 rounded-full border border-white"
          style={{ backgroundColor: book.route_color }}
        />
      </div>
      <p className="mt-1.5 text-sm font-medium text-gray-800 truncate">{book.title}</p>
      <p className="text-xs text-gray-500 truncate">{book.author}</p>
    </div>
  );
}
