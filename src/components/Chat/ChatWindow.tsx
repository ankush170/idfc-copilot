// app/components/Chat/ChatWindow.tsx
'use client'

import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import UserInput from './UserInput';
import { chatApi } from '../../utils/api';
import ExpensesLineChart from '../charts/ExpensesLineChart';
import InvestmentBarChart from '../charts/InvestmentBarChart';

interface Message {
  sender: 'user' | 'bot';
  content: string;
  type?: 'text' | 'button' | 'chart';
  buttons?: { label: string; value: string }[];
  chartComponent?: React.ReactNode;
}

const ChatWindow: React.FC = () => {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isConsentGiven, setIsConsentGiven] = useState<boolean | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const expensesData = [
    { month: 'Jan', expenses: 4000 },
    { month: 'Feb', expenses: 3000 },
    { month: 'Mar', expenses: 2000 },
    { month: 'Apr', expenses: 2780 },
    { month: 'May', expenses: 1890 },
    { month: 'Jun', expenses: 2390 },
    { month: 'Jul', expenses: 3490 },
    { month: 'Aug', expenses: 3490 },
    { month: 'Sep', expenses: 3490 },
    { month: 'Oct', expenses: 3490 },
    { month: 'Nov', expenses: 3490 },
    { month: 'Dec', expenses: 3490 },
  ];

  const investmentData = [
    { quarter: 'Q1', FD: 4000, DirectEquity: 2400, MutualFunds: 2400, Insurance: 1000 },
    { quarter: 'Q2', FD: 3000, DirectEquity: 1398, MutualFunds: 2210, Insurance: 1200 },
    { quarter: 'Q3', FD: 2000, DirectEquity: 9800, MutualFunds: 2290, Insurance: 1400 },
    { quarter: 'Q4', FD: 2780, DirectEquity: 3908, MutualFunds: 2000, Insurance: 1600 },
  ];

  useEffect(() => {
    setMessageQueue([
      { sender: 'bot', content: 'Welcome to IDFC Health Advisor, may I know your name?', type: 'text' },
    ]);
  }, []);

  useEffect(() => {
    const processQueue = async () => {
      if (messageQueue.length > 0 && !isTyping) {
        setIsTyping(true);
        const nextMessage = messageQueue[0];
        setDisplayedMessages(prev => [...prev, nextMessage]);
        
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

  const handleUserInput = async (input: string) => {
    const userMessage: Message = { sender: 'user', content: input, type: 'text' };
    setDisplayedMessages(prev => [...prev, userMessage]);

    if (input.toLowerCase().includes('visual insights')) {
      const chartMessages: Message[] = [
        { sender: 'bot', content: '*Visual Insights:*', type: 'text' },
        { 
          sender: 'bot', 
          content: 'Expenses Over Time', 
          type: 'chart',
          chartComponent: <ExpensesLineChart data={expensesData} />
        },
        { 
          sender: 'bot', 
          content: 'Investment Distribution', 
          type: 'chart',
          chartComponent: <InvestmentBarChart data={investmentData} />
        },
      ];
      setMessageQueue(prev => [...prev, ...chartMessages]);
    }else if (!userName) {
      setUserName(input.toLowerCase());
      const subsequentMessages: Message[] = [
        {
          sender: 'bot',
          content: `Hi ${input}, I hope you are having a nice day!`,
          type: 'text'
        },
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
    } else if (sessionId) {
      try {
        const response = await chatApi({
          customer_name: userName,
          session_id: sessionId,
          user_answer: input,
          // is_user_consent: isConsentGiven || false,
        });
        setMessageQueue(prev => [...prev, { sender: 'bot', content: response.question, type: 'text' }]);
      } catch (error) {
        console.error('Error in API call:', error);
        setMessageQueue(prev => [...prev, { sender: 'bot', content: 'Sorry, there was an error processing your request.', type: 'text' }]);
      }
    }
  };

  const handleButtonClick = async (value: string) => {
    const isConsent = value === 'consent';
    setIsConsentGiven(isConsent);
    setDisplayedMessages(prev => [...prev, { sender: 'user', content: isConsent ? 'I provide my consent' : 'I do not provide my consent', type: 'text' }]);

    if (isConsent) {
      try {
        const response = await chatApi({
          customer_name: userName!,
          user_answer: "Hello",
          is_user_consent: true,
        });
        setSessionId(response.session_id);
        setMessageQueue(prev => [
          ...prev,
          { sender: 'bot', content: response.question, type: 'text' },
          // { sender: 'bot', content: 'May I know the monetary goals you are trying to achieve?', type: 'text' },
        ]);
      } catch (error) {
        console.error('Error in consent API call:', error);
        setMessageQueue(prev => [...prev, { sender: 'bot', content: 'Sorry, there was an error processing your request.', type: 'text' }]);
      }
    } else {
      setMessageQueue(prev => [...prev, { sender: 'bot', content: 'May I help you with anything else?', type: 'text' }]);
    }
  };

  return (
    <div className="chat-window relative h-screen flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#FADBD8] to-transparent pointer-events-none z-10" />
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