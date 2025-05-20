
import Navbar from '@/components/Navigation/Navbar';
import Leaderboard from '@/components/Leaderboard/Leaderboard';
import { useUser } from '@/context/UserContext';

const LeaderboardPage = () => {
  const { user } = useUser();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Leaderboard />
      </div>
    </div>
  );
};

export default LeaderboardPage;
