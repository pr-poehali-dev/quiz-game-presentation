import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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

  const getScoreGrade = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { grade: 'Отлично', color: 'text-green-600', icon: 'Award' };
    if (percentage >= 70) return { grade: 'Хорошо', color: 'text-blue-600', icon: 'ThumbsUp' };
    if (percentage >= 50) return { grade: 'Удовлетворительно', color: 'text-yellow-600', icon: 'Meh' };
    return { grade: 'Требуется улучшение', color: 'text-red-600', icon: 'TrendingDown' };
  };

  const getCategoryStats = () => {
    const stats: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, index) => {
      if (!stats[q.category]) {
        stats[q.category] = { correct: 0, total: 0 };
      }
      stats[q.category].total++;
      if (answers[index]) {
        stats[q.category].correct++;
      }
    });
    return stats;
  };

  if (currentScreen === 'title') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl animate-fade-in">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-6 rounded-full">
                <Icon name="BookOpen" size={64} className="text-primary" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-primary">Образовательный квиз</CardTitle>
            <CardDescription className="text-lg">
              Проверьте свои знания в различных областях
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <Icon name="FileQuestion" className="text-primary" size={20} />
                <span className="font-medium">Вопросов: {questions.length}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Lightbulb" className="text-primary" size={20} />
                <span className="font-medium">Доступны подсказки и пояснения</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Target" className="text-primary" size={20} />
                <span className="font-medium">Система оценки результатов</span>
              </div>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => setCurrentScreen('instructions')} 
                className="w-full h-14 text-lg"
                size="lg"
              >
                Начать квиз
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setCurrentScreen('leaderboard')} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Icon name="Trophy" className="mr-2" size={18} />
                  Рейтинг
                </Button>
                <Button 
                  onClick={() => setCurrentScreen('statistics')} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Icon name="BarChart3" className="mr-2" size={18} />
                  Статистика
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
              <Icon name="Info" size={32} />
              Инструкция
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Icon name="CircleHelp" size={20} className="text-primary" />
                  Как отвечать на вопросы
                </h3>
                <p className="text-muted-foreground">
                  Выберите один вариант ответа из предложенных и нажмите кнопку "Подтвердить ответ". 
                  После подтверждения вы увидите правильный ответ и его пояснение.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Icon name="Lightbulb" size={20} className="text-green-600" />
                  Подсказки
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="Zap" size={16} className="mt-1 text-green-600" />
                    <span><strong>50/50</strong> - убирает два неправильных варианта ответа</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="HelpCircle" size={16} className="mt-1 text-green-600" />
                    <span><strong>Подсказка</strong> - показывает текстовую подсказку к вопросу</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="SkipForward" size={16} className="mt-1 text-green-600" />
                    <span><strong>Пропустить</strong> - переход к следующему вопросу без ответа</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Icon name="Award" size={20} className="text-yellow-600" />
                  Оценка результатов
                </h3>
                <p className="text-muted-foreground">
                  После прохождения всех вопросов вы увидите свой результат, оценку и детальную статистику 
                  по категориям. Также доступен рейтинг лучших результатов.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setCurrentScreen('title')} 
                variant="outline"
                className="flex-1"
              >
                <Icon name="ArrowLeft" className="mr-2" size={18} />
                Назад
              </Button>
              <Button 
                onClick={() => setCurrentScreen('quiz')} 
                className="flex-1"
              >
                Начать тест
                <Icon name="Play" className="ml-2" size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-xl animate-fade-in">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {currentQuestion.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Вопрос {currentQuestionIndex + 1} из {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            <CardTitle className="text-2xl font-semibold leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {showHint && (
              <Alert className="bg-blue-50 border-blue-200">
                <Icon name="Lightbulb" className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  {currentQuestion.hint}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isRemoved = removedOptions.includes(index);
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showResult = showExplanation;

                let buttonVariant: "default" | "outline" | "secondary" = "outline";
                let buttonClass = "h-auto py-4 px-6 text-left justify-start transition-all";

                if (isRemoved) {
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-4 px-6 text-left justify-start w-full opacity-30"
                      disabled
                    >
                      <span className="line-through">{option}</span>
                    </Button>
                  );
                }

                if (showResult) {
                  if (isCorrect) {
                    buttonClass += " bg-green-100 border-green-500 hover:bg-green-100";
                  } else if (isSelected) {
                    buttonClass += " bg-red-100 border-red-500 hover:bg-red-100";
                  }
                } else if (isSelected) {
                  buttonVariant = "default";
                }

                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    className={`w-full ${buttonClass}`}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                  >
                    <span className="flex items-center gap-3 w-full">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && isCorrect && (
                        <Icon name="CheckCircle2" className="text-green-600" size={20} />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <Icon name="XCircle" className="text-red-600" size={20} />
                      )}
                    </span>
                  </Button>
                );
              })}
            </div>

            {showExplanation && (
              <Alert className="bg-primary/5 border-primary/20 animate-fade-in">
                <Icon name="BookOpen" className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                  <strong className="block mb-2">Пояснение:</strong>
                  {currentQuestion.explanation}
                </AlertDescription>
              </Alert>
            )}

            {!showExplanation && (
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleFiftyFifty}
                  variant="outline"
                  size="sm"
                  disabled={fiftyFiftyUsed.includes(currentQuestion.id)}
                  className="flex-1"
                >
                  <Icon name="Zap" className="mr-2" size={16} />
                  50/50
                </Button>
                <Button
                  onClick={handleHint}
                  variant="outline"
                  size="sm"
                  disabled={showHint}
                  className="flex-1"
                >
                  <Icon name="HelpCircle" className="mr-2" size={16} />
                  Подсказка
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Icon name="SkipForward" className="mr-2" size={16} />
                  Пропустить
                </Button>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {!showExplanation ? (
                <Button 
                  onClick={handleConfirm} 
                  disabled={selectedAnswer === null}
                  className="w-full h-12"
                >
                  Подтвердить ответ
                  <Icon name="Check" className="ml-2" size={18} />
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  className="w-full h-12"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Показать результаты'}
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'results') {
    const { grade, color, icon } = getScoreGrade();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className={`p-6 rounded-full ${color} bg-opacity-10`}>
                <Icon name={icon as any} size={64} className={color} />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold">Результаты теста</CardTitle>
            <CardDescription className={`text-2xl font-semibold ${color}`}>
              {grade}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Правильных ответов:</span>
                <span className="text-3xl font-bold text-primary">{score} / {questions.length}</span>
              </div>
              <Progress value={percentage} className="h-3" />
              <div className="text-center text-muted-foreground">
                Ваш результат: {percentage}%
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Icon name="List" size={20} />
                Детали прохождения
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                  <Icon name="CheckCircle2" className="mx-auto mb-2 text-green-600" size={24} />
                  <div className="text-2xl font-bold text-green-600">{answers.filter(a => a).length}</div>
                  <div className="text-sm text-muted-foreground">Верно</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                  <Icon name="XCircle" className="mx-auto mb-2 text-red-600" size={24} />
                  <div className="text-2xl font-bold text-red-600">{answers.filter(a => !a).length}</div>
                  <div className="text-sm text-muted-foreground">Неверно</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                  <Icon name="HelpCircle" className="mx-auto mb-2 text-blue-600" size={24} />
                  <div className="text-2xl font-bold text-blue-600">{usedHints.length}</div>
                  <div className="text-sm text-muted-foreground">Подсказок</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={resetQuiz} 
                variant="outline"
                className="flex-1"
              >
                <Icon name="RotateCcw" className="mr-2" size={18} />
                Пройти заново
              </Button>
              <Button 
                onClick={() => setCurrentScreen('statistics')} 
                className="flex-1"
              >
                <Icon name="BarChart3" className="mr-2" size={18} />
                Статистика
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'leaderboard') {
    const leaderboard = [
      { name: 'Анна К.', score: 5, percentage: 100, date: '24.11.2024' },
      { name: 'Дмитрий С.', score: 5, percentage: 100, date: '23.11.2024' },
      { name: 'Елена М.', score: 4, percentage: 80, date: '22.11.2024' },
      { name: 'Игорь П.', score: 4, percentage: 80, date: '21.11.2024' },
      { name: 'Мария В.', score: 3, percentage: 60, date: '20.11.2024' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
              <Icon name="Trophy" size={32} />
              Рейтинг лучших результатов
            </CardTitle>
            <CardDescription>Топ-5 участников с лучшими результатами</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-400 text-orange-900' :
                    'bg-primary/10 text-primary'}`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{entry.name}</div>
                  <div className="text-sm text-muted-foreground">{entry.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-primary">{entry.score}/{questions.length}</div>
                  <div className="text-sm text-muted-foreground">{entry.percentage}%</div>
                </div>
              </div>
            ))}

            <Button 
              onClick={() => setCurrentScreen('title')} 
              variant="outline"
              className="w-full mt-6"
            >
              <Icon name="ArrowLeft" className="mr-2" size={18} />
              Назад на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentScreen === 'statistics') {
    const categoryStats = getCategoryStats();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
              <Icon name="BarChart3" size={32} />
              Статистика по категориям
            </CardTitle>
            <CardDescription>Ваши результаты в различных областях знаний</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const percentage = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{category}</span>
                    <span className="text-muted-foreground">
                      {stats.correct} / {stats.total} ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}

            <div className="bg-muted/50 p-6 rounded-lg space-y-3 mt-6">
              <h3 className="font-semibold text-lg">Общая статистика</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Всего вопросов</div>
                  <div className="text-2xl font-bold text-primary">{questions.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Правильных ответов</div>
                  <div className="text-2xl font-bold text-green-600">{answers.filter(a => a).length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Использовано подсказок</div>
                  <div className="text-2xl font-bold text-blue-600">{usedHints.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Пропущено вопросов</div>
                  <div className="text-2xl font-bold text-orange-600">{skippedQuestions.length}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setCurrentScreen('title')} 
                variant="outline"
                className="flex-1"
              >
                <Icon name="Home" className="mr-2" size={18} />
                На главную
              </Button>
              <Button 
                onClick={resetQuiz} 
                className="flex-1"
              >
                <Icon name="Play" className="mr-2" size={18} />
                Новый тест
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Index;
