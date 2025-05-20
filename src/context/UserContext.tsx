
import { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  puzzleProgress: {
    completed: number;
    stars: number;
  };
  quizProgress: {
    completed: number;
    correctAnswers: number;
    totalQuestions: number;
  };
};

type Module = 'puzzle' | 'geometry' | 'quiz';

type UserContextType = {
  user: User | null;
  currentModule: Module | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
  updatePuzzleProgress: (completed: number, stars: number) => void;
  updateQuizProgress: (completed: number, correct: number, total: number) => void;
  setModule: (module: Module | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Math Explorer',
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=math',
    points: 150,
    level: 3,
    puzzleProgress: {
      completed: 5,
      stars: 10,
    },
    quizProgress: {
      completed: 3,
      correctAnswers: 12,
      totalQuestions: 15,
    },
  });
  const [currentModule, setCurrentModule] = useState<Module | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updatePoints = (points: number) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      
      const newPoints = prevUser.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      
      return {
        ...prevUser,
        points: newPoints,
        level: newLevel,
      };
    });
  };

  const updatePuzzleProgress = (completed: number, stars: number) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        puzzleProgress: {
          completed: prevUser.puzzleProgress.completed + completed,
          stars: prevUser.puzzleProgress.stars + stars,
        },
      };
    });
  };

  const updateQuizProgress = (completed: number, correct: number, total: number) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        quizProgress: {
          completed: prevUser.quizProgress.completed + completed,
          correctAnswers: prevUser.quizProgress.correctAnswers + correct,
          totalQuestions: prevUser.quizProgress.totalQuestions + total,
        },
      };
    });
  };

  const setModule = (module: Module | null) => {
    setCurrentModule(module);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        currentModule,
        isLoggedIn: !!user,
        login,
        logout,
        updatePoints,
        updatePuzzleProgress,
        updateQuizProgress,
        setModule,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
