const { test, describe } = require('node:test')
const testData = require('./testHelper') 
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('countTotalLikes', () => {

  test("with one blog", () => {
    const result = listHelper.countTotalLikes(testData.blogs1)
    assert.strictEqual(result, 5)
  })

  test("with six blogs", () => {
    const result = listHelper.countTotalLikes(testData.blogs6)
    assert.strictEqual(result, 36)
  })

  test("with zero blogs", () => {
    const result = listHelper.countTotalLikes([])
    assert.strictEqual(result, 0)
  })

})

describe('favorite blog with most likes', () => {

  test("with zero blogs", () => {
    const result = listHelper.blogWithMostLikes(testData.blogs0)
    assert.strictEqual(result, null)
  })

  test("with six blogs", () => {
    const result = listHelper.blogWithMostLikes(testData.blogs6)
    assert.deepStrictEqual(result, testData.blogs6[2])
  })
})

describe('author with most blogs', () => {

  test("with zero blogs", () => {
    const result = listHelper.authorWithMostBlogs(testData.blogs0)
    assert.strictEqual(result, null)
  })

  test("with six blogs", () => {
    const result = listHelper.authorWithMostBlogs(testData.blogs6)
    assert.deepStrictEqual(result.author, "Robert C. Martin")
    assert.deepStrictEqual(result.blogs, 3)
  })
})