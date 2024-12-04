const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admindatabase18',
  database: 'todo_list'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.post('/addTask', (req, res) => {
  const { text, date, description } = req.body;
  const query = 'INSERT INTO tasks (text, date, description) VALUES (?, ?, ?)';
  db.query(query, [text, date, description], (err, result) => {
    if (err) throw err;
    res.send('Task added');
  });
});

app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.delete('/deleteTask/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send('Task deleted');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});