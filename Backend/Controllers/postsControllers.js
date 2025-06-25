const { readFile, readFileSync, writeFile } = require('fs')
const path = require('path')

const postsFile = path.join(__dirname, '../Data/posts.json');
const idFile = path.join(__dirname, '../Data/lastId.txt');


const getPosts = (req, res) => {
  readFile(postsFile, 'utf8', (err, result) => {
    if (err) return res.status(500).json({ message: 'Server Error' })
    res.json(JSON.parse(result))
  })
}

const createPost = (req, res) => {
  const { title, author, content} = req.body;
  if (!title || !author || !content) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  readFile(postsFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Server Error' })
    const posts = JSON.parse(data)
    req.body.id = parseInt(readFileSync(idFile, 'utf8'), 10) + 1

    posts.push(req.body)

    writeFile(postsFile, JSON.stringify(posts), (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update file'})

      writeFile(idFile, String(req.body.id), (err) => {
        if (err) return res.status(500).json({ message: 'Failed to update id'})
        
        res.status(200).json({ message: 'Sucesfully Wrote to file' })
      })
    })
  })
}

const findId = (req, res, next, value) => {
  readFile(postsFile, 'utf8', (err, result) => {
    if (err) return res.status(500).json({ message: 'Server Error' })
    const posts = JSON.parse(result)
    req.post = posts.find(elem => elem.id === parseInt(value))
    if (req.post == undefined) {
      return res.status(404).json({ message: 'Could not find blog post' })
    }
    next()
  })
}

module.exports = { getPosts, createPost, findId }