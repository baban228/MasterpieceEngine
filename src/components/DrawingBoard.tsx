import React, { useEffect, useRef, useState } from 'react';

interface DrawingBoardProps {
  isVisible: boolean;
  onSave?: (content: string) => void;
  initialContent?: string;
}

interface Point {
  x: number;
  y: number;
}

const DrawingBoard: React.FC<DrawingBoardProps> = ({ isVisible, onSave, initialContent }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  // Initialize context when component mounts or isVisible changes
  useEffect(() => {
    console.log('Effect running, isVisible:', isVisible);
    if (!isVisible) return;

    const canvas = canvasRef.current;
    console.log('Canvas ref:', canvas);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    console.log('Got context:', ctx);
    if (!ctx) return;

    const resizeCanvas = () => {
      console.log('Resizing canvas');
      const rect = canvas.getBoundingClientRect();
      
      // Set display size
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      // Set actual size in memory
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Configure context
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Reload content after resize
      if (initialContent) {
        loadContent(initialContent);
      }
    };

    // Initial resize
    resizeCanvas();
    
    // Set up resize observer
    const observer = new ResizeObserver(() => {
      console.log('Resize observed');
      resizeCanvas();
    });
    observer.observe(canvas);

    // Set context in state
    setContext(ctx);
    console.log('Context set in state:', ctx);

    return () => {
      console.log('Cleanup: removing observer');
      observer.disconnect();
      setContext(null); // Clear context on cleanup
    };
  }, [isVisible, initialContent]);

  // Load initial content if provided
  useEffect(() => {
    if (initialContent && context && canvasRef.current) {
      loadContent(initialContent);
    }
  }, [initialContent, context]);

  const loadContent = (content: string) => {
    if (!context || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      context.drawImage(img, 0, 0);
    };
    img.src = content;
  };

  const saveContent = () => {
    if (!canvasRef.current || !onSave) return;
    const content = canvasRef.current.toDataURL('image/png');
    onSave(content);
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    return {
      x: ((e.clientX - rect.left) * (canvas.width / rect.width)) / dpr,
      y: ((e.clientY - rect.top) * (canvas.height / rect.height)) / dpr
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const touch = e.touches[0];

    return {
      x: ((touch.clientX - rect.left) * (canvas.width / rect.width)) / dpr,
      y: ((touch.clientY - rect.top) * (canvas.height / rect.height)) / dpr
    };
  };

  const configureContext = () => {
    if (!context) return;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  };
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    console.log('Start drawing called, context:', context, 'canvas:', canvasRef.current);
    if (!context || !canvasRef.current) {
      console.log('Missing context or canvas');
      return;
    }
    
    e.preventDefault();
    console.log('Starting to draw');
    
    const pos = 'touches' in e ? getTouchPos(e) : getMousePos(e);
    setIsDrawing(true);
    setLastPoint(pos);
    
    configureContext();
    
    // Draw an initial point
    context.beginPath();
    context.arc(pos.x, pos.y, lineWidth / 2, 0, Math.PI * 2);
    context.fill();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !lastPoint) return;
    e.preventDefault();

    const pos = 'touches' in e ? getTouchPos(e) : getMousePos(e);
    configureContext();
    
    // Draw a line from last point to current point
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(pos.x, pos.y);
    context.stroke();
    
    setLastPoint(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
    if (context) {
      context.closePath();
    }
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  if (!isVisible) return null;

  return (
    <div className="drawing-board">
      <div className="drawing-board__tools">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="drawing-board__color-picker"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="drawing-board__line-width"
        />
        <button 
          className="drawing-board__clear-btn"
          onClick={clearCanvas}
        >
          Clear
        </button>
        {onSave && (
          <button 
            className="drawing-board__save-btn"
            onClick={saveContent}
          >
            Save
          </button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className="drawing-board__canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};

export default DrawingBoard;
