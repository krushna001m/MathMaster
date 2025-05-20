
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Award, Star, Brain, Settings } from 'lucide-react';

const UserProfile = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [tab, setTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  
  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Please log in to view your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <Button>Log In</Button>
        </CardContent>
      </Card>
    );
  }
  
  const puzzleAccuracy = user.puzzleProgress.completed > 0 
    ? Math.round((user.puzzleProgress.stars / (user.puzzleProgress.completed * 3)) * 100) 
    : 0;
    
  const quizAccuracy = user.quizProgress.totalQuestions > 0
    ? Math.round((user.quizProgress.correctAnswers / user.quizProgress.totalQuestions) * 100)
    : 0;
    
  const pointsToNextLevel = (user.level * 100) - user.points;
  const progressToNextLevel = 100 - (pointsToNextLevel);
  
  const handleEditProfile = () => {
    if (isEditing) {
      // Save changes
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }
    setEditName(user.name);
    setIsEditing(!isEditing);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              View and manage your math learning progress
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleEditProfile}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Profile sidebar */}
          <div className="md:w-1/3">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              {isEditing ? (
                <div className="w-full space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Name</Label>
                    <Input 
                      id="username" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input id="avatar" defaultValue={user.avatar} />
                  </div>
                </div>
              ) : (
                <>
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mt-4">{user.name}</h3>
                  <div className="mt-2 bg-math-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                    Level {user.level}
                  </div>
                  <div className="w-full mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress to Level {user.level + 1}</span>
                      <span>{progressToNextLevel}%</span>
                    </div>
                    <Progress value={progressToNextLevel} />
                    <p className="text-xs text-gray-500 mt-1">
                      {pointsToNextLevel} points needed for next level
                    </p>
                  </div>
                  <div className="w-full mt-4 flex justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.points}</div>
                      <div className="text-xs text-gray-500">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.puzzleProgress.stars}</div>
                      <div className="text-xs text-gray-500">Stars Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.quizProgress.completed}</div>
                      <div className="text-xs text-gray-500">Quizzes Taken</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:w-2/3">
            <Tabs defaultValue="overview" value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatCard 
                    title="Puzzles Completed" 
                    value={user.puzzleProgress.completed}
                    description="Math puzzles solved"
                    icon={<Brain className="h-5 w-5" />}
                    color="blue"
                  />
                  <StatCard 
                    title="Stars Earned" 
                    value={user.puzzleProgress.stars}
                    description={`Out of ${user.puzzleProgress.completed * 3} possible`}
                    icon={<Star className="h-5 w-5" />}
                    color="orange"
                  />
                  <StatCard 
                    title="Quizzes Completed" 
                    value={user.quizProgress.completed}
                    description="Math knowledge tests taken"
                    icon={<Award className="h-5 w-5" />}
                    color="purple"
                  />
                  <StatCard 
                    title="Quiz Accuracy" 
                    value={`${quizAccuracy}%`}
                    description={`${user.quizProgress.correctAnswers} correct answers`}
                    icon={<Brain className="h-5 w-5" />}
                    color="green"
                  />
                </div>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ActivityItem 
                        title="Completed Arithmetic Quiz"
                        description="Scored 8/10 on Medium difficulty"
                        time="2 hours ago"
                      />
                      <ActivityItem 
                        title="Solved Level 4 Puzzle"
                        description="Earned 2 stars and 25 points"
                        time="Yesterday"
                      />
                      <ActivityItem 
                        title="Reached Level 3"
                        description="Unlocked new challenges!"
                        time="2 days ago"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="progress" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Math Puzzle Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Total Puzzles Completed</h4>
                        <p className="text-sm text-gray-500">Keep solving to unlock new levels</p>
                      </div>
                      <div className="text-2xl font-bold">{user.puzzleProgress.completed}</div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Star Accuracy</span>
                        <span>{puzzleAccuracy}%</span>
                      </div>
                      <Progress value={puzzleAccuracy} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quiz Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Total Quizzes Completed</h4>
                        <p className="text-sm text-gray-500">Test your knowledge regularly</p>
                      </div>
                      <div className="text-2xl font-bold">{user.quizProgress.completed}</div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Answer Accuracy</span>
                        <span>{quizAccuracy}%</span>
                      </div>
                      <Progress value={quizAccuracy} />
                      <p className="text-xs text-gray-500 mt-1">
                        {user.quizProgress.correctAnswers} correct out of {user.quizProgress.totalQuestions} questions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input id="displayName" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="user@example.com" />
                    </div>
                    <div className="pt-2">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Sound Effects</h4>
                        <p className="text-sm text-gray-500">Play sounds on achievements</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">On</Button>
                        <Button variant="outline" size="sm">Off</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Default Difficulty</h4>
                        <p className="text-sm text-gray-500">Set your preferred difficulty level</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Easy</Button>
                        <Button variant="default" size="sm">Medium</Button>
                        <Button variant="outline" size="sm">Hard</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'orange' | 'green' | 'purple';
}

const StatCard = ({ title, value, description, icon, color }: StatCardProps) => {
  const colorClass = {
    blue: 'bg-math-blue bg-opacity-10 text-math-blue',
    orange: 'bg-math-orange bg-opacity-10 text-math-orange',
    green: 'bg-math-green bg-opacity-10 text-math-green',
    purple: 'bg-math-purple bg-opacity-10 text-math-purple',
  };
  
  return (
    <div className="border rounded-lg p-4 flex items-start space-x-4">
      <div className={`p-2 rounded-full ${colorClass[color]}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({ title, description, time }: ActivityItemProps) => {
  return (
    <div className="flex items-start space-x-3 border-b pb-3 last:border-0">
      <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
        <Award className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  );
};

export default UserProfile;
