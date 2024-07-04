// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', name);
    router.push('/chat');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[color:var(--mobile-bg-color)]">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">Welcome to IDFC GenAI Robo Advisor</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 text-white bg-[#F1948A] rounded hover:bg-[#E74C3C]">
          Start Chat
        </button>
      </form>
    </div>
  );
}