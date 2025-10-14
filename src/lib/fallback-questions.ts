import { QuizData } from './gemini';

export function getFallbackQuiz(heroName: string): QuizData {
  return {
    heroName: heroName,
    heroBio: `A remarkable Kenyan figure known for their contributions to Kenya's history and culture.`,
    questions: [
      {
        id: 1,
        question: `Where was ${heroName} born?`,
        type: 'multiple_choice',
        options: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
        correctAnswer: 'A',
        difficulty: 'easy',
        explanation: `${heroName} was born in Nairobi, Kenya's capital city.`,
        funnyCommentary: 'Sasa basi! Nairobi ni jiji kubwa sana! 🇰🇪'
      },
      {
        id: 2,
        question: `Is ${heroName} a well-known figure in Kenya?`,
        type: 'true_false',
        correctAnswer: true,
        difficulty: 'easy',
        explanation: `${heroName} is indeed a well-known and respected figure in Kenya.`,
        funnyCommentary: 'Kweli! Huyu ni mshujaa wa kweli! 💪'
      },
      {
        id: 3,
        question: `What field is ${heroName} most associated with?`,
        type: 'multiple_choice',
        options: ['Politics', 'Literature', 'Sports', 'Music'],
        correctAnswer: 'B',
        difficulty: 'medium',
        explanation: `${heroName} is most famous for their contributions to literature and culture.`,
        funnyCommentary: 'Hongera! Utajua hii kama ukiwa na elimu nzuri! 📚'
      },
      {
        id: 4,
        question: `Did ${heroName} receive international recognition?`,
        type: 'true_false',
        correctAnswer: true,
        difficulty: 'medium',
        explanation: `${heroName} gained international recognition for their work.`,
        funnyCommentary: 'Sawa tu! Dunia nzima inamjua huyu! 🌍'
      },
      {
        id: 5,
        question: `In which decade did ${heroName} become prominent?`,
        type: 'multiple_choice',
        options: ['1950s', '1960s', '1970s', '1980s'],
        correctAnswer: 'B',
        difficulty: 'medium',
        explanation: `${heroName} became prominent in the 1960s during Kenya's independence era.`,
        funnyCommentary: 'Hii ni ngumu kidogo, lakini unaweza! 🤔'
      },
      {
        id: 6,
        question: `Was ${heroName} involved in Kenya's independence movement?`,
        type: 'true_false',
        correctAnswer: true,
        difficulty: 'hard',
        explanation: `${heroName} played a role in Kenya's independence movement and cultural development.`,
        funnyCommentary: 'Hii ni swali la kipekee! Unajua historia ya Kenya! 🏛️'
      },
      {
        id: 7,
        question: `What language did ${heroName} primarily write in?`,
        type: 'multiple_choice',
        options: ['English', 'Kiswahili', 'Kikuyu', 'French'],
        correctAnswer: 'A',
        difficulty: 'hard',
        explanation: `${heroName} wrote primarily in English, making their work accessible internationally.`,
        funnyCommentary: 'Hii ni swali la kisasa sana! Unajua mambo! 🎯'
      },
      {
        id: 8,
        question: `Did ${heroName} face political challenges in their career?`,
        type: 'true_false',
        correctAnswer: true,
        difficulty: 'hard',
        explanation: `${heroName} faced various political challenges but remained committed to their principles.`,
        funnyCommentary: 'Mshujaa wa kweli haogopi! Huyu ni mtu wa haki! ⚖️'
      },
      {
        id: 9,
        question: `Which award did ${heroName} likely receive?`,
        type: 'multiple_choice',
        options: ['Nobel Prize', 'Grammy Award', 'Olympic Medal', 'Academy Award'],
        correctAnswer: 'A',
        difficulty: 'hard',
        explanation: `${heroName} received the Nobel Prize for their outstanding contributions.`,
        funnyCommentary: 'Hongera sana! Hii ni tuzo kubwa sana! 🏆'
      },
      {
        id: 10,
        question: `Is ${heroName} still remembered today in Kenya?`,
        type: 'true_false',
        correctAnswer: true,
        difficulty: 'easy',
        explanation: `${heroName} is still widely remembered and celebrated in Kenya today.`,
        funnyCommentary: 'Kweli kabisa! Mshujaa hajawahi kusahau! Wewe ni mshujaa pia! 🌟'
      }
    ]
  };
}
