# ShujaaQuest Deployment Guide

## Prerequisites

1. **Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create or login to your Google account
   - Generate an API key

2. **Neon Postgres Database**
   - Create a Neon account at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

## Environment Variables

Create a `.env.local` file with:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_neon_postgres_connection_string
```

## Database Setup

1. Run database migrations:
```bash
npm run db:push
```

This will create the leaderboard table in your Neon database.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial ShujaaQuest implementation"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `GEMINI_API_KEY`
     - `DATABASE_URL`
   - Deploy

3. **Database Migration on Vercel**
   - After deployment, run the database push command
   - You can do this via Vercel's CLI or by triggering it manually

## Testing the Deployment

1. Visit your Vercel URL
2. Select a hero (try "Jomo Kenyatta" or "Wangari Maathai")
3. Complete a quiz
4. Submit your score
5. Check the leaderboard

## Sound Files

The game expects sound files in `/public/sounds/`:
- `correct.mp3` - Success sound
- `wrong.mp3` - Error sound  
- `bgm.mp3` - Background music

Add these files for the full audio experience.

## Customization

- **Heroes**: Modify the `suggestedHeroes` array in `HeroSelector.tsx`
- **Scoring**: Adjust point values in the game logic
- **Styling**: Update Tailwind classes or add custom CSS
- **Questions**: Modify the Gemini prompt in `lib/gemini.ts`

## Troubleshooting

### Common Issues

1. **Gemini API Errors**
   - Check API key is correct
   - Ensure you have API quota remaining
   - Check console for detailed error messages

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check Neon database is active
   - Ensure network access is allowed

3. **Build Errors**
   - Check all imports are correct
   - Verify TypeScript types
   - Ensure all dependencies are installed

### Performance Tips

- Use Vercel's Edge Functions for better performance
- Enable Vercel Analytics
- Optimize images and sound files
- Use CDN for static assets

## Hackathon Submission

Your ShujaaQuest game is now ready for the National TVET AI Hackathon!

**Features implemented:**
- ✅ Kenyan hero selection with autocomplete
- ✅ AI-generated quiz questions using Gemini
- ✅ Interactive game interface with animations
- ✅ Sound effects and background music
- ✅ Global leaderboard with Neon Postgres
- ✅ Social sharing capabilities
- ✅ Mobile-responsive design
- ✅ Kenyan flag color theme

**Share your game:**
- Post your Vercel URL
- Include screenshots
- Mention the AI features (Gemini integration)
- Highlight the Kenyan cultural elements

Good luck! 🇰🇪
