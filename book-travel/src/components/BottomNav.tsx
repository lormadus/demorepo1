import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/', label: '홈', icon: '🏠' },
  { path: '/my-books', label: '내책', icon: '📖' },
  { path: '/register', label: '등록', icon: '➕' },
  { path: '/profile', label: '프로필', icon: '👤' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
              active ? 'text-[#4A90A4]' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
