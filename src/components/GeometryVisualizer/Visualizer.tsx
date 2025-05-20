import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  calculateRectangleArea,
  calculateCircleArea,
  calculateRectanglePerimeter,
  calculateCircleCircumference,
} from '@/utils/mathUtils';
import { useUser } from '@/context/UserContext';

type Shape = 'rectangle' | 'circle' | 'triangle' | 'trapezoid' | 'parallelogram' | 'hexagon';

const Visualizer = () => {
  const { updatePoints } = useUser();
  const [shape, setShape] = useState<Shape>('rectangle');
  const [dimensions, setDimensions] = useState({
    width: 150,
    height: 100,
    radius: 75,
    angle: 45,
    base1: 100,
    base2: 150,
    sides: 6,
    sideLength: 50,
  });
  const [results, setResults] = useState({
    area: 0,
    perimeter: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    drawShape();
    calculateResults();
  }, [shape, dimensions, showGrid]);

  const calculateResults = () => {
    let area = 0;
    let perimeter = 0;

    switch (shape) {
      case 'rectangle':
        area = calculateRectangleArea(dimensions.width, dimensions.height);
        perimeter = calculateRectanglePerimeter(dimensions.width, dimensions.height);
        break;
      case 'circle':
        area = calculateCircleArea(dimensions.radius);
        perimeter = calculateCircleCircumference(dimensions.radius);
        break;
      case 'triangle':
        // For a right triangle with base and height
        area = (dimensions.width * dimensions.height) / 2;
        // Use Pythagorean theorem for hypotenuse
        const hypotenuse = Math.sqrt(dimensions.width ** 2 + dimensions.height ** 2);
        perimeter = dimensions.width + dimensions.height + hypotenuse;
        break;
      case 'trapezoid':
        // Area of trapezoid: (a+c)/2 * h where a,c are parallel sides and h is height
        area = ((dimensions.base1 + dimensions.base2) / 2) * dimensions.height;
        // Approximate perimeter (simplified)
        const sides = Math.sqrt(Math.pow((dimensions.base2 - dimensions.base1) / 2, 2) + Math.pow(dimensions.height, 2));
        perimeter = dimensions.base1 + dimensions.base2 + (2 * sides);
        break;
      case 'parallelogram':
        // Area: base × height
        area = dimensions.width * dimensions.height;
        // Perimeter: 2(a+b) where a and b are sides
        perimeter = 2 * (dimensions.width + dimensions.height);
        break;
      case 'hexagon':
        // Regular hexagon area: (3√3/2) × s², where s is side length
        area = (3 * Math.sqrt(3) / 2) * Math.pow(dimensions.sideLength, 2);
        // Perimeter: 6 × side length
        perimeter = 6 * dimensions.sideLength;
        break;
    }

    setResults({
      area: Math.round(area * 100) / 100,
      perimeter: Math.round(perimeter * 100) / 100,
    });

    // Award points first time user calculates a shape (per session)
    if (!pointsAwarded) {
      updatePoints(10);
      setPointsAwarded(true);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const gridSize = 20;
    
    // Save current state
    ctx.save();
    
    // Set grid style
    ctx.strokeStyle = '#e5e7eb';  // Light gray color for grid
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw axes with darker lines
    ctx.strokeStyle = '#9ca3af';  // Darker gray for axes
    ctx.lineWidth = 1;
    
    // Vertical center line (y-axis)
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    // Horizontal center line (x-axis)
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    // Restore previous state
    ctx.restore();
  };

  const drawShape = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas);
    }

    // Set center point
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Drawing styles
    ctx.strokeStyle = '#4a90e2';
    ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
    ctx.lineWidth = 2;

    // Draw shape
    switch (shape) {
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(
          centerX - dimensions.width / 2,
          centerY - dimensions.height / 2,
          dimensions.width,
          dimensions.height
        );
        ctx.stroke();
        ctx.fill();

        // Draw dimension lines
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        
        // Width dimension line
        ctx.beginPath();
        ctx.moveTo(centerX - dimensions.width / 2, centerY + dimensions.height / 2 + 15);
        ctx.lineTo(centerX + dimensions.width / 2, centerY + dimensions.height / 2 + 15);
        ctx.stroke();
        
        // Height dimension line
        ctx.beginPath();
        ctx.moveTo(centerX + dimensions.width / 2 + 15, centerY - dimensions.height / 2);
        ctx.lineTo(centerX + dimensions.width / 2 + 15, centerY + dimensions.height / 2);
        ctx.stroke();
        
        // Labels
        ctx.setLineDash([]);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${dimensions.width}`, centerX, centerY + dimensions.height / 2 + 30);
        ctx.fillText(`${dimensions.height}`, centerX + dimensions.width / 2 + 30, centerY);
        break;
        
      case 'circle':
        ctx.beginPath();
        ctx.arc(centerX, centerY, dimensions.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        
        // Draw radius line
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + dimensions.radius * Math.cos(0), centerY + dimensions.radius * Math.sin(0));
        ctx.stroke();
        
        // Label for radius
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`r = ${dimensions.radius}`, centerX + 10, centerY - 10);
        break;
        
      case 'triangle':
        // Draw a right triangle
        ctx.beginPath();
        ctx.moveTo(centerX - dimensions.width / 2, centerY + dimensions.height / 2);  // Bottom left
        ctx.lineTo(centerX + dimensions.width / 2, centerY + dimensions.height / 2);  // Bottom right
        ctx.lineTo(centerX - dimensions.width / 2, centerY - dimensions.height / 2);  // Top left
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        
        // Draw dimension lines
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        
        // Width dimension line
        ctx.beginPath();
        ctx.moveTo(centerX - dimensions.width / 2, centerY + dimensions.height / 2 + 15);
        ctx.lineTo(centerX + dimensions.width / 2, centerY + dimensions.height / 2 + 15);
        ctx.stroke();
        
        // Height dimension line
        ctx.beginPath();
        ctx.moveTo(centerX - dimensions.width / 2 - 15, centerY + dimensions.height / 2);
        ctx.lineTo(centerX - dimensions.width / 2 - 15, centerY - dimensions.height / 2);
        ctx.stroke();
        
        // Draw right angle marker
        ctx.setLineDash([]);
        ctx.strokeStyle = '#4a90e2';
        ctx.beginPath();
        ctx.moveTo(centerX - dimensions.width / 2 + 10, centerY + dimensions.height / 2);
        ctx.lineTo(centerX - dimensions.width / 2 + 10, centerY + dimensions.height / 2 - 10);
        ctx.lineTo(centerX - dimensions.width / 2, centerY + dimensions.height / 2 - 10);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${dimensions.width}`, centerX, centerY + dimensions.height / 2 + 30);
        ctx.fillText(`${dimensions.height}`, centerX - dimensions.width / 2 - 30, centerY);
        break;
        
      case 'trapezoid':
        // Draw trapezoid
        const halfBase1 = dimensions.base1 / 2;
        const halfBase2 = dimensions.base2 / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX - halfBase1, centerY + dimensions.height / 2); // Bottom left
        ctx.lineTo(centerX + halfBase1, centerY + dimensions.height / 2); // Bottom right
        ctx.lineTo(centerX + halfBase2, centerY - dimensions.height / 2); // Top right
        ctx.lineTo(centerX - halfBase2, centerY - dimensions.height / 2); // Top left
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        
        // Draw dimension lines
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        
        // Base1 dimension line
        ctx.beginPath();
        ctx.moveTo(centerX - halfBase1, centerY + dimensions.height / 2 + 15);
        ctx.lineTo(centerX + halfBase1, centerY + dimensions.height / 2 + 15);
        ctx.stroke();
        
        // Base2 dimension line
        ctx.beginPath();
        ctx.moveTo(centerX - halfBase2, centerY - dimensions.height / 2 - 15);
        ctx.lineTo(centerX + halfBase2, centerY - dimensions.height / 2 - 15);
        ctx.stroke();
        
        // Height dimension line
        ctx.beginPath();
        ctx.moveTo(centerX + halfBase1 + 15, centerY + dimensions.height / 2);
        ctx.lineTo(centerX + halfBase1 + 15, centerY - dimensions.height / 2);
        ctx.stroke();
        
        // Labels
        ctx.setLineDash([]);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${dimensions.base1}`, centerX, centerY + dimensions.height / 2 + 30);
        ctx.fillText(`${dimensions.base2}`, centerX, centerY - dimensions.height / 2 - 30);
        ctx.fillText(`${dimensions.height}`, centerX + halfBase1 + 30, centerY);
        break;
        
      case 'parallelogram':
        // Calculate offset for parallelogram (using angle)
        const offset = dimensions.height / Math.tan(Math.PI / 4); // 45 degrees
        
        ctx.beginPath();
        ctx.moveTo(centerX - dimensions.width / 2 + offset, centerY - dimensions.height / 2); // Top left
        ctx.lineTo(centerX + dimensions.width / 2 + offset, centerY - dimensions.height / 2); // Top right
        ctx.lineTo(centerX + dimensions.width / 2 - offset, centerY + dimensions.height / 2); // Bottom right
        ctx.lineTo(centerX - dimensions.width / 2 - offset, centerY + dimensions.height / 2); // Bottom left
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        
        // Draw dimension lines
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        
        // Width dimension line
        ctx.beginPath();
        ctx.moveTo(centerX - dimensions.width / 2 - offset, centerY + dimensions.height / 2 + 15);
        ctx.lineTo(centerX + dimensions.width / 2 - offset, centerY + dimensions.height / 2 + 15);
        ctx.stroke();
        
        // Height dimension line (perpendicular to base)
        ctx.beginPath();
        ctx.moveTo(centerX + dimensions.width / 2, centerY - dimensions.height / 2);
        ctx.lineTo(centerX + dimensions.width / 2 - offset, centerY + dimensions.height / 2);
        ctx.stroke();
        
        // Labels
        ctx.setLineDash([]);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${dimensions.width}`, centerX, centerY + dimensions.height / 2 + 30);
        ctx.fillText(`${dimensions.height}`, centerX + dimensions.width / 2 - offset / 2 + 20, centerY);
        break;
        
      case 'hexagon':
        // Draw regular hexagon
        ctx.beginPath();
        const sideLength = dimensions.sideLength;
        const radius = sideLength;
        
        // Start at top point and work clockwise
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        
        // Draw one side length
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        
        const angle1 = -Math.PI / 6;
        const angle2 = Math.PI / 6;
        const x1 = centerX + radius * Math.cos(angle1);
        const y1 = centerY + radius * Math.sin(angle1);
        const x2 = centerX + radius * Math.cos(angle2);
        const y2 = centerY + radius * Math.sin(angle2);
        
        // Draw dimension line outside the shape
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Label
        ctx.setLineDash([]);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`s = ${sideLength}`, (x1 + x2) / 2, ((y1 + y2) / 2) - 15);
        break;
    }
  };

  const handleDimensionChange = (dimension: keyof typeof dimensions, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setDimensions(prev => ({
        ...prev,
        [dimension]: Math.min(numValue, 250) // Cap at 250 to fit in canvas
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    isDraggingRef.current = true;
    lastPosRef.current = { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = x - lastPosRef.current.x;
    const deltaY = y - lastPosRef.current.y;
    
    // Update shape dimensions based on drag
    switch (shape) {
      case 'rectangle':
      case 'parallelogram':
        setDimensions(prev => ({
          ...prev,
          width: Math.max(10, prev.width + deltaX),
          height: Math.max(10, prev.height - deltaY),
        }));
        break;
      case 'circle':
        setDimensions(prev => ({
          ...prev,
          radius: Math.max(10, prev.radius + (deltaX + deltaY) / 2),
        }));
        break;
      case 'triangle':
        setDimensions(prev => ({
          ...prev,
          width: Math.max(10, prev.width + deltaX),
          height: Math.max(10, prev.height - deltaY),
        }));
        break;
      case 'trapezoid':
        // Update base lengths
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          setDimensions(prev => ({
            ...prev,
            height: Math.max(10, prev.height - deltaY),
          }));
        } else {
          setDimensions(prev => ({
            ...prev,
            base1: Math.max(10, prev.base1 + deltaX),
            base2: Math.max(10, prev.base2 + deltaX * 0.7), // Scale second base differently
          }));
        }
        break;
      case 'hexagon':
        setDimensions(prev => ({
          ...prev,
          sideLength: Math.max(10, prev.sideLength + (deltaX + deltaY) / 4),
        }));
        break;
    }
    
    lastPosRef.current = { x, y };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Geometry Visualizer</CardTitle>
        <CardDescription>
          Visualize and calculate properties of different geometric shapes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rectangle" onValueChange={(value) => setShape(value as Shape)}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="rectangle">Rectangle</TabsTrigger>
            <TabsTrigger value="circle">Circle</TabsTrigger>
            <TabsTrigger value="triangle">Triangle</TabsTrigger>
            <TabsTrigger value="trapezoid">Trapezoid</TabsTrigger>
            <TabsTrigger value="parallelogram">Parallelogram</TabsTrigger>
            <TabsTrigger value="hexagon">Hexagon</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-end mb-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowGrid(!showGrid)}
                      className="text-xs"
                    >
                      {showGrid ? "Hide Grid" : "Show Grid"}
                    </Button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    className="w-full border rounded-md bg-white cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                  <div className="text-xs text-center text-gray-500 mt-2">
                    Drag to resize the shape
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Dimensions</h3>
                    
                    <TabsContent value="rectangle" className="space-y-2 mt-0">
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Width:</label>
                        <Input
                          type="number"
                          value={dimensions.width}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          min="10"
                          max="250"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Height:</label>
                        <Input
                          type="number"
                          value={dimensions.height}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          min="10"
                          max="250"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="circle" className="space-y-2 mt-0">
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Radius:</label>
                        <Input
                          type="number"
                          value={dimensions.radius}
                          onChange={(e) => handleDimensionChange('radius', e.target.value)}
                          min="10"
                          max="150"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="triangle" className="space-y-2 mt-0">
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Base:</label>
                        <Input
                          type="number"
                          value={dimensions.width}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          min="10"
                          max="250"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Height:</label>
                        <Input
                          type="number"
                          value={dimensions.height}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          min="10"
                          max="250"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="trapezoid" className="space-y-2 mt-0">
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Base 1:</label>
                        <Input
                          type="number"
                          value={dimensions.base1}
                          onChange={(e) => handleDimensionChange('base1', e.target.value)}
                          min="10"
                          max="250"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Base 2:</label>
                        <Input
                          type="number"
                          value={dimensions.base2}
                          onChange={(e) => handleDimensionChange('base2', e.target.value)}
                          min="10"
                          max="250"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Height:</label>
                        <Input
                          type="number"
                          value={dimensions.height}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          min="10"
                          max="250"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="parallelogram" className="space-y-2 mt-0">
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Width:</label>
                        <Input
                          type="number"
                          value={dimensions.width}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          min="10"
                          max="250"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Height:</label>
                        <Input
                          type="number"
                          value={dimensions.height}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          min="10"
                          max="250"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="hexagon" className="space-y-2 mt-0">
                      <div className="flex items-center space-x-2">
                        <label className="w-20">Side:</label>
                        <Input
                          type="number"
                          value={dimensions.sideLength}
                          onChange={(e) => handleDimensionChange('sideLength', e.target.value)}
                          min="10"
                          max="100"
                        />
                      </div>
                    </TabsContent>
                  </div>
                  
                  <div className="space-y-2 border-t pt-4">
                    <h3 className="font-medium">Calculations</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-medium">{results.area} square units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {shape === 'circle' ? 'Circumference:' : 'Perimeter:'}
                        </span>
                        <span className="font-medium">{results.perimeter} units</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" onClick={calculateResults}>
                    Recalculate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Visualizer;
