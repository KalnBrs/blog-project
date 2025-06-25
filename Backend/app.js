const cors = require('cors')
const express = require('express');
const app = express();

const postRoute = require('./Routes/posts')

app.use(express.json())
app.use(cors())
app.use('/API/posts', postRoute)

app.get('/', (req, res) => {
  res.send('Welcome to the API')
})

module.exports = app
