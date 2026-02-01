import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findHandoffCode, receiveBook, getBookById } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

export default function ReceiveBookPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [foundBook, setFoundBook] = useState<ReturnType<typeof getBookById>>(undefined);
  const [fromUser, setFromUser] = useState('');
  const [locationMode, setLocationMode] = useState<'gps' | 'profile'>('gps');
  const [error, setError] = useState('');

  const handleLookup = () => {
    setError('');
    const handoff = findHandoffCode(code.trim().toUpperCase());
    if (!handoff) {
      setError('유효하지 않은 코드입니다.');
      return;
    }
    const book = getBookById(handoff.book_id);
    setFoundBook(book);
    const { getUserById } = require('../services/bookService');
    const sender = getUserById(handoff.from_user_id);
    setFromUser(sender?.nickname || '알 수 없음');
  };

  const handleReceive = () => {
    if (!user || !foundBook) return;
    const lat = locationMode === 'gps' ? user.latitude + (Math.random() - 0.5) * 0.01 : user.latitude;
    const lng = locationMode === 'gps' ? user.longitude + (Math.random() - 0.5) * 0.01 : user.longitude;
    const locationName = locationMode === 'profile' ? user.address : '현재 위치';

    const result = receiveBook(code.trim().toUpperCase(), user.id, lat, lng, locationName);
    if (result) {
      navigate(`/book/${result.book.id}`);
    } else {
      setError('책 수령에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="sticky top-0 bg-white z-40 px-4 py-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          ← 책 수령하기
        </button>
      </div>

      {/* Code input */}
      <section className="px-4 pt-6">
        <label className="text-sm font-medium text-gray-700">전달 코드 입력:</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ABC-123-XYZ"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#4A90A4]/30"
          />
          <button
            onClick={handleLookup}
            className="bg-[#4A90A4] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3d7a8c] transition"
          >
            확인
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </section>

      <div className="px-4 pt-3 text-center text-sm text-gray-400">또는</div>

      <div className="px-4 pt-1">
        <button
          onClick={() => alert('QR 스캔은 모바일 환경에서 사용 가능합니다.')}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium"
        >
          📷 QR 코드 스캔
        </button>
      </div>

      {/* Found book info */}
      {foundBook && (
        <>
          <section className="px-4 pt-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">📖 전달받을 책 정보</h2>
            <div className="bg-white rounded-lg p-4 flex gap-4 shadow-sm">
              <img
                src={foundBook.cover_image}
                alt={foundBook.title}
                className="w-20 h-28 object-cover rounded shadow"
              />
              <div>
                <p className="font-medium text-gray-800">{foundBook.title}</p>
                <p className="text-sm text-gray-500">{foundBook.author}</p>
                <p className="text-sm text-gray-500 mt-1">보낸 사람: {fromUser}</p>
              </div>
            </div>
          </section>

          <section className="px-4 pt-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">📍 수령 위치</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="radio"
                  checked={locationMode === 'gps'}
                  onChange={() => setLocationMode('gps')}
                  className="accent-[#4A90A4]"
                />
                현재 GPS 위치 사용
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="radio"
                  checked={locationMode === 'profile'}
                  onChange={() => setLocationMode('profile')}
                  className="accent-[#4A90A4]"
                />
                프로필 주소 사용
              </label>
            </div>
          </section>

          <div className="px-4 pt-4">
            <button
              onClick={handleReceive}
              className="w-full bg-[#43A047] text-white font-medium py-3 rounded-lg hover:bg-[#388E3C] transition"
            >
              ✅ 책 수령 확인
            </button>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
