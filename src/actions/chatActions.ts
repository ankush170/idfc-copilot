// app/actions/chatActions.ts
'use server'

import { revalidatePath } from 'next/cache';

interface Message {
    sender: 'user' | 'bot';
    content: string;
    type: 'text' | 'image' | 'button' | 'chart';
    buttons?: { label: string; value: string }[];
    chartComponent?: React.ReactNode;
}

export async function sendMessage(message: string): Promise<{ messages: Message[] }> {
    // Process message, interact with database or external services
    const response: { messages: Message[] } = {
      messages: [
        { sender: 'bot', content: `Processed: ${message}`, type: 'text' },
      ]
    };
    
    revalidatePath('/chat');
    return response;
}

export async function fetchChartData(chartType: string) {
  // Fetch chart data
  const data = chartType === 'expenses' 
    ? [{ month: 'Jan', expenses: 1000 }, { month: 'Feb', expenses: 1200 }]
    : [{ quarter: 'Q1', FD: 4000, DirectEquity: 2400 }];
  
  return data;
}