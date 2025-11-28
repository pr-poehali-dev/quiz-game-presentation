import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

type Screen = 'title' | 'instructions' | 'quiz' | 'results' | 'leaderboard' | 'statistics';

type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
};

type StatisticsScreenProps = {
  questions: Question[];
  answers: boolean[];
  usedHints: number[];
  skippedQuestions: number[];
  onNavigate: (screen: Screen) => void;
  onReset: () => void;
};

export const StatisticsScreen = ({ 
  questions, 
  answers, 
  usedHints, 
  skippedQuestions, 
  onNavigate, 
  onReset 
}: StatisticsScreenProps) => {
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
              onClick={() => onNavigate('title')} 
              variant="outline"
              className="flex-1"
            >
              <Icon name="Home" className="mr-2" size={18} />
              На главную
            </Button>
            <Button 
              onClick={onReset} 
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
};
