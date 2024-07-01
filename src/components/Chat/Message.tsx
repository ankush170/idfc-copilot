// src/components/Chat/Message.tsx
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  message: {
    sender: 'user' | 'bot';
    content: string;
    type?: 'text' | 'image' | 'button';
    buttons?: { label: string; value: string }[];
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
        {message.type === 'button' && (
          <div className="flex space-x-2">
            {message.buttons?.map((button, index) => (
              <button key={index} className="px-4 py-2 bg-[var(--maroon-color)] text-white rounded-full">
                {button.label}
              </button>
            ))}
          </div>
        )}
        {message.type === 'text' && (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default Message;