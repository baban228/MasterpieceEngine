import React, { useEffect, useCallback, useState } from "react";
import { useParams, useOutletContext, Navigate, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Board as BoardType, createNewBoard, getBoard, updateBoard, saveDrawing } from "../services/boardService";
import type { PageShellContext } from "../components/layout/PageShell";

const Board: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const { 
    setIsDrawingVisible, 
    setDrawingContent, 
    setOnSaveDrawing, 
    setActiveBoard,
    activeBoard
  } = useOutletContext<PageShellContext>();
  const queryClient = useQueryClient();

  // Clean up on component unmount or when active board changes
  useEffect(() => {
    return () => {
      if (!activeBoard || activeBoard !== id) {
        setIsDrawingVisible(false);
        setDrawingContent(undefined);
        setOnSaveDrawing(undefined);
      }
    };
  }, [setIsDrawingVisible, setDrawingContent, setOnSaveDrawing, activeBoard, id]);

  const { data: board, isLoading, isError } = useQuery({
    queryKey: ["board", id],
    queryFn: async () => {
      try {
        if (id === 'new') {
          const newBoard = await createNewBoard();
          queryClient.invalidateQueries({ queryKey: ["boards"] });
          return newBoard;
        }
        const board = await getBoard(id!);
        if (!board) throw new Error('Board not found');
        return board;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load board');
        throw error;
      }
    },
    enabled: !!id,
    retry: false
  });

  const updateBoardMutation = useMutation({
    mutationFn: updateBoard,
    onSuccess: (updatedBoard) => {
      queryClient.setQueryData(["board", updatedBoard.id], updatedBoard);
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to update board');
    }
  });

  const saveDrawingMutation = useMutation({
    mutationFn: ({ boardId, content }: { boardId: string; content: string }) => 
      saveDrawing(boardId, content),
    onSuccess: (updatedBoard) => {
      queryClient.setQueryData(["board", updatedBoard.id], updatedBoard);
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      // Update the drawing content in PageShell
      if (updatedBoard.content) {
        setDrawingContent(updatedBoard.content);
      }
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to save drawing');
    }
  });

  const handleSave = useCallback(async (content: string) => {
    if (!board) return;
    setError(undefined);
    try {
      await saveDrawingMutation.mutateAsync({ boardId: board.id, content });
    } catch (error) {
      console.error('Save failed:', error);
    }
  }, [board, saveDrawingMutation]);

  // Set up drawing visibility and handlers
  useEffect(() => {
    if (!board) return;
    
    setIsDrawingVisible(true);
    if (board.content) {
      setDrawingContent(board.content);
    }
    setOnSaveDrawing(handleSave);
  }, [setIsDrawingVisible, setDrawingContent, setOnSaveDrawing, board, handleSave]);

  if (isLoading) return <div className="board-page__loading">Loading...</div>;
  if (isError || !board) return (
    <div className="board-page__error">
      <h2>Error</h2>
      <p>{error || 'Board not found'}</p>
      <button 
        className="board-page__back-btn" 
        onClick={() => navigate('/boards')}
      >
        Back to Boards
      </button>
    </div>
  );

  const handleBack = () => {
    setIsDrawingVisible(false);
    setDrawingContent(undefined);
    setOnSaveDrawing(undefined);
    navigate('/boards');
  };

  const handleUpdateBoard = async (updates: Partial<BoardType>) => {
    setError(undefined);
    await updateBoardMutation.mutateAsync({ ...board, ...updates });
  };

  const toggleActiveBoard = () => {
    if (activeBoard === board.id) {
      setActiveBoard(null);
    } else {
      setActiveBoard(board.id);
      // Set the content for the background board
      if (board.content) {
        setDrawingContent(board.content);
      }
    }
  };

  return (
    <div className="board-page">
      {error && (
        <div className="board-page__error-message">
          {error}
        </div>
      )}
      <div className="board-page__header">
        <div className="board-page__title">
          <button 
            className="board-page__back-btn" 
            onClick={handleBack}
          >
            Back to Boards
          </button>
          <h1>{board.name}</h1>
          <div className="board-page__actions">
            <button 
              className="board-page__save-btn"
              onClick={() => {
                const newName = prompt('Enter new name:', board.name);
                if (newName) handleUpdateBoard({ name: newName });
              }}
            >
              Rename
            </button>
            <button 
              className={`board-page__active-btn ${activeBoard === board.id ? 'board-page__active-btn--active' : ''}`}
              onClick={toggleActiveBoard}
            >
              {activeBoard === board.id ? 'Remove as Active' : 'Set as Active'}
            </button>
          </div>
        </div>
      </div>
      <div className="board-page__info">
        <p><strong>Created:</strong> {board.createdAt}</p>
        <p><strong>Last modified:</strong> {board.lastModified}</p>
      </div>
      <div className="board-page__description">
        <p>{board.description}</p>
        <button 
          className="board-page__save-btn"
          onClick={() => {
            const newDescription = prompt('Enter new description:', board.description);
            if (newDescription) handleUpdateBoard({ description: newDescription });
          }}
        >
          Edit Description
        </button>
      </div>
    </div>
  );
};

export default Board;
