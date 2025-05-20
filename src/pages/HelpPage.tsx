
import Navbar from '@/components/Navigation/Navbar';
import Help from '@/components/Help/Help';

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Help />
      </div>
    </div>
  );
};

export default HelpPage;
