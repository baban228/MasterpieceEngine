import React, { useState, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import DrawingBoard from '../DrawingBoard';

interface PageShellContext {
  setIsDrawingVisible: (visible: boolean) => void;
  setDrawingContent: (content: string | undefined) => void;
  setOnSaveDrawing: (handler: ((content: string) => Promise<void>) | undefined) => void;
  setActiveBoard: (id: string | null) => void;
  activeBoard: string | null;
}

const PageShell: React.FC = () => {
  const [isDrawingVisible, setIsDrawingVisible] = useState(false);
  const [drawingContent, setDrawingContent] = useState<string>();
  const [onSaveDrawing, setOnSaveDrawing] = useState<((content: string) => Promise<void>) | undefined>();
  const [activeBoard, setActiveBoard] = useState<string | null>(null);
  const [backgroundContent, setBackgroundContent] = useState<string>();

  const handleSave = useCallback(async (content: string) => {
    if (onSaveDrawing) {
      try {
        await onSaveDrawing(content);
      } catch (error) {
        console.error('Failed to save drawing:', error);
      }
    }
  }, [onSaveDrawing]);

  // Update background content when drawing content changes and there's an active board
  useEffect(() => {
    if (activeBoard) {
      setBackgroundContent(drawingContent);
    }
  }, [activeBoard, drawingContent]);

  return (
    <div className={`page-shell ${activeBoard ? 'page-shell--has-background' : ''}`}>
      <Header />
      {activeBoard && (
        <DrawingBoard 
          isVisible={true}
          initialContent={backgroundContent}
          isBackground={true}
        />
      )}
      <main className={`page-shell__main ${isDrawingVisible ? 'page-shell__main--with-board' : ''}`}>
        <div className="page-shell__content">
          <Outlet context={{ 
            setIsDrawingVisible, 
            setDrawingContent,
            setOnSaveDrawing,
            setActiveBoard,
            activeBoard
          }} />
        </div>
        {isDrawingVisible && (
          <DrawingBoard 
            isVisible={true}
            initialContent={drawingContent}
            onSave={handleSave}
            isBackground={false}
          />
        )}
      </main>
    </div>
  );
};

export type { PageShellContext };
export default PageShell;
