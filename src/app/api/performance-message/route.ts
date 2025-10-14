import { NextRequest, NextResponse } from 'next/server';
import { generatePerformanceMessage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { score, totalQuestions, heroName } = await request.json();
    
    if (typeof score !== 'number' || typeof totalQuestions !== 'number' || !heroName) {
      return NextResponse.json(
        { error: 'Score, totalQuestions, and heroName are required' },
        { status: 400 }
      );
    }

    const message = await generatePerformanceMessage(score, totalQuestions, heroName);
    
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error generating performance message:', error);
    return NextResponse.json(
      { error: 'Failed to generate performance message' },
      { status: 500 }
    );
  }
}
