import React, { useState } from 'react';
import { getBooks, getAllJourneys, getReviewsForBook } from '../services/bookService';
import BookCard from '../components/BookCard';
import MapView from '../components/MapView';
import BottomNav from '../components/BottomNav';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const books = getBooks();
  const journeys = getAllJourneys();
  const allReviews = books.flatMap((b) => getReviewsForBook(b.id));

  const filtered = search
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())
      )
    : books;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Search */}
      <div className="sticky top-0 bg-white z-40 px-4 py-3 shadow-sm">
        <input
          type="text"
          placeholder="🔍 책 제목 또는 저자 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4A90A4]/30"
        />
      </div>

      {/* Recent traveling books */}
      <section className="px-4 pt-4">
        <h2 className="text-base font-semibold text-gray-800 mb-3">📚 최근 여행 중인 책</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="px-4 pt-4">
        <h2 className="text-base font-semibold text-gray-800 mb-3">🗺️ 책 여행 지도</h2>
        <MapView books={books} journeys={journeys} reviews={allReviews} height="350px" />
      </section>

      <BottomNav />
    </div>
  );
}
