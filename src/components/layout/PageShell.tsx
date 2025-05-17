import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import DrawingBoard from '../DrawingBoard';

interface PageShellContext {
  setIsDrawingVisible: (visible: boolean) => void;
  setDrawingContent: (content: string | undefined) => void;
  setOnSaveDrawing: (handler: ((content: string) => Promise<void>) | undefined) => void;
}

const PageShell: React.FC = () => {
  const [isDrawingVisible, setIsDrawingVisible] = useState(false);
  const [drawingContent, setDrawingContent] = useState<string>();
  const [onSaveDrawing, setOnSaveDrawing] = useState<((content: string) => Promise<void>) | undefined>();

  const handleSave = useCallback(async (content: string) => {
    if (onSaveDrawing) {
      try {
        await onSaveDrawing(content);
      } catch (error) {
        console.error('Failed to save drawing:', error);
      }
    }
  }, [onSaveDrawing]);

  return (
    <div className="page-shell">
      <Header />
      <main className={`page-shell__main ${isDrawingVisible ? 'page-shell__main--with-board' : ''}`}>
        <div className="page-shell__content">
          <Outlet context={{ 
            setIsDrawingVisible, 
            setDrawingContent,
            setOnSaveDrawing
          }} />
        </div>
        <DrawingBoard 
          isVisible={isDrawingVisible} 
          initialContent={drawingContent}
          onSave={handleSave}
        />
      </main>
    </div>
  );
};

export type { PageShellContext };
export default PageShell;
