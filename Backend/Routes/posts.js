const express = require('express');
const path = require('path')
const { getPosts, createPost, findId } = require(path.join(__dirname, '../Controllers/postsControllers.js'));

const router = express.Router();

router.param('id', findId)

router.get('/', getPosts)
router.post('/', createPost)

router.route('/:id')
  .get((req, res) => {
    res.status(200).json(req.post)
  })


module.exports = router;