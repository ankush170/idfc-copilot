// src/components/Chat/ChatWindow.tsx
import { useEffect } from 'react';
import Message from './Message';
import UserInput from './UserInput';

interface Message {
  sender: 'user' | 'bot';
  content: string;
  type?: 'text' | 'image' | 'button';
  buttons?: { label: string; value: string }[];
}

interface ChatWindowProps {
  messages: Message[];
  onAddMessage: (message: Message) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onAddMessage }) => {
  useEffect(() => {
    const initialMessages: Message[] = [
      { sender: 'bot', content: 'Welcome to IDFC Wealth Advisor, Ankush!', type: 'text' },
      { sender: 'bot', content: 'How are you doing today?', type: 'text' },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < initialMessages.length) {
        onAddMessage(initialMessages[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onAddMessage]);

  const handleUserInput = (input: string) => {
    onAddMessage({ sender: 'user', content: input, type: 'text' });

    const subsequentMessages: Message[] = [
      { 
        sender: 'bot', 
        content: "Let's get started by pulling in your financial data to customize your advice: \n- • AA Data\n- • Bank Transactions\n- • Pension Data/EPFO\n- • Investments/Cam\n", 
        type: 'text' 
      },
      // { 
      //   sender: 'bot', 
      //   content: "- AA Data", 
      //   type: 'text' 
      // },
      // { 
      //   sender: 'bot', 
      //   content: "- Bank Transactions", 
      //   type: 'text' 
      // },
      // { 
      //   sender: 'bot', 
      //   content: "- Pension Data/EPFO", 
      //   type: 'text' 
      // },
      // { 
      //   sender: 'bot', 
      //   content: "- Investments/Cam", 
      //   type: 'text' 
      // },
      {
        sender: 'bot',
        content: 'Please confirm your consent to proceed:',
        type: 'text',
      },
      { 
        sender: 'bot', 
        content: '', 
        type: 'button', 
        buttons: [
          { label: 'I provide my consent', value: 'consent' },
          { label: 'I do not provide my consent', value: 'no-consent' }
        ] 
      },
      { sender: 'bot', content: 'Visual Insights:', type: 'text' },
      { sender: 'bot', content: 'Expenses Trend: [Line Chart 1]', type: 'text' },
      { sender: 'bot', content: 'Investments Trend: [Bar Chart 1]', type: 'text' },
      { sender: 'bot', content: 'May I know the monetary goals you are trying to achieve?', type: 'text' },
      { 
        sender: 'bot', 
        content: 'Let us now explore your risk appetite. Your current investments show that:\n<You have 42% invested in FD and only 10% in direct equity. Remaining 38% is in large cap mutual funds. Hence, you have a moderate risk appetite>', 
        type: 'text' 
      },
      { 
        sender: 'bot', 
        content: 'However, we understand you may not want to always follow your historical asset allocation and risk appetite, thus please tell us more about your current risk interests:', 
        type: 'text' 
      },
      { 
        sender: 'bot', 
        content: '', 
        type: 'button', 
        buttons: [
          { label: 'Aggressive', value: 'aggressive' },
          { label: 'Moderately aggressive', value: 'moderately-aggressive' },
          { label: 'Moderate', value: 'moderate' },
          { label: 'Conservative', value: 'conservative' }
        ] 
      },
      { sender: 'bot', content: 'Now that we have seen your current investment status, and your monetary goals, let us begin the journey of achieving those.', type: 'text' },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < subsequentMessages.length) {
        onAddMessage(subsequentMessages[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <div className="chat-window relative">
      <div className="h-100 fixed inset-0 flex justify-center items-center opacity-10">
        <img src="/idfc-logo.png" alt="IDFC Logo" className="w-2/5" />
      </div>
      <div className="relative">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <UserInput onSendMessage={handleUserInput} />
    </div>
  );
};

export default ChatWindow;
