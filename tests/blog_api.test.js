const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const testData = require('./testHelper')

const api = supertest(app)



beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(testData.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(testData.initialBlogs[1])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert(titles.includes('React patterns'))
})

test('blog without title is not added', async () => {
    const testAdd = 
    {
        author: 'Jamppa',
        url: 'http://testi.com',
        likes: 9
    }
    await api.post('/api/blogs').send(testAdd).expect(400)


    const blogsAtEnd = await testData.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, testData.initialBlogs.length)
})

test('add blog successfully', async () => {
    const testAdd = 
    {
        title: 'testi add blog',
        author: 'Testi Joonas',
        url: 'http://kokeilu.com',
        likes: 10
    }

    await api.post('/api/blogs').send(testAdd).expect(201).expect('Content-type', /application\/json/)

    const blogsAtEnd = await testData.blogsInDb()
    
    const titles = blogsAtEnd.map(r => r.title)
    assert.strictEqual(blogsAtEnd.length, testData.initialBlogs.length + 1)

    assert(titles.includes('testi add blog'))
})




after(async () => {
  await mongoose.connection.close()
})