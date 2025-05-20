
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { generateArithmeticProblem } from '@/utils/mathUtils';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

type PuzzleState = {
  problem: string;
  answer: number;
  userAnswer: string;
  isCorrect: boolean | null;
  attempts: number;
  timeLeft: number;
};

const PuzzleGame = () => {
  const { user, updatePoints, updatePuzzleProgress } = useUser();
  const { toast } = useToast();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({
    problem: '',
    answer: 0,
    userAnswer: '',
    isCorrect: null,
    attempts: 0,
    timeLeft: 30,
  });
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    if (gameActive && puzzleState.timeLeft > 0) {
      const countdown = setInterval(() => {
        setPuzzleState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      
      setTimer(countdown);
      
      return () => clearInterval(countdown);
    } else if (puzzleState.timeLeft === 0 && gameActive) {
      handleTimeout();
    }
  }, [gameActive, puzzleState.timeLeft]);

  const generateNewPuzzle = () => {
    if (timer) {
      clearInterval(timer);
    }
    
    const { problem, answer } = generateArithmeticProblem(difficulty);
    
    setPuzzleState({
      problem,
      answer,
      userAnswer: '',
      isCorrect: null,
      attempts: 0,
      timeLeft: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20,
    });
    
    setGameActive(true);
  };

  const handleStartGame = () => {
    setScore(0);
    setStars(0);
    setLevel(1);
    generateNewPuzzle();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPuzzleState(prev => ({ ...prev, userAnswer: e.target.value }));
  };

  const handleSubmitAnswer = () => {
    const userAnswerNum = parseFloat(puzzleState.userAnswer);
    
    if (isNaN(userAnswerNum)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number.",
        variant: "destructive",
      });
      return;
    }
    
    const isCorrect = Math.abs(userAnswerNum - puzzleState.answer) < 0.001;
    const newAttempts = puzzleState.attempts + 1;
    
    setPuzzleState(prev => ({ 
      ...prev, 
      isCorrect, 
      attempts: newAttempts 
    }));
    
    if (isCorrect) {
      handleCorrectAnswer();
    } else if (newAttempts >= 3) {
      handleMaxAttempts();
    } else {
      toast({
        title: "Not quite right",
        description: `Try again! ${3 - newAttempts} attempts left.`,
        variant: "default",
      });
    }
  };

  const handleCorrectAnswer = () => {
    // Clear timer
    if (timer) {
      clearInterval(timer);
    }
    
    // Calculate points based on difficulty, time left, and attempts
    let pointsEarned = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
    pointsEarned += Math.round(puzzleState.timeLeft / 2);
    pointsEarned -= (puzzleState.attempts - 1) * 5;
    
    // Minimum 5 points for correct answer
    pointsEarned = Math.max(5, pointsEarned);
    
    // Calculate stars (0-3)
    const earnedStars = puzzleState.attempts === 1 ? 3 : 
                       puzzleState.attempts === 2 ? 2 : 1;
    
    // Update score and level
    const newScore = score + pointsEarned;
    const newLevel = Math.floor(newScore / 50) + 1;
    const newStars = stars + earnedStars;
    
    setScore(newScore);
    setStars(newStars);
    
    if (newLevel > level) {
      setLevel(newLevel);
      // Increase difficulty every 3 levels
      if (newLevel % 3 === 0) {
        if (difficulty === 'easy') setDifficulty('medium');
        else if (difficulty === 'medium') setDifficulty('hard');
      }
      
      toast({
        title: "Level Up!",
        description: `You reached level ${newLevel}!`,
        variant: "default",
      });
    }
    
    updatePoints(pointsEarned);
    updatePuzzleProgress(1, earnedStars);
    
    setTimeout(() => {
      generateNewPuzzle();
    }, 2000);
  };

  const handleMaxAttempts = () => {
    // Clear timer
    if (timer) {
      clearInterval(timer);
    }
    
    toast({
      title: "Max attempts reached",
      description: `The correct answer was ${puzzleState.answer}`,
      variant: "destructive",
    });
    
    setTimeout(() => {
      generateNewPuzzle();
    }, 3000);
  };

  const handleTimeout = () => {
    // Clear timer
    if (timer) {
      clearInterval(timer);
    }
    
    setPuzzleState(prev => ({ ...prev, isCorrect: false }));
    
    toast({
      title: "Time's up!",
      description: `The correct answer was ${puzzleState.answer}`,
      variant: "destructive",
    });
    
    setTimeout(() => {
      generateNewPuzzle();
    }, 3000);
  };
  
  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-6 w-6 ${i < puzzleState.attempts ? 'text-gray-300' : 'text-math-orange'}`} 
        fill={i >= puzzleState.attempts ? '#f39c12' : 'none'} 
      />
    ));
  };

  return (
    <div className="flex flex-col space-y-4 h-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>Math Puzzle Game</div>
            {gameActive && (
              <div className="flex items-center text-sm space-x-2">
                <span>Level {level}</span>
                <span className="px-2 py-1 rounded-full bg-math-blue text-white">
                  {difficulty.toUpperCase()}
                </span>
                <span>Score: {score}</span>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            Solve math puzzles to earn points and advance levels!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!gameActive ? (
            <div className="flex flex-col items-center space-y-6 py-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Welcome to Math Puzzle!</h3>
                <p className="text-gray-600 mb-4">
                  Test your math skills with challenging puzzles.
                  Solve them quickly to earn more points and stars!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
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
              <Button size="lg" onClick={handleStartGame}>
                Start Game
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {renderStars(3)}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Time Left</div>
                  <div className="flex items-center space-x-2">
                    <Progress value={(puzzleState.timeLeft / (difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20)) * 100} />
                    <span className="font-mono w-8">{puzzleState.timeLeft}s</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Solve the problem:</h3>
                <div className="text-3xl font-bold mb-8">{puzzleState.problem}</div>
                
                <div className="flex items-center space-x-2 max-w-sm mx-auto">
                  <Input 
                    type="text" 
                    placeholder="Your answer"
                    value={puzzleState.userAnswer}
                    onChange={handleInputChange}
                    className={`text-lg ${
                      puzzleState.isCorrect === true ? 'border-math-green' : 
                      puzzleState.isCorrect === false ? 'border-math-red' : ''
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitAnswer();
                      }
                    }}
                    disabled={puzzleState.isCorrect !== null}
                  />
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={puzzleState.isCorrect !== null}
                  >
                    Submit
                  </Button>
                </div>
                
                {puzzleState.isCorrect === true && (
                  <div className="mt-4 text-math-green font-bold animate-scale">
                    Correct! Well done!
                  </div>
                )}
                
                {puzzleState.isCorrect === false && puzzleState.attempts >= 3 && (
                  <div className="mt-4 text-math-red font-bold">
                    The answer was {puzzleState.answer}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuzzleGame;
