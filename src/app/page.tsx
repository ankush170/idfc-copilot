'use client';

import { useCallback } from 'react';
import ChatWindow from '../components/Chat/ChatWindow';

interface Message {
  sender: 'user' | 'bot';
  content: string;
  type?: 'text' | 'image' | 'button' | 'chart';
  buttons?: { label: string; value: string }[];
  chartComponent?: React.ReactNode;
}

export default function Home() {
  const handleAddMessage = useCallback((message: Message) => {
    // This function is now only used to handle new messages if needed
    console.log('New message:', message);
    // You can add any global state updates or side effects here
  }, []);

  return (
    <main className="flex justify-center items-center h-screen bg-[color:var(--mobile-bg-color)]">
      <ChatWindow onAddMessage={handleAddMessage} />
    </main>
  );
}