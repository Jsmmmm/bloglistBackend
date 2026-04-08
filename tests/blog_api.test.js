const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const testHelper = require('./testHelper')
const User = require('../models/user')

const api = supertest(app)



beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(testHelper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(testHelper.initialBlogs[1])
  await blogObject.save()

  await User.deleteMany({})
  let userObject = new User(testHelper.initialUsers[0])
  await userObject.save()
  userObject = new User(testHelper.initialUsers[1]) 
  await userObject.save()
  
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


    const blogsAtEnd = await testHelper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length)
})

test('blogs have id field instead of _id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    assert(blog.id !== undefined)
    assert(blog._id === undefined)
  })
})

test('add blog successfully', async () => {

  const users = await testHelper.usersInDb()
  const user = users[0]
    const testAdd = 
    {
        title: 'testi add blog',
        author: 'Testi Joonas',
        url: 'http://kokeilu.com',
        likes: 10,
        userId: user.id
    }

    await api.post('/api/blogs').send(testAdd).expect(201).expect('Content-type', /application\/json/)

    const blogsAtEnd = await testHelper.blogsInDb()
    
    const titles = blogsAtEnd.map(r => r.title)
    assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length + 1)

    assert(titles.includes('testi add blog'))
})

test('get blog by id', async () => {
  const blogsAtStart = await testHelper.blogsInDb()
  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body.title, blogToView.title)
  assert.deepStrictEqual(resultBlog.body.author, blogToView.author)
})

test('delete blog by id', async () => {
  const blogsAtStart = await testHelper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await testHelper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(!titles.includes(blogToDelete.title))
})

test('if not given likes, default to 0', async () => {
  const users = await testHelper.usersInDb()
  const user = users[0]

  const blog = {
    ...testHelper.blogWithLikesNotGiven,
    userId: user.id
  }
    const response = await api.post('/api/blogs').send(blog).expect(201).expect('Content-type', /application\/json/)
    const savedBlog = response.body
    console.log('täsä liket: '+savedBlog.likes)
    assert.strictEqual (savedBlog.likes, 0)
})
 


after(async () => {
  await mongoose.connection.close()
})