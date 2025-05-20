
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Help = () => {
  const [activeTab, setActiveTab] = useState<string>('guides');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Help Center</CardTitle>
        <CardDescription>
          Get help and learn how to use the math learning platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="guides" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guides">User Guides</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tips">Learning Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides" className="space-y-4">
            <div className="my-4">
              <h3 className="text-lg font-medium mb-2">Getting Started</h3>
              <p className="text-gray-600 mb-4">
                Welcome to our Math Learning Platform! Here's how to use the different features:
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="puzzle">
                  <AccordionTrigger>Math Puzzles</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">The Math Puzzles section offers interactive puzzles that test your problem-solving skills.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Select a puzzle category and difficulty level</li>
                      <li>Solve each puzzle by selecting the correct answer or entering your solution</li>
                      <li>Earn points and stars as you complete puzzles</li>
                      <li>Track your progress on your user profile</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="geometry">
                  <AccordionTrigger>Geometry Visualizer</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">The Geometry Visualizer helps you understand shapes and their properties.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Choose from different shapes: circle, rectangle, triangle, trapezoid, parallelogram, or hexagon</li>
                      <li>Adjust dimensions using the sliders</li>
                      <li>See calculations for area, perimeter, and other properties update in real-time</li>
                      <li>Use the grid toggle to enable/disable the background grid</li>
                      <li>Drag shapes to position them on the canvas</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="quiz">
                  <AccordionTrigger>Math Quiz</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Test your knowledge with our interactive Math Quizzes.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Choose from five quiz types:
                        <ul className="list-circle pl-5 space-y-1">
                          <li>Arithmetic - Basic operations like addition, subtraction, multiplication, and division</li>
                          <li>Algebra - Solving for variables in equations</li>
                          <li>Geometry - Calculate areas, perimeters, and apply geometric principles</li>
                          <li>Word Problems - Apply math concepts to solve real-world scenarios</li>
                          <li>Fractions - Work with fractions, decimals, and percentages</li>
                        </ul>
                      </li>
                      <li>Select your difficulty level: Easy, Medium, or Hard</li>
                      <li>Answer 10 questions within the time limit</li>
                      <li>See your score and review your answers at the end</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="profile">
                  <AccordionTrigger>User Profile</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Your profile helps you track your progress and achievements.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>View your current level and points</li>
                      <li>See statistics for puzzles completed and quiz scores</li>
                      <li>Track your learning progress over time</li>
                      <li>Compare your performance with others on the leaderboard</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="leaderboard">
                  <AccordionTrigger>Leaderboard</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Compete with others and see where you rank.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>View overall rankings based on total points</li>
                      <li>Check specific rankings for puzzles and quizzes</li>
                      <li>See your position highlighted among other users</li>
                      <li>Earn more points to climb the rankings</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <div className="my-4">
              <h3 className="text-lg font-medium mb-2">Frequently Asked Questions</h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="points">
                  <AccordionTrigger>How do I earn points?</AccordionTrigger>
                  <AccordionContent>
                    You earn points by completing puzzles, taking quizzes, and solving problems correctly. Different activities award different amounts of points based on difficulty.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="levels">
                  <AccordionTrigger>How do I level up?</AccordionTrigger>
                  <AccordionContent>
                    You gain a new level for every 100 points you earn. Keep completing activities to earn more points and advance to higher levels.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="difficulty">
                  <AccordionTrigger>What do the difficulty levels mean?</AccordionTrigger>
                  <AccordionContent>
                    <p>Our platform offers three difficulty levels:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li><strong>Easy:</strong> Basic concepts suitable for beginners</li>
                      <li><strong>Medium:</strong> Intermediate challenges requiring deeper understanding</li>
                      <li><strong>Hard:</strong> Advanced problems that test comprehensive knowledge</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="quiz-types">
                  <AccordionTrigger>What types of math quizzes are available?</AccordionTrigger>
                  <AccordionContent>
                    <p>We offer five types of math quizzes:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li><strong>Arithmetic:</strong> Basic operations (addition, subtraction, multiplication, division)</li>
                      <li><strong>Algebra:</strong> Working with variables and equations</li>
                      <li><strong>Geometry:</strong> Problems involving shapes, areas, perimeters, and spatial reasoning</li>
                      <li><strong>Word Problems:</strong> Real-world scenarios requiring mathematical solutions</li>
                      <li><strong>Fractions:</strong> Working with fractions, decimals, and percentages</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="progress">
                  <AccordionTrigger>How is my progress saved?</AccordionTrigger>
                  <AccordionContent>
                    Your progress is automatically saved in your user profile. This includes completed puzzles, quiz scores, points earned, and your current level.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="tips">
            <div className="my-4">
              <h3 className="text-lg font-medium mb-2">Learning Tips</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Practice Regularly</h4>
                  <p>Mathematical skills improve with regular practice. Try to spend at least 15-20 minutes each day solving different types of problems.</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">Vary Your Challenges</h4>
                  <p>Don't stick to one type of math problem. Explore different categories and difficulty levels to build a well-rounded understanding.</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-700 mb-2">Learn From Mistakes</h4>
                  <p>When you answer incorrectly, take time to understand why. Review the question and solution to improve your understanding.</p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-700 mb-2">Use Visualization</h4>
                  <p>The Geometry Visualizer is a powerful tool to help you understand abstract concepts. Use it to see how changing dimensions affects areas and perimeters.</p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-700 mb-2">Test Your Knowledge</h4>
                  <p>Regularly take quizzes to test your understanding. Try different quiz types to identify areas where you excel and areas that need improvement.</p>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">Set Learning Goals</h4>
                  <p>Set specific goals like "Complete 5 geometry quizzes this week" or "Reach level 5 by the end of the month" to stay motivated.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Help;
