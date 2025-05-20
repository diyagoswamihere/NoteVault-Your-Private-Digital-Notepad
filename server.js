const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy login credentials
const USER = {
  username: 'admin',
  password: '1234'
};

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle login POST request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    res.redirect('/notes.html');
  } else {
    res.send(`<h2>Login Failed</h2><p>Invalid username or password.</p>`);
  }
});
let notes = []; // Temporary note storage


app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// Route to add a new note
app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  if (content && content.trim() !== "") {
    const note = { id: Date.now(), content };
    notes.push(note);
    res.json({ message: 'Note added', note });
  } else {
    res.status(400).json({ error: 'Note content required' });
  }
});
// Route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  notes = notes.filter(note => note.id !== noteId);
  res.json({ message: 'Note deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

