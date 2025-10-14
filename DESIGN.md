# 🎨 ShujaaQuest Design Document

## ✨ Overview

**ShujaaQuest** is a sleek, modern quiz game celebrating Kenyan heroes with a dark, classy design inspired by the Kenyan flag colors (black, red, green/emerald).

## 🎯 Design Philosophy

- **Dark Mode First**: Deep charcoal background (#0b0d10) for a premium, modern feel
- **Glassmorphism**: All cards use backdrop blur and semi-transparent backgrounds
- **Kenyan Flag Theme**: Emerald-600, Red-600, and Black colors throughout
- **Terminal Aesthetic**: Command-line inspired input with monospace font and pulsing cursor
- **Minimalist**: Clean, focused UI - removed all unnecessary features (sounds, complex share features)
- **Responsive**: Works beautifully on mobile and desktop

## 🏠 Landing Page (`/`)

### Hero Section
- **Title**: "ShujaaQuest" in large, bold font
  - "Shujaa" in emerald-400
  - "Quest" in red-500
- **Guru Introduction**: Bearded guru avatar (🧙🏿‍♂️) with speech bubble
  - Message: "Habari! How well do you know your Shujaas? Enter a hero's name and I'll test your knowledge..."
  
### Terminal Input
- **Glassmorphic card** with terminal-style interface
- Command prompt: `$ shujaa-quest ▊`
- Input field: Black background with emerald border, monospace font
- Placeholder: "Enter hero name (e.g., Wangari Maathai)..."
- Pulsing cursor animation
- CTA Button: Gradient from emerald to red "START QUEST"

### Mini Leaderboard
- **Today's Champions** widget showing top 5 players
- Each entry shows:
  - Rank badge (gold/silver/bronze for top 3)
  - Player name
  - Hero chosen
  - Score with emerald accent
- Link to full leaderboard

### Kenya History Timeline
- **Mindmap-style cards** arranged in grid (3 columns on desktop)
- 6 key milestones from 1963-2024:
  - 1963: Independence
  - 1964: Republic
  - 2002: New Era (Kibaki)
  - 2010: Constitution
  - 2013: Devolution
  - 2024: Today
- Arrow connectors between cards (desktop)
- Alternating emerald/red accent colors
- Glassmorphic cards with left border accent

## 🎮 Game Flow (`/game`)

### Loading Screen
- **Rotating Kenyan fun facts** with guru commentary
- Facts change every 4 seconds
- Examples:
  - "Did you know? Wangari Maathai was the first African woman to win the Nobel Peace Prize!"
  - "Fun fact: Kenya's name comes from Mount Kenya, the second highest peak in Africa!"
- Spinner with emerald border
- Guru message: "Ngoja kidogo... I'm preparing some tough questions for you! 😄"
- **Fast fallback**: 10-second timeout before using pre-generated questions

### Question Screen
- **Header**: Hero name and back button
- **Left sidebar** (sticky): Score display
  - Current score (large, emerald)
  - Progress tracker
  - Point values for each difficulty
  - Performance indicator
- **Main area**: Quiz card
  - Progress bar (emerald to red gradient)
  - Difficulty badge
  - Question in large, bold text
  - Answer buttons:
    - Multiple choice: A, B, C, D with option text
    - True/False: Large TRUE/FALSE buttons
  - Hover effects and transitions
- **Feedback section** (after answering):
  - Green background for correct, red for wrong
  - Explanation text
  - Funny commentary in Sheng
  - **Next button** (user-controlled pacing)
- **Guru reaction** (below question):
  - Bearded avatar with randomized Sheng responses
  - Correct: "Hongera sana!", "Kweli kabisa!", etc.
  - Wrong: "Pole!", "Sawa tu!", etc.

### Completion Screen
- **Celebration**: Large 🎉 emoji with spring animation
- **Stats card**:
  - Final score (emerald, large)
  - Correct answers (red)
  - Accuracy percentage
- **Guru final message** based on performance:
  - > 70%: "Wueh! You're a true historian! Hongera sana! 🎓"
  - > 50%: "Poa! Good effort, keep learning about our shujaas! 📚"
  - <= 50%: "Sawa tu! More practice needed, lakini you tried! 💪"
- **Score submission**:
  - Terminal-style name input
  - Submit button
  - Shows rank after submission
- **Actions**:
  - Play Again (gradient button)
  - View Leaderboard (outline button)

## 🏆 Leaderboard Page (`/leaderboard`)

- Filter tabs: All Time / Today / This Week
- Player entries with:
  - Rank
  - Player name
  - Hero chosen
  - Score
  - Timestamp
- Back to home button

## 🎨 Component Library

### GuruAvatar
- Reusable guru character component
- Props: `message`, `position`, `size`
- Speech bubble with border tail
- Animated entry

### MiniLeaderboard
- Fetches top 5 from today
- Loading skeleton
- Glassmorphic card design
- Rank badges with colors

### QuizCard
- Main quiz interaction component
- Answer selection logic
- Feedback animations
- Next button control
- Guru reactions

### ScoreDisplay
- Sticky sidebar component
- Real-time score updates
- Progress visualization
- Point breakdown
- Performance indicators

## 🎨 Design Tokens

### Colors
```css
--background: #0b0d10      /* Deep charcoal */
--foreground: #e6edf3      /* Off-white text */
--card: #111418            /* Card background */
--muted: #94a3b8           /* Muted text */
--primary: #16a34a         /* Emerald-600 */
--accent: #dc2626          /* Red-600 */
```

### Typography
- **Headings**: Bold, tight tracking
- **Body**: Clean, readable
- **Terminal**: Monospace font family

### Effects
- **Glass Card**: `backdrop-blur-md bg-zinc-900/60`
- **Terminal Input**: Emerald borders, black background, monospace
- **Gradients**: Emerald-600 to Red-600 for CTAs
- **Shadows**: Subtle, elevation-based

## 🚀 Performance Optimizations

1. **Fast Fallback**: 10s Gemini timeout → pre-generated questions
2. **Non-blocking Image Load**: Hero images don't delay quiz start
3. **Optimistic UI**: Show default avatar immediately
4. **Code Splitting**: Dynamic imports where possible
5. **Minimal Bundle**: Removed unused sound libraries

## ♿ Accessibility

- Semantic HTML
- Keyboard navigation
- Focus states on all interactive elements
- High contrast text (WCAG AA compliant)
- Clear error messages

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column, stacked layout)
- **Tablet**: 768px - 1024px (adjusted spacing)
- **Desktop**: > 1024px (sidebar + main, full timeline)

## 🇰🇪 Cultural Elements

- **Kenyan Flag Colors**: Prominent throughout
- **Sheng Slang**: Guru uses authentic Kenyan slang
  - "Hongera!" (Congratulations)
  - "Sawa tu" (It's okay)
  - "Pole!" (Sorry)
  - "Kweli!" (Indeed!)
  - "Wueh!" (Wow!)
- **Hero Focus**: Celebrating real Kenyan heroes
- **History Timeline**: Educational element about Kenya's journey

## 🎯 User Journey

1. **Land** → See classy dark interface with Kenyan colors
2. **Read** → Guru explains the game
3. **Input** → Terminal-style hero name entry
4. **Learn** → See top players and Kenya timeline
5. **Wait** → Fun facts while questions generate
6. **Play** → Answer questions with guru reactions
7. **Complete** → See stats and submit score
8. **Compete** → View leaderboard placement

---

**Built with love for Mashujaa Day 🇰🇪**

