// @ts-check

// 프레임워크 없이 간단한 토이프로젝트 웹서버 만들어보기

/**
 *  블로그 포스팅 서비스
 *  글을 올려주고 글을 보여주고 하는 서비스
 *  로컬파일을 데이터베이스로 활용할 예정 (JSON)
 *  인증 로직은 넣지 않습니다.
 *  RESTful API를 사용
 *
 * */

const http = require('http')
const { routes } = require('./api')

const server = http.createServer((req, res) => {
  async function main() {
    const route = routes.find(
      (_route) =>
        req.url &&
        req.method &&
        _route.url.test(req.url) &&
        _route.method === req.method
    )

    if (!req.url || !route) {
      res.statusCode = 404
      res.end('not found')
      return
    }
    // 이러면 뒤에 무조건 route가 존재하는것!

    const regexResult = route.url.exec(req.url)

    if (!regexResult) {
      res.statusCode = 404
      res.end('not found')
      return
    }

    /** @type {Object.<string,*> | undefined} */
    const reqbody =
      (req.headers['content-type'] === 'application/json' &&
        (await new Promise((resolve, reject) => {
          req.setEncoding('utf-8')
          req.on('data', (data) => {
            try {
              resolve(JSON.parse(data))
            } catch {
              reject(new Error('ill-formed json'))
            }
          })
        }))) ||
      undefined

    const result = await route.callback(regexResult, reqbody)
    res.statusCode = result.statusCode

    if (typeof result.body === 'string') {
      res.end(result.body)
    } else {
      res.setHeader('Content-type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(result.body))
    }
  }
  main()
})

const PORT = 4000

server.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log('server is running')
})
