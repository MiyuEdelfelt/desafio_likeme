const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

//Ruta GET para obtener todos los posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// Ruta POST para crear un nuevo post
app.post('/posts', async (req, res) => {
  const { titulo, url, descripcion } = req.body;

  console.log('📦 Datos recibidos:', req.body);

  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [titulo, url, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear el post:', error.message);
    res.status(500).json({ error: 'Error al crear el post' });
  }
});

//Desafío parte II

// Ruta PUT para dar like a un post
app.put('/posts/like/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al dar like:', error.message);
    res.status(500).json({ error: 'Error al dar like al post' });
  }
});

// Ruta DELETE para eliminar un post
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json({ mensaje: 'Post eliminado correctamente', post: result.rows[0] });
  } catch (error) {
    console.error('❌ Error al eliminar el post:', error.message);
    res.status(500).json({ error: 'Error al eliminar el post' });
  }
});



app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
