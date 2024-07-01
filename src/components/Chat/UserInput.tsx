// src/components/Chat/UserInput.tsx
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface UserInputProps {
  onSendMessage: (message: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-[color:var(--mobile-bg-color)]">
      <div className="relative flex items-center w-full max-w-2xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          className="flex-1 py-3 pl-4 pr-12 rounded-full focus:outline-none bg-[#FDEDEC]"
          placeholder="Talk to Copilot"
        />
        <button
          onClick={handleSend}
          className="absolute right-4 p-2 text-white bg-[#A93226] rounded-full"
        >
          <ArrowUpIcon className="w-5 h-5 transform" />
        </button>
      </div>
    </div>
  );
};

export default UserInput;