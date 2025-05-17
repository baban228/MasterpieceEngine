import React, { useEffect, useCallback } from "react";
import { useParams, useOutletContext, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Board as BoardType, createNewBoard, getBoard, updateBoard, saveDrawing } from "../services/boardService";
import type { PageShellContext } from "../components/layout/PageShell";

const Board: React.FC = () => {
  const { id } = useParams();
  const { setIsDrawingVisible, setDrawingContent, setOnSaveDrawing } = useOutletContext<PageShellContext>();
  const queryClient = useQueryClient();

  const { data: board, isLoading, error } = useQuery({
    queryKey: ["board", id],
    queryFn: async () => {
      try {
        if (id === 'new') {
          const newBoard = await createNewBoard();
          queryClient.invalidateQueries({ queryKey: ["boards"] });
          return newBoard;
        }
        return getBoard(id!);
      } catch (error) {
        console.error('Failed to load board:', error);
        throw error;
      }
    },
    enabled: !!id
  });

  const updateBoardMutation = useMutation({
    mutationFn: updateBoard,
    onSuccess: (updatedBoard) => {
      queryClient.setQueryData(["board", updatedBoard.id], updatedBoard);
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error) => {
      console.error('Failed to update board:', error);
      alert('Failed to update board. Please try again.');
    }
  });

  const saveDrawingMutation = useMutation({
    mutationFn: ({ boardId, content }: { boardId: string; content: string }) => 
      saveDrawing(boardId, content),
    onSuccess: (updatedBoard) => {
      queryClient.setQueryData(["board", updatedBoard.id], updatedBoard);
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error) => {
      console.error('Failed to save drawing:', error);
      alert('Failed to save drawing. Please try again.');
    }
  });

  const handleSave = useCallback(async (content: string) => {
    if (!board) return;
    await saveDrawingMutation.mutateAsync({ boardId: board.id, content });
  }, [board, saveDrawingMutation]);

  useEffect(() => {
    setIsDrawingVisible(true);
    if (board?.content) {
      setDrawingContent(board.content);
    }
    setOnSaveDrawing(handleSave);
    
    return () => {
      setIsDrawingVisible(false);
      setDrawingContent(undefined);
      setOnSaveDrawing(undefined);
    };
  }, [setIsDrawingVisible, setDrawingContent, setOnSaveDrawing, board, handleSave]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading board: {error.toString()}</div>;
  if (!board) return <Navigate to="/boards" replace />;

  const handleUpdateBoard = async (updates: Partial<BoardType>) => {
    try {
      await updateBoardMutation.mutateAsync({ ...board, ...updates });
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  return (
    <div className="board-page">
      <div className="board-page__header">
        <div className="board-page__title">
          <h1>{board.name}</h1>
          <button 
            className="board-page__save-btn"
            onClick={() => {
              const newName = prompt('Enter new name:', board.name);
              if (newName) handleUpdateBoard({ name: newName });
            }}
          >
            Rename
          </button>
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
