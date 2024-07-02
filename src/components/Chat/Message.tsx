// src/components/Chat/Message.tsx
import ReactMarkdown from 'react-markdown';
import { useState, useEffect, useRef } from 'react';

interface MessageProps {
  message: {
    sender: 'user' | 'bot';
    content: string;
    type?: 'text' | 'image' | 'button' | 'chart';
    buttons?: { label: string; value: string }[];
    chartComponent?: React.ReactNode;
  };
  onButtonClick?: (value: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onButtonClick }) => {
  const isUser = message.sender === 'user';
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(!isUser);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isUser && message.type === 'text') {
      let index = 0;
      setIsTyping(true);
      setDisplayedContent('');

      const typeNextChar = () => {
        if (index < message.content.length) {
          setDisplayedContent(message.content.slice(0, index + 1));
          index++;
          typingRef.current = setTimeout(typeNextChar, 50);
        } else {
          setIsTyping(false);
        }
      };

      typeNextChar();

      return () => {
        if (typingRef.current) clearTimeout(typingRef.current);
      };
    } else {
      setDisplayedContent(message.content);
      setIsTyping(false);
    }
  }, [isUser, message.content, message.type]);

  const renderContent = () => {
    if (message.type === 'button') {
      return (
        <div className="flex space-x-2">
          {message.buttons?.map((button, index) => (
            <button
              key={index}
              className="px-2 py-1 text-sm bg-[#A93226] text-white rounded-full"
              onClick={() => onButtonClick?.(button.value)}
            >
              {button.label}
            </button>
          ))}
        </div>
      );
    }

    if (message.type === 'chart') {
      return (
        <div className="w-full my-4 overflow-x-auto">
          <div className="text-sm font-bold mb-2">{message.content}</div>
          <div className="min-w-[600px]">
            {message.chartComponent}
          </div>
        </div>
      );
    }

    if (message.type === 'text') {
      return (
        <div className="relative inline-block">
          <ReactMarkdown>{displayedContent}</ReactMarkdown>
          {isTyping && (
            <span className="inline-block w-1 h-4 ml-1 bg-black animate-blink absolute" style={{ bottom: '0.4rem', right: '-0.6em' }}></span>
          )}
        </div>
      );
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Message;