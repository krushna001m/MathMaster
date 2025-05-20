
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-md py-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-math-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl text-math-blue">MathMaster</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-math-blue px-3 py-2 font-medium">
              Dashboard
            </Link>
            <Link to="/leaderboard" className="text-gray-700 hover:text-math-blue px-3 py-2 font-medium">
              Leaderboard
            </Link>
            <Link to="/help" className="text-gray-700 hover:text-math-blue px-3 py-2 font-medium">
              Help
            </Link>
            
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default">
                Log In
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-math-blue focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-math-blue hover:bg-gray-50">
            Dashboard
          </Link>
          <Link to="/leaderboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-math-blue hover:bg-gray-50">
            Leaderboard
          </Link>
          <Link to="/help" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-math-blue hover:bg-gray-50">
            Help
          </Link>
          
          {isLoggedIn && user ? (
            <>
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-math-blue hover:bg-gray-50">
                Profile
              </Link>
              <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-math-blue hover:bg-gray-50">
                Settings
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-math-blue hover:bg-gray-50"
              >
                Log Out
              </button>
            </>
          ) : (
            <Button variant="default" className="w-full mt-2">
              Log In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
