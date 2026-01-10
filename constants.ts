
import { Language, Lesson, DailyGoal } from './types';

export const LANGUAGES: Language[] = [
  { id: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭' },
  { id: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { id: 'jp', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { id: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { id: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { id: 'ua', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { id: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { id: 'se', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { id: 'si', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { id: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { id: 'rs', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸' },
  { id: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { id: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { id: 'pt-pt', name: 'Portuguese (PT)', nativeName: 'Português', flag: '🇵🇹' },
  { id: 'pt-br', name: 'Portuguese (BR)', nativeName: 'Português', flag: '🇧🇷' },
  { id: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { id: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  { id: 'nn', name: 'Nynorsk', nativeName: 'Nynorsk', flag: '🇳🇴' },
  { id: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { id: 'mr', name: 'Marathi', nativeName: 'मਰਾठी', flag: '🇮🇳' },
  { id: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰' },
  { id: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  { id: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  { id: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { id: 'kz', name: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿' },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { id: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { id: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { id: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { id: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  { id: 'gr', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { id: 'ge', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
  { id: 'ee', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { id: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: '🌍' },
  { id: 'en-us', name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
  { id: 'ady', name: 'Adyghe', nativeName: 'Адыгабзэ', flag: '🇷🇺' },
  { id: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { id: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { id: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲' },
  { id: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { id: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦' },
  { id: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { id: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸' },
  { id: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { id: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { id: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { id: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { id: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
];

const GENERATE_EXTRA_LESSONS = (): Lesson[] => {
  const base: Lesson[] = [
    { id: 'l1', title: 'Greetings & Basics', category: 'Essential', difficulty: 'Beginner', progress: 100, icon: '👋', color: 'bg-yellow-400', grammarNotes: 'Thai uses polite particles "khrap" and "kha".', vocabulary: ['Sawasdee', 'Khob khun', 'Khor thod'] },
    { id: 'l2', title: 'Food & Drinks', category: 'Daily Life', difficulty: 'Beginner', progress: 30, icon: '🍜', color: 'bg-green-400', grammarNotes: 'Classifiers are used for nouns.', vocabulary: ['Gin', 'Nam', 'Aroi'] },
    { id: 'l3', title: 'Numbers 1-100', category: 'Basics', difficulty: 'Beginner', progress: 10, icon: '🔢', color: 'bg-blue-400', grammarNotes: 'Base 10 counting system.', vocabulary: ['Nueng', 'Sip', 'Roi'] },
    { id: 'l4', title: 'Asking for Directions', category: 'Travel', difficulty: 'Intermediate', progress: 0, icon: '🗺️', color: 'bg-purple-400', grammarNotes: 'Question particles go at the end.', vocabulary: ['Leo sai', 'Trong pai', 'Tee nai'] },
    { id: 'l5', title: 'At the Doctor', category: 'Emergency', difficulty: 'Intermediate', progress: 0, icon: '🏥', color: 'bg-red-400', grammarNotes: 'Expressing pain with "puat".', vocabulary: ['Puat', 'Yaa', 'Sabai'] },
    { id: 'l6', title: 'Business Culture', category: 'Formal', difficulty: 'Advanced', progress: 0, icon: '💼', color: 'bg-indigo-400', grammarNotes: 'Honorifics in professional settings.', vocabulary: ['Prachum', 'Borisat', 'Sanya'] },
  ];

  const categories = ['Travel', 'Food', 'Social', 'Nature', 'Business', 'Technology', 'Hobbies', 'Shopping', 'Emotions', 'Education'];
  const difficulties: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const colors = ['bg-pink-400', 'bg-orange-400', 'bg-cyan-400', 'bg-lime-400', 'bg-teal-400', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400'];
  const icons = ['🌴', '✈️', '🥗', '🏢', '📱', '🎭', '🎨', '🐶', '🍕', '🧗', '🌋', '⛺', '🏠', '🛍️', '🎓', '❤️', '⚖️', '🔋', '🚀', '🎸'];

  const extra: Lesson[] = [];
  for (let i = 7; i <= 56; i++) {
    const cat = categories[i % categories.length];
    const diff = difficulties[i % difficulties.length];
    const icon = icons[i % icons.length];
    const color = colors[i % colors.length];
    extra.push({
      id: `l${i}`,
      title: `${cat} Module ${Math.floor(i / categories.length) + 1}`,
      category: cat,
      difficulty: diff,
      progress: 0,
      icon: icon,
      color: color,
      grammarNotes: `Expanded grammar rules for ${cat} in ${diff} context.`,
      vocabulary: [`WordA${i}`, `WordB${i}`, `WordC${i}`],
      needsReview: i % 10 === 0 // Mark some for SRS
    });
  }

  return [...base, ...extra];
};

export const MOCK_LESSONS: Lesson[] = GENERATE_EXTRA_LESSONS();

export const MOCK_QUIZ_GREETINGS = [
  {
    id: 'q1',
    type: 'MATCH',
    prompt: 'Match the English words to their Thai translations',
    pairs: [
      { key: 'Hello', value: 'Sawasdee' },
      { key: 'Thank you', value: 'Khob khun' },
      { key: 'Sorry', value: 'Khor thod' },
      { key: 'Goodbye', value: 'La gon' }
    ]
  },
  {
    id: 'q2',
    type: 'MULTIPLE_CHOICE',
    prompt: 'How do you say "Thank you" in Thai?',
    options: ['Sawasdee', 'Khob khun', 'Khor thod', 'Chai'],
    correctAnswer: 'Khob khun'
  },
  {
    id: 'q3',
    type: 'ARRANGE',
    prompt: 'Arrange the sentence: "Hello, how are you?"',
    options: ['Sawasdee', 'khun', 'sabai dee mai', '?'],
    correctAnswer: ['Sawasdee', 'khun', 'sabai dee mai', '?']
  }
];

export const MOCK_GOALS: DailyGoal[] = [
  { id: 'g1', title: 'Complete 1 Lesson', completed: false, target: 1, current: 0, icon: '📚' },
  { id: 'g2', title: 'Practice Chat for 5 mins', completed: true, target: 1, current: 1, icon: '💬' },
  { id: 'g3', title: 'Earn 100 XP', completed: false, target: 100, current: 45, icon: '⚡' },
];
