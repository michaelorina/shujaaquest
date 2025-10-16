import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { leaderboard } from '../../../db/schema';
import { desc, gte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query based on filter
    let scores;
    
    const db = getDb();
    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      scores = await db
        .select()
        .from(leaderboard)
        .where(gte(leaderboard.createdAt, today))
        .orderBy(desc(leaderboard.score), desc(leaderboard.createdAt))
        .limit(limit);
    } else if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      scores = await db
        .select()
        .from(leaderboard)
        .where(gte(leaderboard.createdAt, weekAgo))
        .orderBy(desc(leaderboard.score), desc(leaderboard.createdAt))
        .limit(limit);
    } else {
      // 'all' - no filter
      scores = await db
        .select()
        .from(leaderboard)
        .orderBy(desc(leaderboard.score), desc(leaderboard.createdAt))
        .limit(limit);
    }

    // Get total count for pagination info
    const totalCount = await db.select({ count: sql<number>`count(*)` }).from(leaderboard);

    return NextResponse.json({
      leaderboard: scores,
      scores,
      totalCount: totalCount[0]?.count || 0,
      filter,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
