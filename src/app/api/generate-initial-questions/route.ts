import { NextRequest, NextResponse } from 'next/server';
import { generateInitialQuestions } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { heroName } = await request.json();
    
    if (!heroName || typeof heroName !== 'string') {
      return NextResponse.json(
        { error: 'Hero name is required' },
        { status: 400 }
      );
    }

    const initialData = await generateInitialQuestions(heroName.trim());
    
    return NextResponse.json(initialData);
  } catch (error) {
    console.error('Error generating initial questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate initial questions' },
      { status: 500 }
    );
  }
}
