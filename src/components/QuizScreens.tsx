import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Screen = 'title' | 'instructions' | 'quiz' | 'results' | 'leaderboard' | 'statistics';

type TitleScreenProps = {
  questionsCount: number;
  onNavigate: (screen: Screen) => void;
};

export const TitleScreen = ({ questionsCount, onNavigate }: TitleScreenProps) => {
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
              <span className="font-medium">Вопросов: {questionsCount}</span>
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
              onClick={() => onNavigate('instructions')} 
              className="w-full h-14 text-lg"
              size="lg"
            >
              Начать квиз
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
            <div className="flex gap-3">
              <Button 
                onClick={() => onNavigate('leaderboard')} 
                variant="outline" 
                className="flex-1"
              >
                <Icon name="Trophy" className="mr-2" size={18} />
                Рейтинг
              </Button>
              <Button 
                onClick={() => onNavigate('statistics')} 
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
};

type InstructionsScreenProps = {
  onNavigate: (screen: Screen) => void;
};

export const InstructionsScreen = ({ onNavigate }: InstructionsScreenProps) => {
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
              onClick={() => onNavigate('title')} 
              variant="outline"
              className="flex-1"
            >
              <Icon name="ArrowLeft" className="mr-2" size={18} />
              Назад
            </Button>
            <Button 
              onClick={() => onNavigate('quiz')} 
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
};
