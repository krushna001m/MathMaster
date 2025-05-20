
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PuzzleGame from '../MathPuzzle/PuzzleGame';
import Visualizer from '../GeometryVisualizer/Visualizer';
import Quiz from '../MathQuiz/Quiz';
import UserProfile from '../Profile/UserProfile';
import Leaderboard from '../Leaderboard/Leaderboard';

type ModuleType = 'puzzle' | 'geometry' | 'quiz' | 'profile' | 'leaderboard';

const Dashboard = () => {
  const { user, setModule } = useUser();
  const [activeModule, setActiveModule] = useState<ModuleType>('puzzle');
  
  const handleModuleChange = (value: string) => {
    setActiveModule(value as ModuleType);
    setModule(value as any);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {user && (
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-math-blue to-math-purple">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">Welcome back, {user.name}!</h2>
                    <p className="opacity-90">Continue your math journey</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">Level {user.level}</span>
                    <div className="px-2 py-0.5 bg-white text-math-blue rounded-full text-xs font-bold">
                      {user.points} points
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Progress 
                      value={(user.points % 100) / 100 * 100} 
                      className="h-2 bg-white/30" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue="puzzle" value={activeModule} onValueChange={handleModuleChange}>
        <div className="mb-6 overflow-x-auto">
          <TabsList className="inline-flex w-full md:w-auto">
            <TabsTrigger value="puzzle" className="flex items-center">
              <span className="hidden md:inline ml-2">Math Puzzles</span>
              <span className="md:hidden">Puzzles</span>
            </TabsTrigger>
            <TabsTrigger value="geometry" className="flex items-center">
              <span className="hidden md:inline ml-2">Geometry</span>
              <span className="md:hidden">Geometry</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center">
              <span className="hidden md:inline ml-2">Math Quiz</span>
              <span className="md:hidden">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <span className="hidden md:inline ml-2">My Profile</span>
              <span className="md:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center">
              <span className="hidden md:inline ml-2">Leaderboard</span>
              <span className="md:hidden">Leaders</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="puzzle">
          <PuzzleGame />
        </TabsContent>
        
        <TabsContent value="geometry">
          <Visualizer />
        </TabsContent>
        
        <TabsContent value="quiz">
          <Quiz />
        </TabsContent>
        
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
