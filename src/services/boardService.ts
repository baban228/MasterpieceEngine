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

// Mock data - will be replaced with API calls in production
let boards: Board[] = [
  {
    id: '1',
    name: 'Project Wireframe',
    createdAt: '2024-03-15',
    lastModified: '2024-03-16',
    description: 'Website layout mockup',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
  },
  {
    id: '2',
    name: 'Team Brainstorm',
    createdAt: '2024-03-14',
    lastModified: '2024-03-15',
    description: 'Feature ideas discussion',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
  }
];

/**
 * In production, this would be:
 * GET /api/boards
 */
export const getBoards = async (): Promise<Board[]> => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...boards];
};

/**
 * In production, this would be:
 * GET /api/boards/{id}
 */
export const getBoard = async (id: string): Promise<Board | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return boards.find(b => b.id === id);
};

/**
 * In production, this would be:
 * POST /api/boards
 */
export const createNewBoard = async (): Promise<Board> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = new Date().toISOString();
  const newBoard: Board = {
    id: uuidv4(),
    name: 'Untitled Board',
    createdAt: now,
    lastModified: now,
    description: 'New drawing board',
    thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
  };
  
  boards = [...boards, newBoard];
  return newBoard;
};

/**
 * In production, this would be:
 * PUT /api/boards/{id}
 */
export const updateBoard = async (board: Board): Promise<Board> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = boards.findIndex(b => b.id === board.id);
  if (index === -1) throw new Error('Board not found');

  const updatedBoard = {
    ...board,
    lastModified: new Date().toISOString()
  };
  
  boards = [...boards.slice(0, index), updatedBoard, ...boards.slice(index + 1)];
  return updatedBoard;
};

/**
 * In production, this would be:
 * DELETE /api/boards/{id}
 */
export const deleteBoard = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = boards.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Board not found');
  
  boards = [...boards.slice(0, index), ...boards.slice(index + 1)];
};

/**
 * In production, this would be:
 * PUT /api/boards/{id}/drawing
 * The content would be uploaded to a cloud storage service like AWS S3
 * and only the URL would be stored in the database
 */
export const saveDrawing = async (boardId: string, content: string): Promise<Board> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = boards.findIndex(b => b.id === boardId);
  if (index === -1) throw new Error('Board not found');

  const updatedBoard: Board = {
    ...boards[index],
    lastModified: new Date().toISOString(),
    content,
    thumbnail: content // In production, we would generate a smaller thumbnail
  };

  boards = [...boards.slice(0, index), updatedBoard, ...boards.slice(index + 1)];
  return updatedBoard;
};
