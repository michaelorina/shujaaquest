import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const leaderboard = pgTable('leaderboard', {
  id: serial('id').primaryKey(),
  playerName: varchar('player_name', { length: 100 }).notNull(),
  heroName: varchar('hero_name', { length: 100 }).notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
