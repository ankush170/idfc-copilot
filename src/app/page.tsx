// src/pages/index.tsx
'use client';

import ChatWindow from '../components/Chat/ChatWindow';

export default function Home() {
  return (
    <main className="relative flex justify-center items-center h-screen bg-[color:var(--mobile-bg-color)]">
      <img 
        src="/idfc-logo.png" 
        alt="IDFC Logo" 
        className="absolute top-4 left-4 w-[10rem] h-auto z-20" 
      />
      <ChatWindow />
    </main>
  );
}