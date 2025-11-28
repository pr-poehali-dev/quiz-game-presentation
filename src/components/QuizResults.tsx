import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

type Screen = 'title' | 'instructions' | 'quiz' | 'results' | 'leaderboard' | 'statistics';

type ResultsScreenProps = {
  score: number;
  totalQuestions: number;
  answers: boolean[];
  usedHints: number[];
  onNavigate: (screen: Screen) => void;
  onReset: () => void;
};

export const ResultsScreen = ({ 
  score, 
  totalQuestions, 
  answers, 
  usedHints, 
  onNavigate, 
  onReset 
}: ResultsScreenProps) => {
  const getScoreGrade = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return { grade: 'Отлично', color: 'text-green-600', icon: 'Award' };
    if (percentage >= 70) return { grade: 'Хорошо', color: 'text-blue-600', icon: 'ThumbsUp' };
    if (percentage >= 50) return { grade: 'Удовлетворительно', color: 'text-yellow-600', icon: 'Meh' };
    return { grade: 'Требуется улучшение', color: 'text-red-600', icon: 'TrendingDown' };
  };

  const { grade, color, icon } = getScoreGrade();
  const percentage = Math.round((score / totalQuestions) * 100);

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
              <span className="text-3xl font-bold text-primary">{score} / {totalQuestions}</span>
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
              onClick={onReset} 
              variant="outline"
              className="flex-1"
            >
              <Icon name="RotateCcw" className="mr-2" size={18} />
              Пройти заново
            </Button>
            <Button 
              onClick={() => onNavigate('statistics')} 
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
};

type LeaderboardScreenProps = {
  totalQuestions: number;
  onNavigate: (screen: Screen) => void;
};

export const LeaderboardScreen = ({ totalQuestions, onNavigate }: LeaderboardScreenProps) => {
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
                <div className="font-bold text-xl text-primary">{entry.score}/{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">{entry.percentage}%</div>
              </div>
            </div>
          ))}

          <Button 
            onClick={() => onNavigate('title')} 
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
};
