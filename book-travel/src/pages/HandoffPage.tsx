import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { getBookById, createHandoffCode } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

export default function HandoffPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const book = getBookById(id!);
  const [copied, setCopied] = useState(false);

  const handoffCode = useMemo(() => {
    if (!book || !user) return null;
    return createHandoffCode(book.id, user.id);
  }, [book, user]);

  if (!book || !handoffCode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">책을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(handoffCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="sticky top-0 bg-white z-40 px-4 py-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          ← 책 전달하기
        </button>
      </div>

      <div className="px-4 pt-6 text-center">
        <p className="text-lg font-medium text-gray-800">📖 "{book.title}"</p>
        <p className="text-sm text-gray-500 mt-2">
          이 책을 전달하려면 아래 코드를<br />받는 분께 공유해주세요
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center px-4 pt-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <QRCodeSVG value={handoffCode.code} size={200} />
        </div>
      </div>

      {/* Code */}
      <div className="px-4 pt-6 text-center">
        <p className="text-sm text-gray-500">전달 코드</p>
        <p className="text-2xl font-mono font-bold text-[#4A90A4] mt-1 tracking-wider">
          {handoffCode.code}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 px-4 pt-4 justify-center">
        <button
          onClick={handleCopy}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          {copied ? '✅ 복사됨' : '📋 코드 복사'}
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Book Travel - ${book.title}`,
                text: `책 전달 코드: ${handoffCode.code}`,
              });
            } else {
              handleCopy();
            }
          }}
          className="bg-[#F5A623] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e09920] transition"
        >
          📤 공유
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        ⏰ 유효 기간: 7일
      </p>

      <BottomNav />
    </div>
  );
}
