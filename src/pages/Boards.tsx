import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Board, getBoards } from '../services/boardService';

const Boards: React.FC = () => {
  const { data: boards, isLoading } = useQuery({
    queryKey: ['boards'],
    queryFn: getBoards
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="boards-page">
      <div className="boards-page__header">
        <h1>Your Boards</h1>
        <Link to="/board/new" className="boards-page__new-btn">New Board</Link>
      </div>
      <div className="boards-page__grid">
        {boards?.map(board => (
          <Link key={board.id} to={`/board/${board.id}`} className="board-card">
            <div className="board-card__thumbnail">
              <img src={board.thumbnail} alt={board.name} />
            </div>
            <div className="board-card__info">
              <h3>{board.name}</h3>
              <p>Last modified: {board.lastModified}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Boards;