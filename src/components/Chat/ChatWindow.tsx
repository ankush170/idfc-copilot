// src/components/Chat/ChatWindow.tsx
import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import UserInput from './UserInput';

interface Message {
  sender: 'user' | 'bot';
  content: string;
  type?: 'text' | 'image' | 'button';
  buttons?: { label: string; value: string }[];
}

interface ChatWindowProps {
  onAddMessage: (message: Message) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onAddMessage }) => {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
  const [riskAppetiteSelected, setRiskAppetiteSelected] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessages: Message[] = [
      { sender: 'bot', content: 'Welcome to IDFC Wealth Advisor, Ankush!', type: 'text' },
      { sender: 'bot', content: 'How are you doing today?', type: 'text' },
    ];

    setMessageQueue(initialMessages);
  }, []);

  useEffect(() => {
    const processQueue = async () => {
      if (messageQueue.length > 0 && !isTyping) {
        setIsTyping(true);
        const nextMessage = messageQueue[0];
        setDisplayedMessages(prev => [...prev, nextMessage]);
        
        // Wait for the message to finish typing
        if (nextMessage.sender === 'bot' && nextMessage.type === 'text') {
          await new Promise(resolve => setTimeout(resolve, nextMessage.content.length * 50 + 500));
        }

        setMessageQueue(prev => prev.slice(1));
        setIsTyping(false);
      }
    };

    processQueue();
  }, [messageQueue, isTyping]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  const handleUserInput = (input: string) => {
    const userMessage: Message = { sender: 'user', content: input, type: 'text' };
    setDisplayedMessages(prev => [...prev, userMessage]);

    const subsequentMessages: Message[] = [
      {
        sender: 'bot',
        content: "Let's get started by pulling in your financial data to customize your advice:\n- • AA Data\n- • Bank Transactions\n- • Pension Data/EPFO\n- • Investments/Cam",
        type: 'text'
      },
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
      }
    ];

    setMessageQueue(prev => [...prev, ...subsequentMessages]);
  };

  const handleButtonClick = (value: string) => {
    const buttonLabels: { [key: string]: string } = {
      'consent': 'I provide my consent',
      'no-consent': 'I do not provide my consent',
      'aggressive': 'Aggressive',
      'moderately-aggressive': 'Moderately aggressive',
      'moderate': 'Moderate',
      'conservative': 'Conservative'
    };

    if (buttonLabels[value]) {
      setDisplayedMessages(prev => [...prev, { sender: 'user', content: buttonLabels[value], type: 'text' }]);
    }

    if (value === 'consent') {
      setConsentGiven(true);
      const continuedMessages: Message[] = [
        { sender: 'bot', content: '*Visual Insights:*', type: 'text' },
        { sender: 'bot', content: 'Expenses Trend: [Line Chart 1]', type: 'text' },
        { sender: 'bot', content: 'Investments Trend: [Bar Chart 1]', type: 'text' },
        { sender: 'bot', content: 'May I know the monetary goals you are trying to achieve?', type: 'text' },
        {
          sender: 'bot',
          content: 'Let us now explore your risk appetite. Your current investments show that:\n\nYou have 42% invested in FD and only 10% in direct equity. Remaining 38% is in large cap mutual funds. Hence, you have a moderate risk appetite',
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
        }
      ];
      setMessageQueue(prev => [...prev, ...continuedMessages]);
    } else if (value === 'no-consent') {
      setConsentGiven(false);
      setMessageQueue(prev => [...prev, { sender: 'bot', content: 'What else can I help you with?', type: 'text' }]);
    } else {
      // Handle risk appetite buttons
      setRiskAppetiteSelected(true);
      setMessageQueue(prev => [
        ...prev,
        { sender: 'bot', content: `You have chosen a ${buttonLabels[value]} risk appetite.`, type: 'text' },
        { sender: 'bot', content: 'Now that we have seen your current investment status, and your monetary goals, let us begin the journey of achieving those.', type: 'text' }
      ]);
    }
  };

  return (
    <div className="chat-window relative h-screen flex flex-col">
      <div className="absolute inset-0 flex justify-center items-center opacity-[7%] pointer-events-none">
        <img src="/idfc-logo.png" alt="IDFC Logo" className="w-2/5" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#F1948A] to-transparent pointer-events-none z-10" />
      <div 
        className="flex-grow overflow-y-auto scrollbar-hide p-4 pt-16"
        ref={chatWindowRef}
      >
        {displayedMessages.map((msg, index) => (
          <Message key={index} message={msg} onButtonClick={handleButtonClick} />
        ))}
      </div>
      <div className="p-4">
        <UserInput onSendMessage={handleUserInput} />
      </div>
    </div>
  );
};

export default ChatWindow;