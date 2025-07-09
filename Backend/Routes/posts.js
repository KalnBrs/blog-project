const express = require('express');
const path = require('path')
const pool = require('../db')

const { getPosts, createPost, findId } = require(path.join(__dirname, '../Controllers/postsControllers.js'));

const router = express.Router();

router.param('id', findId)

router.get('/', getPosts)
router.post('/', createPost)

router.route('/:id')
  .get((req, res) => {
    res.status(200).json(req.post)
  })
  .put((req, res) => {
    try {
      const { post_uid, title, author, content } = req.body
      pool.query(' UPDATE posts SET title = $1, author = $2, content = $3 WHERE post_uid = $4', 
        [title, author, content, post_uid]
      )
      res.status(203).json({ message: 'Server Updated'})
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ message: 'Server Error'})
    }
  })
  .delete((req, res) => {
    const { post_uid } = req.body
    try {
      pool.query('DELETE FROM posts WHERE post_uid = $1', [post_uid])
      res.status(204).json({ message: 'Deleted Post'})
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ message: 'Failed to delete' })
    }
  })
module.exports = router;