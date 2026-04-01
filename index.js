require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())

const config = require('./utils/config')

const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI, { family: 4 })


app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})