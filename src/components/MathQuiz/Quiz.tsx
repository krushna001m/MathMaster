
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  generateArithmeticProblem, 
  generateAlgebraProblem, 
  generateMultipleChoiceOptions,
  generateGeometryProblem,
  generateWordProblem,
  generateFractionProblem 
} from '@/utils/mathUtils';
import { CheckCircle, XCircle } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type QuizType = 'arithmetic' | 'algebra' | 'geometry' | 'word-problems' | 'fractions';

interface Question {
  id: number;
  problem: string;
  answer: number;
  options: number[];
  userAnswer: number | null;
  isCorrect: boolean | null;
}

const Quiz = () => {
  const { user, updatePoints, updateQuizProgress } = useUser();
  const { toast } = useToast();
  const [quizType, setQuizType] = useState<QuizType>('arithmetic');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  
  const generateQuiz = () => {
    const questionsCount = 10;
    const newQuestions: Question[] = [];
    
    for (let i = 0; i < questionsCount; i++) {
      let questionData;
      
      switch (quizType) {
        case 'arithmetic':
          questionData = generateArithmeticProblem(difficulty);
          break;
        case 'algebra':
          questionData = generateAlgebraProblem(difficulty);
          break;
        case 'geometry':
          questionData = generateGeometryProblem(difficulty);
          break;
        case 'word-problems':
          questionData = generateWordProblem(difficulty);
          break;
        case 'fractions':
          questionData = generateFractionProblem(difficulty);
          break;
        default:
          questionData = generateArithmeticProblem(difficulty);
      }
      
      const options = generateMultipleChoiceOptions(questionData.answer);
      
      newQuestions.push({
        id: i + 1,
        problem: questionData.problem,
        answer: questionData.answer,
        options: options,
        userAnswer: null,
        isCorrect: null,
      });
    }
    
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
    setTimeLeft(difficulty === 'easy' ? 300 : difficulty === 'medium' ? 240 : 180);
    setQuizStarted(true);
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (quizStarted && !quizFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted && !quizFinished) {
      finishQuiz();
    }
    
    return () => clearInterval(timer);
  }, [quizStarted, quizFinished, timeLeft]);
  
  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(parseFloat(value));
  };
  
  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast({
        title: "No answer selected",
        description: "Please select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the current question
    const updatedQuestions = [...questions];
    const currentQ = updatedQuestions[currentQuestion];
    const isCorrect = Math.abs(selectedAnswer - currentQ.answer) < 0.001;
    
    updatedQuestions[currentQuestion] = {
      ...currentQ,
      userAnswer: selectedAnswer,
      isCorrect: isCorrect,
    };
    
    setQuestions(updatedQuestions);
    
    // Update score if correct
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Move to next question or finish quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  };
  
  const finishQuiz = () => {
    setQuizFinished(true);
    
    // Calculate points based on difficulty and score
    const basePoints = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
    const earnedPoints = score * basePoints;
    
    // Update user progress
    updatePoints(earnedPoints);
    updateQuizProgress(1, score, questions.length);
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${questions.length}`,
      variant: "default",
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const renderQuestionCard = () => {
    if (!quizStarted) {
      return (
        <div className="flex flex-col items-center space-y-6 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Math Quiz Challenge</h3>
            <p className="text-gray-600 mb-6">
              Test your math skills with our adaptive quiz.
              Choose your preferred quiz type and difficulty level to get started.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Quiz Type:</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    variant={quizType === 'arithmetic' ? 'default' : 'outline'}
                    onClick={() => setQuizType('arithmetic')}
                  >
                    Arithmetic
                  </Button>
                  <Button
                    variant={quizType === 'algebra' ? 'default' : 'outline'}
                    onClick={() => setQuizType('algebra')}
                  >
                    Algebra
                  </Button>
                  <Button
                    variant={quizType === 'geometry' ? 'default' : 'outline'}
                    onClick={() => setQuizType('geometry')}
                  >
                    Geometry
                  </Button>
                  <Button
                    variant={quizType === 'word-problems' ? 'default' : 'outline'}
                    onClick={() => setQuizType('word-problems')}
                  >
                    Word Problems
                  </Button>
                  <Button
                    variant={quizType === 'fractions' ? 'default' : 'outline'}
                    onClick={() => setQuizType('fractions')}
                  >
                    Fractions
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Difficulty Level:</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    variant={difficulty === 'easy' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('easy')}
                  >
                    Easy
                  </Button>
                  <Button
                    variant={difficulty === 'medium' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('medium')}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={difficulty === 'hard' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('hard')}
                  >
                    Hard
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <Button size="lg" onClick={generateQuiz}>
            Start Quiz
          </Button>
        </div>
      );
    }
    
    if (quizFinished) {
      return (
        <div className="flex flex-col items-center space-y-6 py-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Quiz Results</h3>
            <p className="text-gray-600">
              You scored {score} out of {questions.length}
            </p>
            <div className="flex justify-center my-4">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-math-blue bg-opacity-10">
                <span className="text-3xl font-bold text-math-blue">
                  {Math.round((score / questions.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-md space-y-4">
            <h4 className="font-medium">Question Summary:</h4>
            {questions.map((q, i) => (
              <div 
                key={q.id} 
                className="flex items-center space-x-2 p-2 rounded-md"
                style={{ backgroundColor: q.isCorrect ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)' }}
              >
                <div className="flex-shrink-0">
                  {q.isCorrect ? 
                    <CheckCircle className="h-5 w-5 text-math-green" /> : 
                    <XCircle className="h-5 w-5 text-math-red" />
                  }
                </div>
                <div className="flex-1 truncate">
                  Question {i + 1}: {q.problem}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setQuizStarted(false)}>
              New Quiz
            </Button>
            <Button onClick={() => {
              setQuizFinished(false);
              generateQuiz();
            }}>
              Retry Quiz
            </Button>
          </div>
        </div>
      );
    }
    
    const currentQ = questions[currentQuestion];
    
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 mt-1" />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Time Remaining</div>
            <div className="font-mono">{formatTime(timeLeft)}</div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-6">{currentQ.problem}</h3>
          
          <RadioGroup value={selectedAnswer?.toString()} onValueChange={handleAnswerSelect}>
            {currentQ.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2 p-2">
                <RadioGroupItem value={option.toString()} id={`option-${i}`} />
                <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer py-2">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <Button onClick={handleNextQuestion}>
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </Button>
      </div>
    );
  };
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Math Quiz</CardTitle>
        <CardDescription>
          Test your math knowledge with our interactive quizzes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderQuestionCard()}
      </CardContent>
    </Card>
  );
};

export default Quiz;

