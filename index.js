require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const password = process.argv[2]
const mongoUrl = `mongodb+srv://testi_db_user:${password}@cluster0.zzh6kgf.mongodb.net/?appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl, { family: 4 })

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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})