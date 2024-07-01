'use client';

import { useState, useCallback } from 'react';
import ChatWindow from '../components/Chat/ChatWindow';

interface Message {
  sender: 'user' | 'bot';
  content: string;
  type?: 'text' | 'image' | 'button';
  buttons?: { label: string; value: string }[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleAddMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  return (
    <main className="flex justify-center items-center h-screen bg-[color:var(--mobile-bg-color)]">
      <ChatWindow messages={messages} onAddMessage={handleAddMessage} />
    </main>
  );
}