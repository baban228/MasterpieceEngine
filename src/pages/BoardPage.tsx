import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface BoardData {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  description: string;
  thumbnail: string;
}

const BoardPage: React.FC = () => {
  const { id } = useParams();
  const [isDrawingVisible, setIsDrawingVisible] = useState(false);

  const { data: board, isLoading } = useQuery({
    queryKey: ['board', id],
    queryFn: async () => {
      // In production, this would be:
      // const response = await fetch(`/api/boards/${id}`);
      const response = await fetch('/data/boards.json');
      const data = await response.json();
      return data.boards.find((b: BoardData) => b.id === id);
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!board) return <div>Board not found</div>;

  return (
    <div className="board-page">
      <div className="board-page__header">
        <h1>{board.name}</h1>
        <button 
          className="board-page__draw-btn"
          onClick={() => setIsDrawingVisible(!isDrawingVisible)}
        >
          {isDrawingVisible ? 'Hide Drawing' : 'Start Drawing'}
        </button>
      </div>
      <div className="board-page__info">
        <p><strong>Created:</strong> {board.createdAt}</p>
        <p><strong>Last modified:</strong> {board.lastModified}</p>
      </div>
      <div className="board-page__description">
        <h2>Description</h2>
        <p>{board.description}</p>
      </div>
      <div className="board-page__preview">
        <h2>Preview</h2>
        <img src={board.thumbnail} alt={board.name} />
      </div>
    </div>
  );
};

export default BoardPage;
