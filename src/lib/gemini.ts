import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackQuiz } from './fallback-questions';

// Simple in-memory cache for generated quizzes
const quizCache = new Map<string, QuizData>();

// Function to generate first 3 questions quickly
export async function generateInitialQuestions(heroName: string): Promise<Partial<QuizData>> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Create 3 quiz questions about ${heroName} for ShujaaQuest. Mix: 2 multiple choice (A-D), 1 true/false. Make them easy difficulty. Add Kenyan humor.

Return JSON only:
{
  "heroName": "${heroName}",
  "heroBio": "Brief bio",
  "questions": [
    {
      "id": 1,
      "question": "Question?",
      "type": "multiple_choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "difficulty": "easy",
      "explanation": "Short explanation",
      "funnyCommentary": "Kenyan humor"
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Gemini response');
    }
    
    const quizData = JSON.parse(jsonMatch[0]);
    
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Invalid quiz data structure from Gemini');
    }
    
    return quizData;
  } catch (error) {
    console.error('Error generating initial questions:', error);
    // Return fallback for first 3 questions
    const fallback = getFallbackQuiz(heroName);
    return {
      heroName: fallback.heroName,
      heroBio: fallback.heroBio,
      questions: fallback.questions.slice(0, 3)
    };
  }
}

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
};

export interface QuizQuestion {
  id: number;
  question: string;
  type: 'multiple_choice' | 'true_false';
  options?: string[];
  correctAnswer: string | boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  funnyCommentary: string;
}

export interface QuizData {
  heroName: string;
  heroBio: string;
  questions: QuizQuestion[];
}

export async function generateQuiz(heroName: string): Promise<QuizData> {
  // Check cache first
  const cacheKey = heroName.toLowerCase().trim();
  if (quizCache.has(cacheKey)) {
    console.log(`Using cached quiz for ${heroName}`);
    return quizCache.get(cacheKey)!;
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Simplified, faster prompt
  const prompt = `Create 10 quiz questions about ${heroName} for ShujaaQuest. Mix: 6 multiple choice (A-D), 4 true/false. Difficulty: easy (1-3), medium (4-7), hard (8-10). Add Kenyan humor.

Return JSON only:
{
  "heroName": "${heroName}",
  "heroBio": "Brief bio",
  "questions": [
    {
      "id": 1,
      "question": "Question?",
      "type": "multiple_choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "difficulty": "easy",
      "explanation": "Short explanation",
      "funnyCommentary": "Kenyan humor"
    }
  ]
}`;

  try {
    // 45 second timeout to allow Gemini to respond
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 45000); // 45 second timeout
    });
    
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]) as { response: { text: () => string } };
    
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Gemini response');
    }
    
    const quizData = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== 10) {
      throw new Error('Invalid quiz data structure from Gemini');
    }
    
    // Cache the result
    quizCache.set(cacheKey, quizData);
    
    return quizData;
  } catch (error) {
    console.error('Error generating quiz:', error);
    
    // If it's a timeout or API error, use fallback questions
    if (error instanceof Error && (error.message.includes('timeout') || error.message.includes('API'))) {
      console.log('Using fallback questions due to API timeout');
      return getFallbackQuiz(heroName);
    }
    
    throw new Error('Failed to generate quiz questions');
  }
}

export async function generatePerformanceMessage(score: number, totalQuestions: number, heroName: string): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const prompt = `
Generate a funny, encouraging performance message for a ShujaaQuest player who scored ${score} out of ${totalQuestions} questions (${percentage}%) about ${heroName}.

Requirements:
- Use Kenyan humor and some Sheng slang
- Be encouraging and positive regardless of score
- Reference ${heroName} in the message
- Keep it 1-2 sentences
- Make it fun and memorable

Examples of tone: "Sasa basi!", "Hongera!", "Kweli!", "Hii ni mbaya sana!", "Wewe ni mshujaa!"

Return only the message text, no quotes or extra formatting.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating performance message:', error);
    return `Hongera! You scored ${score}/${totalQuestions} questions about ${heroName}. Keep learning about our shujaas!`;
  }
}
