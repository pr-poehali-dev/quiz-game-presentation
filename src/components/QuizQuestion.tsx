import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type QuizScreenProps = {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  showHint: boolean;
  removedOptions: number[];
  fiftyFiftyUsed: boolean;
  onAnswer: (index: number) => void;
  onConfirm: () => void;
  onNext: () => void;
  onFiftyFifty: () => void;
  onHint: () => void;
  onSkip: () => void;
};

export const QuizScreen = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  showExplanation,
  showHint,
  removedOptions,
  fiftyFiftyUsed,
  onAnswer,
  onConfirm,
  onNext,
  onFiftyFifty,
  onHint,
  onSkip
}: QuizScreenProps) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl animate-fade-in">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {currentQuestion.category}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Вопрос {currentQuestionIndex + 1} из {totalQuestions}
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
                  onClick={() => onAnswer(index)}
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
                onClick={onFiftyFifty}
                variant="outline"
                size="sm"
                disabled={fiftyFiftyUsed}
                className="flex-1"
              >
                <Icon name="Zap" className="mr-2" size={16} />
                50/50
              </Button>
              <Button
                onClick={onHint}
                variant="outline"
                size="sm"
                disabled={showHint}
                className="flex-1"
              >
                <Icon name="HelpCircle" className="mr-2" size={16} />
                Подсказка
              </Button>
              <Button
                onClick={onSkip}
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
                onClick={onConfirm} 
                disabled={selectedAnswer === null}
                className="w-full h-12"
              >
                Подтвердить ответ
                <Icon name="Check" className="ml-2" size={18} />
              </Button>
            ) : (
              <Button 
                onClick={onNext} 
                className="w-full h-12"
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Следующий вопрос' : 'Показать результаты'}
                <Icon name="ArrowRight" className="ml-2" size={18} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
