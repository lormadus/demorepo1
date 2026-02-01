import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getBookById,
  getJourneysForBook,
  getReviewsForBook,
  getUserById,
} from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import MapView from '../components/MapView';
import BottomNav from '../components/BottomNav';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const book = getBookById(id!);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">책을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const journeys = getJourneysForBook(book.id);
  const reviews = getReviewsForBook(book.id);
  const isOwner = user?.id === book.current_owner_id;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-40 px-4 py-3 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          ← 뒤로
        </button>
      </div>

      {/* Book info */}
      <div className="bg-white px-4 py-4 flex gap-4">
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-28 h-40 object-cover rounded-lg shadow"
        />
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-800">{book.title}</h1>
          <p className="text-sm text-gray-500">{book.author}</p>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p>여행 거리: <span className="font-medium">{book.total_distance.toLocaleString()}km</span></p>
            <p>전달 횟수: <span className="font-medium">{book.handoff_count}회</span></p>
          </div>
          <div
            className="mt-2 inline-block w-4 h-4 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: book.route_color }}
          />
        </div>
      </div>

      {/* Map */}
      <section className="px-4 pt-4">
        <h2 className="text-base font-semibold text-gray-800 mb-2">🗺️ 이 책의 여행 경로</h2>
        <MapView
          books={[book]}
          journeys={journeys}
          reviews={reviews}
          height="250px"
          singleBook
        />
      </section>

      {/* Journey timeline */}
      <section className="px-4 pt-4">
        <h2 className="text-base font-semibold text-gray-800 mb-3">📝 여행 기록</h2>
        <div className="space-y-0">
          {[...journeys].reverse().map((journey, idx) => {
            const review = reviews.find((r) => r.journey_id === journey.id);
            const journeyUser = getUserById(journey.user_id);
            const isLast = idx === journeys.length - 1;

            return (
              <div key={journey.id} className="flex gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5"
                    style={{ backgroundColor: book.route_color }}
                  />
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      📍 {journey.location_name}
                    </span>
                    {idx === 0 && (
                      <span className="text-xs bg-[#4A90A4] text-white px-1.5 py-0.5 rounded">현재</span>
                    )}
                    {isLast && (
                      <span className="text-xs bg-gray-400 text-white px-1.5 py-0.5 rounded">최초 등록</span>
                    )}
                  </div>
                  {review && (
                    <div className="mt-1">
                      <StarRating rating={review.rating} size="sm" />
                      <p className="text-sm text-gray-600 mt-0.5">"{review.content}"</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    by {journeyUser?.nickname || '알 수 없음'} -{' '}
                    {new Date(journey.received_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Handoff button */}
      {isOwner && (
        <div className="px-4 pt-2 pb-4">
          <button
            onClick={() => navigate(`/handoff/${book.id}`)}
            className="w-full bg-[#F5A623] text-white font-medium py-3 rounded-lg hover:bg-[#e09920] transition"
          >
            📤 책 전달하기
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
