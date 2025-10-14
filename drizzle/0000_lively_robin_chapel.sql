CREATE TABLE "leaderboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_name" varchar(100) NOT NULL,
	"hero_name" varchar(100) NOT NULL,
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
