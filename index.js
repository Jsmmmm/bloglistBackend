require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())

const config = require('./utils/config')

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI, { family: 4 })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})


app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})