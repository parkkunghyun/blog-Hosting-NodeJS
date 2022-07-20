// @ts-check

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {string | Object} body
 */

/**
 *  @typedef Route
 *  @property {RegExp} url
 *  @property {'GET' | 'POST'} method
 *  @property {(matches: string[], body: Object.<string,*> | undefined)=> Promise<APIResponse>} callback
 */

// (values: Object

const fs = require('fs')

const DB_JSON_FILE_NAME = 'database.json'

/** @returns {Promise<Post[]>} */
async function getPosts() {
  const json = await fs.promises.readFile(DB_JSON_FILE_NAME, 'utf-8')
  return JSON.parse(json).posts
}

/**
 * @param {Post[] posts}
 */
async function savePosts(posts) {
  const content = {
    posts,
  }
  return fs.promises.writeFile(
    DB_JSON_FILE_NAME,
    JSON.stringify(content),
    'utf-8'
  )
}

/** @type {Route[]} */
const routes = [
  {
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      // Todo : implelemetn
      statusCode: 200,
      body: await getPosts(),
    }),
  },

  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/, // Todo: regexp로 고치기
    method: 'GET',
    callback: async (matches) => {
      const postId = matches[1]

      if (!postId) {
        return {
          statusCode: 404,
          body: 'Not found',
        }
      }
      const posts = await getPosts()
      const post = posts.find((_post) => _post.id === postId)

      if (!post) {
        return {
          statusCode: 404,
          body: 'Not found',
        }
      }

      return {
        statusCode: 200,
        body: post,
      }
    },
  },
  {
    url: /^\/posts$/, // Todo: regexp로 고치기
    method: 'POST',
    callback: async (_, body) => {
      if (!body) {
        return {
          statusCode: 400,
          body: 'ill-forme request',
        }
      }

      /** @type {string} */
      /* eslint-disable-next-line prefer-destructuring */
      const title = body.title
      const newPost = {
        id: title.replace(/\s/g, '_'),
        title,
        content: body.content,
      }
      const posts = await getPosts()

      posts.push(newPost)
      savePosts(posts)

      return {
        statusCode: 200,
        body: newPost,
      }
    },
  },
]

module.exports = {
  routes,
}
// 자바스크립트에서는 각 파일이 모듈이다!
