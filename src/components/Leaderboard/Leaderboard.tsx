
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/context/UserContext';

type LeaderboardCategory = 'overall' | 'puzzle' | 'quiz';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  puzzleStars: number;
  quizScore: number;
}

const Leaderboard = () => {
  const { user } = useUser();
  const [category, setCategory] = useState<LeaderboardCategory>('overall');
  
  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Math Explorer',
      avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=math',
      points: 150,
      level: 3,
      puzzleStars: 10,
      quizScore: 85,
    },
    {
      id: '2',
      name: 'Number Ninja',
      avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=number',
      points: 320,
      level: 7,
      puzzleStars: 18,
      quizScore: 92,
    },
    {
      id: '3',
      name: 'Algebra Master',
      avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=algebra',
      points: 280,
      level: 6,
      puzzleStars: 14,
      quizScore: 90,
    },
    {
      id: '4',
      name: 'Geometry Wizard',
      avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=geometry',
      points: 210,
      level: 5,
      puzzleStars: 12,
      quizScore: 78,
    },
    {
      id: '5',
      name: 'Logic Champion',
      avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=logic',
      points: 175,
      level: 4,
      puzzleStars: 9,
      quizScore: 82,
    }
  ];
  
  const sortedData = [...leaderboardData].sort((a, b) => {
    switch (category) {
      case 'puzzle':
        return b.puzzleStars - a.puzzleStars;
      case 'quiz':
        return b.quizScore - a.quizScore;
      default:
        return b.points - a.points;
    }
  });
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>
          See how you rank against other math learners
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" onValueChange={(value) => setCategory(value as LeaderboardCategory)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="puzzle">Puzzle Stars</TabsTrigger>
            <TabsTrigger value="quiz">Quiz Scores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall" className="mt-6">
            <LeaderboardTable 
              data={sortedData} 
              valueKey="points" 
              valueLabel="Points" 
              currentUserId={user?.id} 
            />
          </TabsContent>
          
          <TabsContent value="puzzle" className="mt-6">
            <LeaderboardTable 
              data={sortedData} 
              valueKey="puzzleStars" 
              valueLabel="Stars" 
              currentUserId={user?.id} 
            />
          </TabsContent>
          
          <TabsContent value="quiz" className="mt-6">
            <LeaderboardTable 
              data={sortedData} 
              valueKey="quizScore" 
              valueLabel="Score %" 
              currentUserId={user?.id} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  valueKey: 'points' | 'puzzleStars' | 'quizScore';
  valueLabel: string;
  currentUserId?: string;
}

const LeaderboardTable = ({ data, valueKey, valueLabel, currentUserId }: LeaderboardTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left font-medium py-3 px-4 w-16">Rank</th>
            <th className="text-left font-medium py-3 px-4">Player</th>
            <th className="text-left font-medium py-3 px-4">Level</th>
            <th className="text-left font-medium py-3 px-4">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr 
              key={entry.id}
              className={`border-b hover:bg-gray-50 ${entry.id === currentUserId ? 'bg-blue-50' : ''}`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                  {index + 1}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{entry.name}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <span className="px-2 py-1 rounded-full bg-math-blue text-xs text-white">
                    Level {entry.level}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="font-medium">
                  {entry[valueKey]}
                  {valueKey === 'quizScore' && '%'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
