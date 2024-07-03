// app/api/chart-data/[type]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const chartType = params.type;
  
  // Fetch and return chart data based on the type
  // This is where you'd integrate with your actual data source
  const data = chartType === 'expenses' 
    ? [{ month: 'Jan', expenses: 1000 }, { month: 'Feb', expenses: 1200 }]
    : [{ quarter: 'Q1', FD: 4000, DirectEquity: 2400 }];

  return NextResponse.json(data);
}