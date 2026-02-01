import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerBook, lookupISBN } from '../services/bookService';
import StarRating from '../components/StarRating';
import BottomNav from '../components/BottomNav';

export default function RegisterBookPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [locationMode, setLocationMode] = useState<'gps' | 'profile'>('gps');
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  const handleISBNLookup = async () => {
    if (!isbn.trim()) return;
    setLookupLoading(true);
    const result = await lookupISBN(isbn.trim());
    if (result) {
      setTitle(result.title);
      setAuthor(result.author);
      setPublisher(result.publisher);
      setCoverImage(result.cover_image);
      setDescription(result.description);
    } else {
      alert('책 정보를 찾을 수 없습니다. 직접 입력해주세요.');
    }
    setLookupLoading(false);
  };

  const handleStartScanner = async () => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('barcode-scanner');
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 100 } },
        (decodedText) => {
          setIsbn(decodedText);
          scanner.stop();
          lookupISBN(decodedText).then((result) => {
            if (result) {
              setTitle(result.title);
              setAuthor(result.author);
              setPublisher(result.publisher);
              setCoverImage(result.cover_image);
              setDescription(result.description);
            }
          });
        },
        () => {}
      );
    } catch {
      alert('카메라를 사용할 수 없습니다.');
    }
  };

  const handleRegister = () => {
    if (!user) return;
    if (!title.trim()) {
      alert('책 제목을 입력해주세요.');
      return;
    }
    setLoading(true);

    const lat = locationMode === 'gps' ? user.latitude + (Math.random() - 0.5) * 0.01 : user.latitude;
    const lng = locationMode === 'gps' ? user.longitude + (Math.random() - 0.5) * 0.01 : user.longitude;
    const locationName = locationMode === 'profile' ? user.address : '현재 위치';

    const book = registerBook(
      isbn,
      title,
      author,
      publisher,
      coverImage || `https://picsum.photos/seed/${Date.now()}/200/300`,
      description,
      user.id,
      lat,
      lng,
      locationName,
      rating,
      reviewContent || '이 책의 여행을 시작합니다!'
    );

    setLoading(false);
    navigate(`/book/${book.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="sticky top-0 bg-white z-40 px-4 py-3 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">← 책 등록</h1>
      </div>

      {/* Barcode scanner */}
      <section className="px-4 pt-4">
        <div
          ref={scannerRef}
          id="barcode-scanner"
          className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center text-white cursor-pointer"
          onClick={handleStartScanner}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-sm">바코드 스캔하려면 탭하세요</p>
          </div>
        </div>
      </section>

      {/* ISBN input */}
      <section className="px-4 pt-4">
        <label className="text-sm font-medium text-gray-700">ISBN 직접 입력:</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="ISBN 번호"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4A90A4]/30 outline-none"
          />
          <button
            onClick={handleISBNLookup}
            disabled={lookupLoading}
            className="bg-[#4A90A4] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3d7a8c] transition disabled:opacity-50"
          >
            {lookupLoading ? '검색 중...' : '검색'}
          </button>
        </div>
      </section>

      {/* Book info */}
      <section className="px-4 pt-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">📖 책 정보</h2>
        {coverImage && (
          <img src={coverImage} alt="cover" className="w-20 h-28 object-cover rounded shadow" />
        )}
        <div>
          <label className="text-xs text-gray-500">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-0.5 outline-none focus:ring-2 focus:ring-[#4A90A4]/30"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">저자</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-0.5 outline-none focus:ring-2 focus:ring-[#4A90A4]/30"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">출판사</label>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-0.5 outline-none focus:ring-2 focus:ring-[#4A90A4]/30"
          />
        </div>
      </section>

      {/* Location */}
      <section className="px-4 pt-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">📍 등록 위치</h2>
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

      {/* Review */}
      <section className="px-4 pt-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">✍️ 첫 리뷰 작성</h2>
        <StarRating rating={rating} onChange={setRating} size="lg" />
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="이 책에 대한 감상을 적어주세요"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-2 outline-none focus:ring-2 focus:ring-[#4A90A4]/30 resize-none"
        />
      </section>

      {/* Submit */}
      <div className="px-4 pt-4">
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-[#4A90A4] text-white font-medium py-3 rounded-lg hover:bg-[#3d7a8c] transition disabled:opacity-50"
        >
          {loading ? '등록 중...' : '📚 책 등록하기'}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
