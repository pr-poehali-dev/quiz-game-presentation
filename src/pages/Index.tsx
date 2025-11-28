import { useState } from 'react';
import { TitleScreen, InstructionsScreen } from '@/components/QuizScreens';
import { QuizScreen } from '@/components/QuizQuestion';
import { ResultsScreen, LeaderboardScreen } from '@/components/QuizResults';
import { StatisticsScreen } from '@/components/QuizStatistics';

type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
};

const questions: Question[] = [
  {
    id: 1,
    category: 'История',
    question: 'В каком году была основана Москва?',
    options: ['1147', '1247', '1047', '1347'],
    correctAnswer: 0,
    explanation: 'Москва была основана в 1147 году князем Юрием Долгоруким. Первое упоминание о Москве в летописях датируется именно этим годом.',
    hint: 'Это событие произошло в XII веке при князе Юрии Долгоруком'
  },
  {
    id: 2,
    category: 'Математика',
    question: 'Чему равна сумма углов треугольника?',
    options: ['90°', '180°', '270°', '360°'],
    correctAnswer: 1,
    explanation: 'Сумма углов любого треугольника всегда равна 180 градусам. Это одна из основных теорем евклидовой геометрии.',
    hint: 'Это число кратно 90 и меньше 360'
  },
  {
    id: 3,
    category: 'География',
    question: 'Какая река является самой длинной в мире?',
    options: ['Амазонка', 'Нил', 'Янцзы', 'Миссисипи'],
    correctAnswer: 1,
    explanation: 'Нил является самой длинной рекой в мире, его длина составляет около 6650 км. Река протекает через 11 стран Африки.',
    hint: 'Эта река находится в Африке и впадает в Средиземное море'
  },
  {
    id: 4,
    category: 'Литература',
    question: 'Кто написал роман "Война и мир"?',
    options: ['Достоевский', 'Толстой', 'Пушкин', 'Чехов'],
    correctAnswer: 1,
    explanation: 'Лев Николаевич Толстой написал роман "Война и мир" в 1869 году. Это произведение считается одним из величайших романов в мировой литературе.',
    hint: 'Автор также написал "Анну Каренину"'
  },
  {
    id: 5,
    category: 'Наука',
    question: 'Какая планета ближайшая к Солнцу?',
    options: ['Венера', 'Марс', 'Меркурий', 'Земля'],
    correctAnswer: 2,
    explanation: 'Меркурий - самая близкая к Солнцу планета Солнечной системы. Среднее расстояние от Меркурия до Солнца составляет около 58 млн км.',
    hint: 'Эта планета названа в честь древнеримского бога торговли'
  }
];

type Screen = 'title' | 'instructions' | 'quiz' | 'results' | 'leaderboard' | 'statistics';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [usedHints, setUsedHints] = useState<number[]>([]);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState<number[]>([]);
  const [removedOptions, setRemovedOptions] = useState<number[]>([]);
  const [skippedQuestions, setSkippedQuestions] = useState<number[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers([...answers, isCorrect]);
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
      setRemovedOptions([]);
    } else {
      setCurrentScreen('results');
    }
  };

  const handleFiftyFifty = () => {
    if (fiftyFiftyUsed.includes(currentQuestion.id)) return;
    
    const wrongAnswers = currentQuestion.options
      .map((_, index) => index)
      .filter(index => index !== currentQuestion.correctAnswer);
    
    const toRemove = wrongAnswers.slice(0, 2);
    setRemovedOptions(toRemove);
    setFiftyFiftyUsed([...fiftyFiftyUsed, currentQuestion.id]);
  };

  const handleSkip = () => {
    setSkippedQuestions([...skippedQuestions, currentQuestion.id]);
    handleNext();
  };

  const handleHint = () => {
    setShowHint(true);
    if (!usedHints.includes(currentQuestion.id)) {
      setUsedHints([...usedHints, currentQuestion.id]);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setShowHint(false);
    setUsedHints([]);
    setFiftyFiftyUsed([]);
    setRemovedOptions([]);
    setSkippedQuestions([]);
    setCurrentScreen('title');
  };

  if (currentScreen === 'title') {
    return <TitleScreen questionsCount={questions.length} onNavigate={setCurrentScreen} />;
  }

  if (currentScreen === 'instructions') {
    return <InstructionsScreen onNavigate={setCurrentScreen} />;
  }

  if (currentScreen === 'quiz') {
    return (
      <QuizScreen
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        showExplanation={showExplanation}
        showHint={showHint}
        removedOptions={removedOptions}
        fiftyFiftyUsed={fiftyFiftyUsed.includes(currentQuestion.id)}
        onAnswer={handleAnswer}
        onConfirm={handleConfirm}
        onNext={handleNext}
        onFiftyFifty={handleFiftyFifty}
        onHint={handleHint}
        onSkip={handleSkip}
      />
    );
  }

  if (currentScreen === 'results') {
    return (
      <ResultsScreen
        score={score}
        totalQuestions={questions.length}
        answers={answers}
        usedHints={usedHints}
        onNavigate={setCurrentScreen}
        onReset={resetQuiz}
      />
    );
  }

  if (currentScreen === 'leaderboard') {
    return <LeaderboardScreen totalQuestions={questions.length} onNavigate={setCurrentScreen} />;
  }

  if (currentScreen === 'statistics') {
    return (
      <StatisticsScreen
        questions={questions}
        answers={answers}
        usedHints={usedHints}
        skippedQuestions={skippedQuestions}
        onNavigate={setCurrentScreen}
        onReset={resetQuiz}
      />
    );
  }

  return null;
};

export default Index;
