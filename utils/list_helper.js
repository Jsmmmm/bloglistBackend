
const countTotalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const blogWithMostLikes = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  })
}

const authorWithMostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let maxAuthor = null
  let maxBlogs = 0

  for (const author in counts) {
    if (counts[author] > maxBlogs) {
      maxBlogs = counts[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}

module.exports = {
  countTotalLikes,
  blogWithMostLikes,
  authorWithMostBlogs
}