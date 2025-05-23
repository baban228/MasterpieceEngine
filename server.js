const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

const BOARDS_FILE = path.join(__dirname, 'public/data/boards.json');
const BOARDS_DIR = path.join(__dirname, 'public/data/boards');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(path.dirname(BOARDS_FILE), { recursive: true });
    await fs.mkdir(BOARDS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// Get all boards
app.get('/api/boards', async (req, res) => {
  try {
    const data = await fs.readFile(BOARDS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, return empty array
      res.json({ boards: [] });
    } else {
      console.error('Error reading boards:', error);
      res.status(500).json({ error: 'Failed to read boards' });
    }
  }
});

// Get single board
app.get('/api/boards/:id', async (req, res) => {
  try {
    const boardsData = await fs.readFile(BOARDS_FILE, 'utf-8');
    const { boards } = JSON.parse(boardsData);
    const board = boards.find(b => b.id === req.params.id);
    
    if (!board) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    // Try to load content
    try {
      const contentData = await fs.readFile(
        path.join(BOARDS_DIR, `${req.params.id}.json`),
        'utf-8'
      );
      board.content = JSON.parse(contentData).content;
    } catch (err) {
      // Content file might not exist yet, that's OK
      console.log('No content file found for board:', req.params.id);
    }

    res.json(board);
  } catch (error) {
    console.error('Error getting board:', error);
    res.status(500).json({ error: 'Failed to read board' });
  }
});

// Create new board
app.post('/api/boards', async (req, res) => {
  try {
    let boards = [];
    try {
      const data = await fs.readFile(BOARDS_FILE, 'utf-8');
      boards = JSON.parse(data).boards;
    } catch (err) {
      // File might not exist yet
      console.log('No boards file found, creating new one');
    }

    const newBoard = req.body;
    boards.push(newBoard);
    
    await fs.writeFile(BOARDS_FILE, JSON.stringify({ boards }, null, 2));
    res.json(newBoard);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// Update board
app.put('/api/boards/:id', async (req, res) => {
  try {
    const data = await fs.readFile(BOARDS_FILE, 'utf-8');
    const { boards } = JSON.parse(data);
    const index = boards.findIndex(b => b.id === req.params.id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    const updatedBoard = {
      ...req.body,
      lastModified: new Date().toISOString()
    };
    boards[index] = updatedBoard;
    
    await fs.writeFile(BOARDS_FILE, JSON.stringify({ boards }, null, 2));
    res.json(updatedBoard);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

// Save drawing
app.put('/api/boards/:id/drawing', async (req, res) => {
  try {
    // Save content to separate file
    await fs.writeFile(
      path.join(BOARDS_DIR, `${req.params.id}.json`),
      JSON.stringify({ content: req.body.content }, null, 2)
    );

    // Update board metadata
    const data = await fs.readFile(BOARDS_FILE, 'utf-8');
    const { boards } = JSON.parse(data);
    const index = boards.findIndex(b => b.id === req.params.id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    const updatedBoard = {
      ...boards[index],
      lastModified: new Date().toISOString(),
      thumbnail: req.body.content
    };
    boards[index] = updatedBoard;
    
    await fs.writeFile(BOARDS_FILE, JSON.stringify({ boards }, null, 2));

    // Return the updated board with content
    res.json({
      ...updatedBoard,
      content: req.body.content
    });
  } catch (error) {
    console.error('Error saving drawing:', error);
    res.status(500).json({ error: 'Failed to save drawing' });
  }
});

// Delete board
app.delete('/api/boards/:id', async (req, res) => {
  try {
    const data = await fs.readFile(BOARDS_FILE, 'utf-8');
    let { boards } = JSON.parse(data);
    boards = boards.filter(b => b.id !== req.params.id);
    
    await fs.writeFile(BOARDS_FILE, JSON.stringify({ boards }, null, 2));

    // Try to delete content file
    try {
      await fs.unlink(path.join(BOARDS_DIR, `${req.params.id}.json`));
    } catch (err) {
      // Content file might not exist, that's OK
      console.log('No content file found to delete for board:', req.params.id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

ensureDirectories().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
