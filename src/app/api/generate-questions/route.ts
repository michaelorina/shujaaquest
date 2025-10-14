import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { heroName } = await request.json();
    
    if (!heroName || typeof heroName !== 'string') {
      return NextResponse.json(
        { error: 'Hero name is required' },
        { status: 400 }
      );
    }

    const quizData = await generateQuiz(heroName.trim());
    
    return NextResponse.json(quizData);
  } catch (error) {
    console.error('Error generating questions:', error);
    
    // If all else fails, return fallback questions directly
    try {
      const { getFallbackQuiz } = await import('@/lib/fallback-questions');
      // Re-parse body to safely access heroName here
      const body: unknown = await request.json().catch(() => ({} as unknown));
      const parsed = (body && typeof body === 'object') ? body as { heroName?: string } : {};
      const name = typeof parsed.heroName === 'string' ? parsed.heroName : '';
      const fallbackData = getFallbackQuiz(name.trim() || 'Kenyan Hero');
      return NextResponse.json(fallbackData);
    } catch (fallbackError) {
      console.error('Even fallback failed:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to generate questions' },
        { status: 500 }
      );
    }
  }
}
