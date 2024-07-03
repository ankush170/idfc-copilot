// app/utils/api.ts

interface ChatResponse {
    session_id: string;
    question: string;
    customer_data?: string[];
  }
  
  export async function chatApi(payload: {
    customer_name: string;
    session_id?: string;
    user_answer: string;
    is_user_consent?: boolean;
  }): Promise<ChatResponse> {
    const response = await fetch('http://4.188.72.118:8005/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      throw new Error('API request failed');
    }
  
    return response.json();
  }