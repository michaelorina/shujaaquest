import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { leaderboard } from '../../../db/schema';
import { count, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { playerName, heroName, score, totalQuestions, correctAnswers } = await request.json();
    
    // Validate input
    if (!playerName || !heroName || typeof score !== 'number' || typeof totalQuestions !== 'number' || typeof correctAnswers !== 'number') {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert score into database
    const db = getDb();
    const result = await db.insert(leaderboard).values({
      playerName: playerName.trim(),
      heroName: heroName.trim(),
      score,
      totalQuestions,
      correctAnswers,
    }).returning();

    if (result.length === 0) {
      throw new Error('Failed to insert score');
    }

    // Get player's rank
    const rankResult = await db
      .select({ rank: count() })
      .from(leaderboard)
      .where(gt(leaderboard.score, score));

    const rank = (rankResult[0]?.rank || 0) + 1;

    return NextResponse.json({
      success: true,
      rank,
      id: result[0].id,
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}
