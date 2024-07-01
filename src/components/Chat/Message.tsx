// src/components/Chat/Message.tsx
import ReactMarkdown from 'react-markdown';
import { TypeAnimation } from 'react-type-animation';
import { useState, useEffect } from 'react';

interface MessageProps {
  message: {
    sender: 'user' | 'bot';
    content: string;
    type?: 'text' | 'image' | 'button';
    buttons?: { label: string; value: string }[];
  };
  onButtonClick?: (value: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onButtonClick }) => {
  const isUser = message.sender === 'user';
  const [typingComplete, setTypingComplete] = useState(isUser);

  useEffect(() => {
    setTypingComplete(isUser);
  }, [isUser]);

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

    if (message.type === 'text') {
      if (isUser || typingComplete) {
        return <ReactMarkdown>{message.content}</ReactMarkdown>;
      } else {
        return (
          <TypeAnimation
            sequence={[
              message.content,
              () => setTypingComplete(true)
            ]}
            wrapper="div"
            cursor={false}
            speed={50}
          />
        );
      }
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