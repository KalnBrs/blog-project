const pool = require('../db')

const getPosts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts')
    res.json(result.rows)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ message: 'Server Error' })
  }
}

const createPost = async (req, res) => {
  const { title, author, content} = req.body;
  if (!title || !author || !content) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  try {
    const result = await pool.query(' INSERT INTO posts (post_uid, title, author, content) VALUES (uuid_generate_v4(), $1, $2, $3) RETURNING *', [title, author, content]);
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ message: 'Server Error' })
  }
}

const findId = async (req, res, next, value) => {
  try {
    const result = await pool.query('SELECT * FROM posts WHERE post_uid = $1', [value])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    req.post = result.rows[0];
    next()
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' })
  }
}

module.exports = { getPosts, createPost, findId }