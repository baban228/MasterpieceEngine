import { v4 as uuidv4 } from 'uuid';

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  description: string;
  thumbnail: string;
  content?: string;
}

/**
 * GET /api/boards
 */
export const getBoards = async (): Promise<Board[]> => {
  const response = await fetch('/api/boards');
  if (!response.ok) {
    throw new Error('Failed to fetch boards');
  }
  const data = await response.json();
  return data.boards;
};

/**
 * GET /api/boards/{id}
 */
export const getBoard = async (id: string): Promise<Board | undefined> => {
  const response = await fetch(`/api/boards/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch board');
  }
  return response.json();
};

/**
 * POST /api/boards
 */
export const createNewBoard = async (): Promise<Board> => {
  const now = new Date().toISOString();
  const newBoard: Board = {
    id: uuidv4(),
    name: 'Untitled Board',
    createdAt: now,
    lastModified: now,
    description: 'New drawing board',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
  };

  const response = await fetch('/api/boards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBoard),
  });

  if (!response.ok) {
    throw new Error('Failed to create board');
  }

  return response.json();
};

/**
 * PUT /api/boards/{id}
 */
export const updateBoard = async (board: Board): Promise<Board> => {
  const response = await fetch(`/api/boards/${board.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(board),
  });

  if (!response.ok) {
    throw new Error('Failed to update board');
  }

  return response.json();
};

/**
 * DELETE /api/boards/{id}
 */
export const deleteBoard = async (id: string): Promise<void> => {
  const response = await fetch(`/api/boards/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete board');
  }
};

/**
 * PUT /api/boards/{id}/drawing
 */
export const saveDrawing = async (boardId: string, content: string): Promise<Board> => {
  const response = await fetch(`/api/boards/${boardId}/drawing`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to save drawing');
  }

  return response.json();
};
