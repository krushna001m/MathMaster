
// Generate a random integer between min (inclusive) and max (inclusive)
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a simple arithmetic operation with answer
export const generateArithmeticProblem = (
  difficulty: 'easy' | 'medium' | 'hard'
): { problem: string; answer: number } => {
  let num1: number;
  let num2: number;
  let operation: string;
  let answer: number;

  switch (difficulty) {
    case 'easy':
      num1 = getRandomInt(1, 10);
      num2 = getRandomInt(1, 10);
      operation = ['+', '-'][getRandomInt(0, 1)];
      break;
    case 'medium':
      num1 = getRandomInt(5, 20);
      num2 = getRandomInt(5, 20);
      operation = ['+', '-', '*'][getRandomInt(0, 2)];
      break;
    case 'hard':
    default:
      num1 = getRandomInt(10, 50);
      num2 = getRandomInt(10, 50);
      operation = ['+', '-', '*', '/'][getRandomInt(0, 3)];
      // Ensure division problems have integer answers
      if (operation === '/') {
        answer = getRandomInt(1, 10);
        num1 = num2 * answer;
      }
      break;
  }

  if (operation !== '/') {
    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        // Ensure no negative answers for easier problems
        if (difficulty === 'easy' && num1 < num2) {
          [num1, num2] = [num2, num1];
        }
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      default:
        answer = 0;
    }
  }

  return {
    problem: `${num1} ${operation} ${num2}`,
    answer,
  };
};

// Generate algebra problem
export const generateAlgebraProblem = (
  difficulty: 'easy' | 'medium' | 'hard'
): { problem: string; answer: number } => {
  let x: number;
  let a: number;
  let b: number;
  let problem: string;

  switch (difficulty) {
    case 'easy':
      x = getRandomInt(1, 10);
      a = getRandomInt(1, 5);
      problem = `${a}x = ${a * x}`;
      break;
    case 'medium':
      x = getRandomInt(1, 10);
      a = getRandomInt(1, 5);
      b = getRandomInt(1, 10);
      problem = `${a}x + ${b} = ${a * x + b}`;
      break;
    case 'hard':
    default:
      x = getRandomInt(1, 10);
      a = getRandomInt(1, 5);
      b = getRandomInt(1, 10);
      const c = getRandomInt(1, 5);
      problem = `${a}x + ${b} = ${c}x + ${a * x + b - c * x}`;
      break;
  }

  return {
    problem: `Find x: ${problem}`,
    answer: x,
  };
};

// Generate geometry problem
export const generateGeometryProblem = (
  difficulty: 'easy' | 'medium' | 'hard'
): { problem: string; answer: number } => {
  let problem: string;
  let answer: number;

  switch (difficulty) {
    case 'easy':
      // Rectangle area
      const width = getRandomInt(2, 10);
      const height = getRandomInt(2, 10);
      problem = `Find the area of a rectangle with width ${width} and height ${height}.`;
      answer = width * height;
      break;
    
    case 'medium':
      // Circle area
      const radius = getRandomInt(1, 10);
      problem = `Find the area of a circle with radius ${radius}. Round to the nearest whole number.`;
      answer = Math.round(Math.PI * radius * radius);
      break;
    
    case 'hard':
    default:
      // Pythagorean theorem
      const a = getRandomInt(3, 12);
      const b = getRandomInt(3, 12);
      const c = Math.round(Math.sqrt(a * a + b * b) * 10) / 10;
      
      if (Number.isInteger(c)) {
        problem = `In a right triangle, if the legs have lengths ${a} and ${b}, what is the length of the hypotenuse?`;
        answer = c;
      } else {
        // Alternative: trapezoid area
        const base1 = getRandomInt(5, 15);
        const base2 = getRandomInt(5, 15);
        const trapHeight = getRandomInt(3, 10);
        problem = `Find the area of a trapezoid with bases ${base1} and ${base2}, and height ${trapHeight}.`;
        answer = ((base1 + base2) / 2) * trapHeight;
      }
      break;
  }

  return { problem, answer };
};

// Generate word problem
export const generateWordProblem = (
  difficulty: 'easy' | 'medium' | 'hard'
): { problem: string; answer: number } => {
  let problem: string;
  let answer: number;
  
  switch (difficulty) {
    case 'easy':
      // Simple addition/subtraction word problem
      const apples = getRandomInt(5, 20);
      const applesEaten = getRandomInt(1, apples - 1);
      problem = `Alice had ${apples} apples. She ate ${applesEaten} of them. How many apples does she have now?`;
      answer = apples - applesEaten;
      break;
      
    case 'medium':
      // Money problem
      const items = getRandomInt(3, 8);
      const price = getRandomInt(2, 10);
      const money = items * price + getRandomInt(1, 15);
      problem = `Tom buys ${items} toys that cost $${price} each. If he had $${money}, how much money does he have left?`;
      answer = money - (items * price);
      break;
      
    case 'hard':
    default:
      // Rate/time/distance problem
      const speed1 = getRandomInt(30, 70);
      const speed2 = getRandomInt(30, 70);
      const distance = getRandomInt(100, 300);
      problem = `Two cars start from the same point and travel in opposite directions. The first car travels at ${speed1} mph and the second at ${speed2} mph. How many hours will it take until they are ${distance} miles apart?`;
      answer = distance / (speed1 + speed2);
      // Round to 2 decimal places
      answer = Math.round(answer * 100) / 100;
      break;
  }
  
  return { problem, answer };
};

// Generate fraction problem
export const generateFractionProblem = (
  difficulty: 'easy' | 'medium' | 'hard'
): { problem: string; answer: number } => {
  let problem: string;
  let answer: number;
  
  switch (difficulty) {
    case 'easy':
      // Simple fraction to decimal
      const numerator = getRandomInt(1, 10);
      const denominator = getRandomInt(2, 10);
      problem = `Convert the fraction ${numerator}/${denominator} to a decimal. Round to 2 decimal places if needed.`;
      answer = Math.round((numerator / denominator) * 100) / 100;
      break;
      
    case 'medium':
      // Fraction addition
      const num1 = getRandomInt(1, 10);
      const denom1 = getRandomInt(2, 10);
      const num2 = getRandomInt(1, 10);
      const denom2 = denom1; // Using same denominator for simplicity
      problem = `Add the fractions: ${num1}/${denom1} + ${num2}/${denom2} = ?`;
      answer = (num1 + num2) / denom1;
      break;
      
    case 'hard':
    default:
      // Fraction of a quantity
      const fraction = getRandomInt(1, 5);
      const wholeNum = getRandomInt(10, 100);
      problem = `What is ${fraction}/7 of ${wholeNum}?`;
      answer = (fraction / 7) * wholeNum;
      // Round to 2 decimal places
      answer = Math.round(answer * 100) / 100;
      break;
  }
  
  return { problem, answer };
};

// Calculate area of a rectangle
export const calculateRectangleArea = (width: number, height: number): number => {
  return width * height;
};

// Calculate area of a circle
export const calculateCircleArea = (radius: number): number => {
  return Math.PI * radius * radius;
};

// Calculate perimeter of a rectangle
export const calculateRectanglePerimeter = (width: number, height: number): number => {
  return 2 * (width + height);
};

// Calculate perimeter/circumference of a circle
export const calculateCircleCircumference = (radius: number): number => {
  return 2 * Math.PI * radius;
};

// Calculate angle in degrees
export const calculateAngle = (
  adjacent: number,
  opposite: number
): number => {
  return Math.atan(opposite / adjacent) * (180 / Math.PI);
};

// Generate multiple choice options
export const generateMultipleChoiceOptions = (
  correctAnswer: number,
  count: number = 4
): number[] => {
  const options: Set<number> = new Set([Math.round(correctAnswer * 100) / 100]);
  
  while (options.size < count) {
    // Generate wrong answers that are somewhat close to the correct answer
    const deviation = correctAnswer * (getRandomInt(10, 50) / 100) * (Math.random() > 0.5 ? 1 : -1);
    const wrongAnswer = Math.round((correctAnswer + deviation) * 100) / 100;
    
    // Ensure no negative answers for basic problems
    if (wrongAnswer > 0) {
      options.add(wrongAnswer);
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
};

// Additional shape utilities
export function calculateTrapezoidArea(base1: number, base2: number, height: number): number {
  return ((base1 + base2) / 2) * height;
}

export function calculateTrapezoidPerimeter(base1: number, base2: number, height: number): number {
  // Calculate the non-parallel sides using Pythagorean theorem
  const leg = Math.abs(base1 - base2) / 2;
  const nonParallelSide = Math.sqrt(leg * leg + height * height);
  return base1 + base2 + (2 * nonParallelSide);
}

export function calculateParallelogramArea(base: number, height: number): number {
  return base * height;
}

export function calculateParallelogramPerimeter(base: number, side: number): number {
  return 2 * (base + side);
}

export function calculateRegularHexagonArea(sideLength: number): number {
  return (3 * Math.sqrt(3) / 2) * Math.pow(sideLength, 2);
}

export function calculateRegularHexagonPerimeter(sideLength: number): number {
  return 6 * sideLength;
}

