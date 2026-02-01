import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

export default function MyBooksPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const allBooks = getBooks();
  const myBooks = user ? allBooks.filter((b) => b.current_owner_id === user.id) : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="sticky top-0 bg-white z-40 px-4 py-3 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">📖 내 책</h1>
      </div>

      {myBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
          <p className="text-4xl mb-3">📚</p>
          <p>아직 등록한 책이 없습니다.</p>
          <button
            onClick={() => navigate('/register')}
            className="mt-4 bg-[#4A90A4] text-white px-6 py-2 rounded-lg text-sm"
          >
            책 등록하기
          </button>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-3">
          {myBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => navigate(`/book/${book.id}`)}
              className="bg-white rounded-lg p-3 flex gap-3 shadow-sm cursor-pointer hover:shadow-md transition"
            >
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-16 h-22 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{book.title}</p>
                <p className="text-sm text-gray-500">{book.author}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>거리: {book.total_distance}km</span>
                  <span>전달: {book.handoff_count}회</span>
                </div>
              </div>
              <div
                className="w-3 h-3 rounded-full self-center"
                style={{ backgroundColor: book.route_color }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Receive book button */}
      <div className="px-4 pt-4">
        <button
          onClick={() => navigate('/receive')}
          className="w-full bg-white border border-[#4A90A4] text-[#4A90A4] font-medium py-2.5 rounded-lg text-sm"
        >
          📥 책 수령하기
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
