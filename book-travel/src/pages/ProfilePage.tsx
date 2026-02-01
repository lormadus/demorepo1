import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    updateProfile({ nickname, address });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="sticky top-0 bg-white z-40 px-4 py-3 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">👤 프로필</h1>
      </div>

      <div className="flex flex-col items-center pt-6">
        <img
          src={user.profile_image}
          alt={user.nickname}
          className="w-20 h-20 rounded-full object-cover shadow"
        />
        <p className="mt-2 text-sm text-gray-500">{user.email}</p>
        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded mt-1">
          {user.auth_provider}
        </span>
      </div>

      <section className="px-4 pt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:ring-2 focus:ring-[#4A90A4]/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">기본 주소</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:ring-2 focus:ring-[#4A90A4]/30"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#4A90A4] text-white font-medium py-2.5 rounded-lg hover:bg-[#3d7a8c] transition"
        >
          {saved ? '✅ 저장됨' : '프로필 저장'}
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full bg-white border border-red-300 text-red-500 font-medium py-2.5 rounded-lg hover:bg-red-50 transition"
        >
          로그아웃
        </button>
      </section>

      <BottomNav />
    </div>
  );
}
