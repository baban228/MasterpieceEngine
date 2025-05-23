import React, { useEffect, useRef, useState } from 'react';

interface DrawingBoardProps {
  isVisible: boolean;
  onSave?: (content: string) => void;
  initialContent?: string;
  isBackground?: boolean;
}

interface Point {
  x: number;
  y: number;
}

const DrawingBoard: React.FC<DrawingBoardProps> = ({ 
  isVisible, 
  onSave, 
  initialContent,
  isBackground = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Set canvas size to match container
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Configure context
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Reset transform and clear
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply current transform
      ctx.setTransform(scale, 0, 0, scale, offset.x, offset.y);

      // Reload content
      if (initialContent) {
        loadContent(initialContent);
      }
    };

    resizeCanvas();
    
    const observer = new ResizeObserver(resizeCanvas);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    setContext(ctx);

    return () => {
      observer.disconnect();
      setContext(null);
    };
  }, [isVisible, initialContent, scale, offset]);
  const loadContent = (content: string) => {
    if (!context || !canvasRef.current) return;
    if (!content) {
      clearCanvas();
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      if (!context || !canvasRef.current) return;
      
      // Clear with current transform
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.restore();
      
      // Draw image with current transform
      context.drawImage(
        img,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    };
    img.onerror = () => {
      console.error('Failed to load image content');
      clearCanvas();
    };
    img.src = content;
  };

  const saveContent = () => {
    if (!canvasRef.current || !onSave) return;
    const content = canvasRef.current.toDataURL('image/png');
    onSave(content);
  };

  const getCanvasPoint = (clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - offset.x) / scale;
    const y = (clientY - rect.top - offset.y) / scale;

    return { x, y };
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    return getCanvasPoint(e.clientX, e.clientY);
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>): Point => {
    const touch = e.touches[0];
    return getCanvasPoint(touch.clientX, touch.clientY);
  };

  const startDragging = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!e.altKey) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStart) return;
    e.preventDefault();
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const stopDragging = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.1), 5);

      // Adjust offset to zoom towards mouse position
      const scaleChange = newScale - scale;
      setOffset(prev => ({
        x: prev.x - mouseX * scaleChange,
        y: prev.y - mouseY * scaleChange
      }));
      setScale(newScale);
    }
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
    if (!context || !canvasRef.current) return;
    
    e.preventDefault();
    
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

  const zoomIn = () => setScale(prev => Math.min(prev * 1.2, 5));
  const zoomOut = () => setScale(prev => Math.max(prev * 0.8, 0.1));
  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  if (!isVisible) return null;

  return (
    <div className={`drawing-board ${isBackground ? 'drawing-board--background' : ''}`}>
      {!isBackground && (
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
          <div className="drawing-board__scale-controls">
            <button 
              className="drawing-board__scale-btn" 
              onClick={zoomOut}
            >
              -
            </button>            <button 
              className="drawing-board__scale-btn" 
              onClick={resetZoom}
            >
              {Math.round(scale * 100)}%
            </button>
            <button 
              className="drawing-board__scale-btn" 
              onClick={zoomIn}
            >
              +
            </button>
          </div>
          <button className="drawing-board__clear-btn" onClick={clearCanvas}>
            Clear
          </button>
          {onSave && (
            <button className="drawing-board__save-btn" onClick={saveContent}>
              Save
            </button>
          )}
        </div>
      )}
      <div 
        ref={containerRef}
        className="drawing-board__canvas-container"
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className="drawing-board__canvas"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0'
          }}
          onMouseDown={(e) => e.altKey ? startDragging(e) : startDrawing(e)}
          onMouseMove={(e) => isDragging ? handleDrag(e) : draw(e)}
          onMouseUp={() => isDragging ? stopDragging() : stopDrawing()}
          onMouseLeave={() => isDragging ? stopDragging() : stopDrawing()}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
};

export default DrawingBoard;
