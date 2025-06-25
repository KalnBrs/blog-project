const { readFile, writeFile, readFileSync } = require('fs')

const cors = require('cors')
const path = require('path')
const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT

app.use(express.json())
app.use(cors())

const postsPath = path.join(__dirname, 'posts.json');
const idPath = path.join(__dirname, 'lastId.txt');

app.get('/posts', (req, res) => {
  readFile('./posts.json', 'utf8', (err, result) => {
    if (err) {
      res.status(500).send('Could not read post file');
      return;
    }
    try {
      const posts = JSON.parse(result)
      res.status(200).json(posts);
    } catch (parseError) {
      res.status(500).send('Invalid JSON format in posts file')
    }
  })
})

app.post('/posts', (req, res) => {
  readFile(postsPath, 'utf8', (err, result) => {
    if (err) {
      res.status(500).send('Could not find post file');
      return;
    }

    let posts = JSON.parse(result);
    const lastId = parseInt(readFileSync(idPath, 'utf8'), 10);
    req.body.id = lastId + 1;

    posts.push(req.body);

    writeFile(postsPath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        console.error('Error writing posts.json:', err);
        res.status(500).send('Failed to write post');
        return;
      }

      writeFile(idPath, String(req.body.id), (err) => {
        if (err) {
          console.error('Error writing lastId.txt:', err);
          // You could still return 200 since the post was saved
          return;
        }

        res.status(200).send('Wrote to file');
      });
    });
  });
});

app.route('/posts/:id')
  .get((req, res) => {
    res.status(200).json(req.post)
  })


app.param('id', (req, res, next, value) => {
  readFile(postsPath, 'utf8', (err, result) => {
    if (err) {
      res.status(500).send('Could not find posts file')
      return
    }
    let posts = JSON.parse(result)
    req.post = posts.find(elem => elem.id === parseInt(value))
    if (req.post == undefined) {
      res.status(404).send('Could not find blog post')
    }
    next();
  })
})

app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`)
})