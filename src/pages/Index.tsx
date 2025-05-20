
import Navbar from '@/components/Navigation/Navbar';
import Dashboard from '@/components/Dashboard/Dashboard';
import { useUser } from '@/context/UserContext';

const Index = () => {
  const { user } = useUser();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default Index;
