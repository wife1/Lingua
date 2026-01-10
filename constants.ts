
import { Language, Lesson, DailyGoal, GrammarItem } from './types';

export const LANGUAGES: Language[] = [
  { id: 'en-us', name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
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
  { id: 'rs', name: 'Serbian', nativeName: 'Сርпски', flag: '🇷🇸' },
  { id: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { id: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { id: 'pt-pt', name: 'Portuguese (PT)', nativeName: 'Português', flag: '🇵🇹' },
  { id: 'pt-br', name: 'Portuguese (BR)', nativeName: 'Português', flag: '🇧🇷' },
  { id: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { id: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  { id: 'nn', name: 'Nynorsk', nativeName: 'Nynorsk', flag: '🇳🇴' },
  { id: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { id: 'mr', name: 'Marathi', nativeName: 'मራठी', flag: '🇮🇳' },
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
  { id: 'ady', name: 'Adyghe', nativeName: 'Адыгабзэ', flag: '🇷🇺' },
  { id: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { id: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪ት' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { id: 'hy', name: 'Armenian', nativeName: 'Հայერեն', flag: '🇦🇲' },
  { id: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { id: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦' },
  { id: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { id: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇦🇩' },
  { id: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { id: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { id: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { id: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { id: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
];

export const GRAMMAR_BANK_DATA: Record<string, GrammarItem[]> = {
  'en-us': [
    { id: 'g1', title: 'Present Continuous', icon: '⏳', explanation: 'Used to describe actions happening right now.', examples: ['I am learning.', 'He is eating.'], color: 'bg-blue-100', level: 'Beginner' },
    { id: 'g2', title: 'Modal Verbs', icon: '❓', explanation: 'Verbs that indicate necessity or possibility.', examples: ['I must go.', 'You can stay.'], color: 'bg-yellow-100', level: 'Intermediate' }
  ],
  'es': [
    { id: 'g1', title: 'Ser vs Estar', icon: '🔄', explanation: 'Both mean "to be", but "Ser" is permanent and "Estar" is temporary.', examples: ['Soy alto.', 'Estoy feliz.'], color: 'bg-red-100', level: 'Beginner' },
    { id: 'g2', title: 'The Subjunctive', icon: '🧠', explanation: 'Used for desires, doubts, and the unknown.', examples: ['Espero que vengas.', 'Dudo que sea así.'], color: 'bg-purple-100', level: 'Advanced' }
  ],
};

const DEFAULT_TOPICS = [
  { title: 'Greetings & Basics', icon: '👋', cat: 'Essential', color: 'bg-yellow-400', grammar: 'Polite particles vary by gender and context.', vocab: ['Hello', 'Good Morning', 'Thank you', 'Please'] },
  { title: 'Street Food Tour', icon: '🍲', cat: 'Food', color: 'bg-orange-400', grammar: 'Using classifiers for ordering different types of dishes.', vocab: ['Rice', 'Spicy', 'Yummy', 'Bill'] },
  { title: 'Finding Your Way', icon: '🗺️', cat: 'Travel', color: 'bg-blue-400', grammar: 'Prepositions of place and movement indicators.', vocab: ['Left', 'Right', 'Straight', 'Map'] },
  { title: 'At the Market', icon: '🛍️', cat: 'Shopping', color: 'bg-emerald-400', grammar: 'Numerical systems and currency classifiers.', vocab: ['Price', 'Expensive', 'Cheap', 'Money'] },
  { title: 'Social Media', icon: '📱', cat: 'Digital', color: 'bg-purple-400', grammar: 'Informal slang and abbreviation rules.', vocab: ['Post', 'Like', 'Share', 'Friend'] },
  { title: 'Space Exploration', icon: '🚀', cat: 'Science', color: 'bg-indigo-600', grammar: 'Future tense markers for hypothetical situations.', vocab: ['Planet', 'Galaxy', 'Astronaut', 'Rocket'] },
  { title: 'Ancient Legends', icon: '🏺', cat: 'History', color: 'bg-amber-600', grammar: 'Narrative past tense for storytelling.', vocab: ['Myth', 'Empire', 'God', 'Ruins'] },
  { title: 'Digital Nomad life', icon: '💻', cat: 'Digital', color: 'bg-cyan-500', grammar: 'Using "while" and "during" for simultaneous activities.', vocab: ['Remote', 'WiFi', 'Laptop', 'Coworking'] },
  { title: 'Fashion Trends', icon: '👗', cat: 'Art', color: 'bg-pink-400', grammar: 'Comparative adjectives for styles.', vocab: ['Style', 'Elegant', 'Trendy', 'Vintage'] },
  { title: 'Cooking Secrets', icon: '🍳', cat: 'Food', color: 'bg-red-400', grammar: 'Imperatives for recipe steps.', vocab: ['Sauté', 'Boil', 'Season', 'Flavor'] },
  { title: 'Business Ethics', icon: '⚖️', cat: 'Professional', color: 'bg-slate-700', grammar: 'Formal modals for professional requests.', vocab: ['Trust', 'Profit', 'Integrity', 'Market'] },
  { title: 'Marine Life', icon: '🐬', cat: 'Nature', color: 'bg-blue-600', grammar: 'Countable vs Uncountable nouns in biology.', vocab: ['Ocean', 'Coral', 'Shark', 'Deep'] },
  { title: 'Modern Architecture', icon: '🏛️', cat: 'Art', color: 'bg-stone-500', grammar: 'Prepositions of direction and space.', vocab: ['Design', 'Structure', 'Modern', 'Symmetry'] },
  { title: 'Music Festivals', icon: '🎼', cat: 'Entertainment', color: 'bg-fuchsia-500', grammar: 'Relative clauses for describing experiences.', vocab: ['Stage', 'Beat', 'Rhythm', 'Concert'] },
  { title: 'Forest Wildlife', icon: '🦊', cat: 'Nature', color: 'bg-green-600', grammar: 'Adverbs of frequency for animal habits.', vocab: ['Animal', 'Habit', 'Shelter', 'Trail'] },
  { title: 'Winter Sports', icon: '⛷️', cat: 'Sports', color: 'bg-sky-200', grammar: 'Conditional "if" for safety warnings.', vocab: ['Snow', 'Ski', 'Slope', 'Cold'] },
  { title: 'Public Transport', icon: '🚌', cat: 'Travel', color: 'bg-zinc-500', grammar: 'Time expressions for schedules.', vocab: ['Bus', 'Ticket', 'Route', 'Delay'] },
  { title: 'Night Sky', icon: '🌌', cat: 'Science', color: 'bg-neutral-900', grammar: 'Superlatives for astronomical bodies.', vocab: ['Star', 'Comet', 'Moon', 'Light'] },
  { title: 'Board Games', icon: '🎲', cat: 'Hobbies', color: 'bg-rose-500', grammar: 'Quantifiers (some, many, few) in game rules.', vocab: ['Player', 'Strategy', 'Winner', 'Turn'] },
  { title: 'Yoga & Health', icon: '🧘', cat: 'Wellness', color: 'bg-emerald-300', grammar: 'Stative verbs of perception.', vocab: ['Breath', 'Peace', 'Mind', 'Stretch'] },
  { title: 'Robotics', icon: '🤖', cat: 'Science', color: 'bg-gray-400', grammar: 'Passive voice for automated processes.', vocab: ['AI', 'Sensor', 'Program', 'Logic'] },
  { title: 'Photography', icon: '📷', cat: 'Art', color: 'bg-black', grammar: 'Using "too" and "enough" for lighting.', vocab: ['Focus', 'Lens', 'Frame', 'Capture'] },
  { title: 'Daily Routine', icon: '⏰', cat: 'Essential', color: 'bg-violet-400', grammar: 'Simple present for recurring actions.', vocab: ['Wake up', 'Work', 'Study', 'Sleep'] },
  { title: 'Pets & Care', icon: '🐕', cat: 'Home', color: 'bg-orange-300', grammar: 'Possessive adjectives for pet ownership.', vocab: ['Fur', 'Bail', 'Vet', 'Loyal'] },
  { title: 'Gardening Tips', icon: '🌻', cat: 'Home', color: 'bg-yellow-500', grammar: 'Prepositions of place (in, on, under) for planting.', vocab: ['Soil', 'Water', 'Seed', 'Bloom'] },
  { title: 'Movie Night', icon: '🎬', cat: 'Entertainment', color: 'bg-red-700', grammar: 'Participles as adjectives (boring vs bored).', vocab: ['Plot', 'Cast', 'Scene', 'Review'] },
  { title: 'Chess Strategy', icon: '♟️', cat: 'Hobbies', color: 'bg-stone-800', grammar: 'Zero conditional for game mechanics.', vocab: ['Mate', 'Pawn', 'Knight', 'Move'] },
  { title: 'Virtual Reality', icon: '🥽', cat: 'Digital', color: 'bg-cyan-600', grammar: 'Future continuous for immersive tech.', vocab: ['Avatar', 'Digital', 'Immersion', 'Space'] },
  { title: 'Mountain Hiking', icon: '🧗', cat: 'Sports', color: 'bg-orange-800', grammar: 'Gerunds as subjects for physical activity.', vocab: ['Climb', 'Height', 'Gear', 'Summit'] },
  { title: 'Baking Bread', icon: '🍞', cat: 'Food', color: 'bg-amber-300', grammar: 'Sequence adverbs (first, next, then).', vocab: ['Flour', 'Yeast', 'Knead', 'Rise'] },
  { title: 'Weather Talk', icon: '🌦️', cat: 'Essential', color: 'bg-sky-400', grammar: 'Impersonal "it" for weather.', vocab: ['Rain', 'Sunny', 'Storm', 'Warm'] },
  { title: 'Art Gallery', icon: '🖼️', cat: 'Art', color: 'bg-indigo-400', grammar: 'Adjectives of opinion vs fact.', vocab: ['Modern', 'Exhibit', 'Canvas', 'Artist'] },
  { title: 'Gym Workout', icon: '💪', cat: 'Wellness', color: 'bg-blue-800', grammar: 'Modals of ability (can, could, be able to).', vocab: ['Lift', 'Strong', 'Health', 'Pulse'] },
  { title: 'Desert Secrets', icon: '🏜️', cat: 'Nature', color: 'bg-yellow-700', grammar: 'Quantifiers (little, much) for resources.', vocab: ['Sand', 'Oasis', 'Heat', 'Dune'] },
  { title: 'Camping Trip', icon: '🏕️', cat: 'Travel', color: 'bg-green-800', grammar: 'Using "be going to" for future plans.', vocab: ['Tent', 'Fire', 'Night', 'Wild'] },
  { title: 'Volunteering', icon: '🤝', cat: 'Society', color: 'bg-rose-400', grammar: 'Relative pronouns for social causes.', vocab: ['Help', 'Support', 'Change', 'Goal'] },
  { title: 'Coffee Culture', icon: '☕', cat: 'Food', color: 'bg-stone-600', grammar: 'Adverbs of manner for flavor descriptions.', vocab: ['Aroma', 'Roast', 'Bean', 'Brew'] },
  { title: 'Airport Journey', icon: '✈️', cat: 'Travel', color: 'bg-blue-300', grammar: 'Present perfect for travel history.', vocab: ['Flight', 'Gate', 'Check-in', 'Luggage'] },
  { title: 'Startup Pitch', icon: '💡', cat: 'Professional', color: 'bg-yellow-600', grammar: 'Persuasive rhetoric and emphatic "do".', vocab: ['Vision', 'Equity', 'Launch', 'Scale'] },
  { title: 'Medieval Castles', icon: '🏰', cat: 'History', color: 'bg-gray-600', grammar: 'Past perfect for historical context.', vocab: ['Wall', 'Knight', 'Siege', 'King'] },
  { title: 'Global News', icon: '📰', cat: 'Society', color: 'bg-blue-900', grammar: 'Reported speech for journalism.', vocab: ['Event', 'Update', 'Source', 'Report'] },
  { title: 'Library Study', icon: '📚', cat: 'Professional', color: 'bg-amber-800', grammar: 'Modals of obligation (must, should).', vocab: ['Book', 'Silence', 'Thesis', 'Notes'] },
  { title: 'Cycling Trails', icon: '🚲', cat: 'Sports', color: 'bg-lime-500', grammar: 'Directional prepositions (along, across).', vocab: ['Pedal', 'Tire', 'Path', 'Speed'] },
  { title: 'Ocean Waves', icon: '🌊', cat: 'Nature', color: 'bg-blue-700', grammar: 'Causative verbs for natural forces.', vocab: ['Tide', 'Salt', 'Current', 'Blue'] },
  { title: 'Romantic Dinner', icon: '🕯️', cat: 'Entertainment', color: 'bg-rose-600', grammar: 'Softening requests with "would like".', vocab: ['Table', 'Wine', 'Music', 'Light'] },
  { title: 'School Days', icon: '🏫', cat: 'Essential', color: 'bg-orange-500', grammar: 'Ordinal numbers for grades.', vocab: ['Class', 'Teacher', 'Test', 'Grade'] },
  { title: 'Tropical Beach', icon: '🌴', cat: 'Travel', color: 'bg-teal-400', grammar: 'Exclamatory sentences (What a...!).', vocab: ['Palm', 'Coconut', 'Shell', 'Sun'] },
  { title: 'DIY Projects', icon: '🔨', cat: 'Home', color: 'bg-neutral-600', grammar: 'Process verbs for construction.', vocab: ['Tool', 'Measure', 'Build', 'Fix'] },
  { title: 'Magic Tricks', icon: '🪄', cat: 'Entertainment', color: 'bg-fuchsia-700', grammar: 'Causal conjunctions (because, so).', vocab: ['Card', 'Secret', 'Wand', 'Show'] },
  { title: 'Space Science', icon: '🪐', cat: 'Science', color: 'bg-purple-900', grammar: 'Scientific passive for phenomena.', vocab: ['Gravity', 'Orbit', 'Mass', 'Force'] },
  { title: 'Street Art', icon: '🎨', cat: 'Art', color: 'bg-red-500', grammar: 'Present continuous for dynamic scenes.', vocab: ['Spray', 'Wall', 'Mural', 'Color'] },
  { title: 'Fruit Market', icon: '🍎', cat: 'Food', color: 'bg-green-400', grammar: 'Pluralization of irregular nouns.', vocab: ['Sweet', 'Fresh', 'Ripe', 'Store'] },
  { title: 'Ancient Rome', icon: '🏛️', cat: 'History', color: 'bg-stone-400', grammar: 'Latin roots in modern grammar.', vocab: ['Forum', 'Senate', 'Law', 'Road'] },
  { title: 'Coding Life', icon: '⌨️', cat: 'Professional', color: 'bg-slate-900', grammar: 'Conditional logic in language.', vocab: ['Code', 'Bug', 'Deploy', 'Merge'] },
  { title: 'Urban Life', icon: '🏙️', cat: 'Society', color: 'bg-sky-600', grammar: 'Relative clauses with "where".', vocab: ['Street', 'City', 'Crowd', 'Flat'] },
];

export const getGrammarDataForLang = (langId: string): GrammarItem[] => {
  const base = GRAMMAR_BANK_DATA[langId] || [];
  const genericItems: GrammarItem[] = DEFAULT_TOPICS.map((topic, index) => ({
    id: `g_gen_${langId}_${index}`,
    title: topic.title + " Grammar",
    icon: topic.icon,
    explanation: topic.grammar,
    examples: [
      `How to use vocabulary like "${topic.vocab[0]}" correctly.`,
      `Applying "${topic.grammar.split('.')[0]}" in a sentence.`
    ],
    color: topic.color.replace('bg-', 'bg-').replace('-500', '-100').replace('-600', '-100').replace('-700', '-100').replace('-800', '-100').replace('-900', '-100').replace('-400', '-100'),
    level: index < 15 ? 'Beginner' : index < 35 ? 'Intermediate' : 'Advanced'
  }));

  // Ensure unique colors for generic items if replacement logic didn't catch all
  genericItems.forEach(item => {
    if (!item.color.endsWith('-100')) item.color = 'bg-gray-100';
  });

  return [...base, ...genericItems].slice(0, 55); // Limit to a manageable number but enough for "50 more"
};

export const getLessonsForLang = (langId: string): Lesson[] => {
  return DEFAULT_TOPICS.map((t, i) => ({
    id: `l${i}`,
    title: t.title,
    category: t.cat,
    difficulty: i < 15 ? 'Beginner' : i < 35 ? 'Intermediate' : 'Advanced',
    progress: i === 0 ? 100 : 0, 
    icon: t.icon,
    color: t.color,
    grammarNotes: t.grammar,
    vocabulary: t.vocab,
    needsReview: i % 10 === 0 && i > 0 // Scatter some review needs
  }));
};

export const INITIAL_LESSON_DATA = (): Lesson[] => getLessonsForLang('en-us');

export const MOCK_QUIZ_GREETINGS = [
  {
    id: 'q1',
    type: 'MATCH',
    prompt: 'Match the terms to their meanings:',
    pairs: [
      { key: 'Bonjour', value: 'Hello (French)' },
      { key: 'Hola', value: 'Hello (Spanish)' },
      { key: 'Ciao', value: 'Hello/Goodbye (Italian)' },
    ]
  },
  {
    id: 'q2',
    type: 'MULTIPLE_CHOICE',
    prompt: 'Which of these is used for a formal greeting?',
    options: ['Hey', 'Good morning', 'Yo', 'What\'s up'],
    correctAnswer: 'Good morning'
  },
];

export const MOCK_GOALS: DailyGoal[] = [
  { id: 'g1', title: 'Complete 1 Lesson', completed: false, target: 1, current: 0, icon: '📚' },
  { id: 'g2', title: 'Practice Chat for 5 mins', completed: true, target: 1, current: 1, icon: '💬' },
  { id: 'g3', title: 'Earn 100 XP', completed: false, target: 100, current: 45, icon: '⚡' },
];
