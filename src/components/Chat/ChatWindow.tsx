import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import UserInput from './UserInput';
import { chatApi } from '../../utils/api';
import ExpensesLineChart from '../Charts/ExpensesLineChart';
import InvestmentBarChart from '../Charts/InvestmentBarChart';
import AssetAllocationPieChart from '../Charts/AssetAllocationPieChart';
import PieChartWithPaddingAngle from '../Charts/PieChartWithPaddingAngle';
import LineBarAreaComposedChart from '../Charts/LineBarAreaComposedChart';

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
  const [riskAppetite, setRiskAppetite] = useState<string | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const expensesData = [
    { month: 'Jan', expenses: 4000, income: 5000 },
    { month: 'Feb', expenses: 3000, income: 5200 },
    { month: 'Mar', expenses: 2000, income: 4800 },
    { month: 'Apr', expenses: 2780, income: 5100 },
    { month: 'May', expenses: 1890, income: 5300 },
    { month: 'Jun', expenses: 2390, income: 5400 },
    { month: 'Jul', expenses: 3490, income: 5600 },
    { month: 'Aug', expenses: 2900, income: 5200 },
    { month: 'Sep', expenses: 3300, income: 5700 },
    { month: 'Oct', expenses: 3100, income: 5500 },
    { month: 'Nov', expenses: 3400, income: 5800 },
    { month: 'Dec', expenses: 3700, income: 6000 },
  ];

  const investmentData = [
    { quarter: 'Q1', FD: 4000, DirectEquity: 2400, MutualFunds: 2400, Insurance: 1000 },
    { quarter: 'Q2', FD: 3000, DirectEquity: 1398, MutualFunds: 2210, Insurance: 1200 },
    { quarter: 'Q3', FD: 2000, DirectEquity: 9800, MutualFunds: 2290, Insurance: 1400 },
    { quarter: 'Q4', FD: 2780, DirectEquity: 3908, MutualFunds: 2000, Insurance: 1600 },
  ];

  const assetAllocationData = [
    { name: 'Stocks', value: 400 },
    { name: 'Bonds', value: 300 },
    { name: 'Real Estate', value: 300 },
    { name: 'Cash', value: 200 },
    { name: 'Commodities', value: 100 },
  ];

  const pieChartWithPaddingAngleData = [
    { name: 'Stocks', value: 400 },
    { name: 'Bonds', value: 300 },
    { name: 'Real Estate', value: 300 },
    { name: 'Gold', value: 200 },
  ];

  const lineBarAreaComposedChartData = [
    { name: 'Jan', income: 4000, expenses: 2400, savings: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398, savings: 2210 },
    { name: 'Mar', income: 2000, expenses: 9800, savings: 2290 },
    { name: 'Apr', income: 2780, expenses: 3908, savings: 2000 },
    { name: 'May', income: 1890, expenses: 4800, savings: 2181 },
    { name: 'Jun', income: 2390, expenses: 3800, savings: 2500 },
    { name: 'Jul', income: 3490, expenses: 4300, savings: 2100 },
  ];

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      setMessageQueue([
        { sender: 'bot', content: `Welcome to IDFC GenAI Robo Advisor, ${storedName}. I hope you are having a great day!`, type: 'text' },
        { sender: 'bot', content: 'Please confirm your consent to access your financial data in order to proceed:', type: 'text' },
        {
          sender: 'bot',
          content: '',
          type: 'button',
          buttons: [
            { label: 'I provide my consent', value: 'consent' },
            { label: 'I do not provide my consent', value: 'no-consent' }
          ]
        }
      ]);
    }
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
          content: 'Income vs Expenses Over Time', 
          type: 'chart',
          chartComponent: <ExpensesLineChart data={expensesData} />
        },
        { 
          sender: 'bot', 
          content: 'Quarterly Investment Distribution', 
          type: 'chart',
          chartComponent: <InvestmentBarChart data={investmentData} />
        },
        { 
          sender: 'bot', 
          content: 'Current Asset Allocation', 
          type: 'chart',
          chartComponent: <AssetAllocationPieChart data={assetAllocationData} />
        },
      ];
      setMessageQueue(prev => [...prev, ...chartMessages]);
    } else if (sessionId) {
      try {
        const response = await chatApi({
          customer_name: userName!,
          session_id: sessionId,
          user_answer: input,
        });
        setMessageQueue(prev => [...prev, { sender: 'bot', content: response.question, type: 'text' }]);
      } catch (error) {
        console.error('Error in API call:', error);
        setMessageQueue(prev => [...prev, { sender: 'bot', content: 'Sorry, there was an error processing your request.', type: 'text' }]);
      }
    }
  };

  const handleButtonClick = async (value: string) => {
    if (!isConsentGiven) {
      const isConsent = value === 'consent';
      setIsConsentGiven(isConsent);
      setDisplayedMessages(prev => [...prev, { sender: 'user', content: isConsent ? 'I provide my consent' : 'I do not provide my consent', type: 'text' }]);
    
      if (isConsent) {
        setMessageQueue(prev => [
          ...prev,
          { sender: 'bot', content: 'Thank you for providing consent!', type: 'text' },
          {
            sender: 'bot',
            content: "Can you select your risk appetite for the investments you are planning to make:",
            type: 'text'
          },
          {
            sender: 'bot',
            content: '',
            type: 'button',
            buttons: [
              { label: 'Aggressive', value: 'Aggressive' },
              { label: 'Moderately aggressive', value: 'Moderately aggressive' },
              { label: 'Moderate', value: 'Moderate' },
              { label: 'Conservative', value: 'Conservative' }
            ]
          }
        ]);
      } else {
        setMessageQueue(prev => [...prev, { sender: 'bot', content: 'May I help you with anything else?', type: 'text' }]);
      }
    } else {
      setRiskAppetite(value);
      setDisplayedMessages(prev => [...prev, { sender: 'user', content: value, type: 'text' }]);
      
      try {
        setMessageQueue(prev => [
          ...prev,
          {
            sender: 'bot',
            content: "Let's get started by pulling in your financial data to customize your advice:\n- • AA Data\n- • Bank Transactions\n- • Pension Data/EPFO\n- • Investments/Cam",
            type: 'text'
          },
        ]);
    
        const response = await chatApi({
          customer_name: userName!,
          user_answer: `Hello ${value}`,
          is_user_consent: true,
        });
        setSessionId(response.session_id);
    
        // Show charts one after another
        const charts = [
          { content: 'Income vs Expenses Over Time', component: <ExpensesLineChart data={expensesData} /> },
          { content: 'Quarterly Investment Distribution', component: <InvestmentBarChart data={investmentData} /> },
          { content: 'Current Asset Allocation', component: <AssetAllocationPieChart data={assetAllocationData} /> },
          { content: 'Group Distribution', component: <PieChartWithPaddingAngle data={pieChartWithPaddingAngleData} /> },
          { content: 'Income, Expenses, and Savings Trends', component: <LineBarAreaComposedChart data={lineBarAreaComposedChartData} /> },
        ];
    
        setMessageQueue(prev => [
          ...prev,
          { sender: 'bot', content: 'Now that I have your financial data, let me spin up my AI Magic Wand 🪄 and show you *Visual Insights* of your financial history: ', type: 'text' },
        ]);
    
        for (let i = 0; i < charts.length; i++) {
          setTimeout(() => {
            setMessageQueue(prev => [
              ...prev,
              { sender: 'bot', content: charts[i].content, type: 'chart', chartComponent: charts[i].component },
            ]);
          }, (i + 1) * 2000); // 2 seconds delay between each chart, starting after the initial message
        }
    
        // Add the final text message after all charts
        setTimeout(() => {
          setMessageQueue(prev => [
            ...prev,
            { sender: 'bot', content: response.question, type: 'text' },
          ]);
        }, (charts.length + 1) * 2000);
    
      } catch (error) {
        console.error('Error in consent API call:', error);
        setMessageQueue(prev => [...prev, { sender: 'bot', content: 'Sorry, there was an error processing your request.', type: 'text' }]);
      }
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
