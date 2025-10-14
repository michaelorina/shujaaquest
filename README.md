# ShujaaQuest - Kenyan Heroes Quiz Game

Classy, dark-mode quiz celebrating Kenyan heroes with a Kenyan-flag theme, a bearded guru narrator, terminal-style input, fun facts, and a live leaderboard.

## Features

- 🎯 Quiz game about Kenyan heroes and historical figures
- 🤖 AI-generated questions using Google Gemini API (45s timeout, then instant fallback)
- 🧙🏿 Guru narrator: Sheng reactions, speech-bubble commentary
- ⌨️ Terminal-style hero input with blinking cursor
- 🏆 Live leaderboard (Neon Postgres + Drizzle), auto-refreshing
- 🧠 Fun facts about Kenya (loading and on landing)
- 🇰🇪 Kenyan history mini-timeline (1963 → today)
- 🖼️ Kenyan flag favicon
- 🌑 Dark, glassmorphism UI with Framer Motion animations
- 📱 Mobile-first, responsive (mobile fun facts scroller)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_neon_postgres_url_here
```

### 3. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or login to your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env.local` file

### 4. Database Setup

1. Create a Neon Postgres database at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Add it to your `.env.local` file as `DATABASE_URL`
4. Push database schema:

```bash
npm run db:push
```

**Note**: This project uses `drizzle-kit push` instead of migrations for easier setup with Neon Postgres.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the game.

Favicon not updating? Hard refresh with Shift+Reload.

## How to Play

1. **Enter Your Hero**: Type a name in the terminal box (e.g., “Wangari Maathai”) and press Enter
2. **Answer Questions**: Multiple-choice and true/false with difficulty progression
3. **Guru Reactions**: See Sheng commentary and explanations after each answer
4. **Next**: Advance at your pace with the Next button
5. **Submit Score**: Save your name and score; view your rank on the leaderboard

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Neon Postgres with Drizzle ORM
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Deployment**: Vercel

## Project Structure

```
shujaaquest/
├── src/
│  ├── app/              # Next.js App Router pages (landing, game, leaderboard, api/*)
│  ├── components/       # UI components (GuruAvatar, QuizCard, ScoreDisplay, MiniLeaderboard)
│  ├── lib/              # Gemini client, fallback questions, Kenya facts
│  └── db/               # Drizzle schema
├── public/              # Static assets (avatars, icons)
└── drizzle/             # Drizzle kit generated SQL
```

## Troubleshooting

### Question Generation is Slow
- Gemini can take time; we allow up to ~45s before falling back to pre-generated questions
- You’ll see rotating fun facts while waiting; if it falls back, gameplay still works perfectly

### Hero Images Not Loading
- We don’t block gameplay on images; a default avatar will be shown if fetching is slow
- This doesn’t affect gameplay

### Database Connection Issues
- Make sure your Neon Postgres connection string is correct
- Ensure you've run `npm run db:push` to create the tables
- Check that `DATABASE_URL` is set in `.env.local`

### Favicon Not Updating
- Browsers cache favicons aggressively; force refresh with Shift+Reload

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

## Contributing

This project was built for the National TVET AI Hackathon. Feel free to fork and contribute!

## License

MIT License