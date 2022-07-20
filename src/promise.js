// @ts-check

const fs = require('fs')

/* eslint-disable no-new */
/* eslint-disable no-console */

async function main() {
  try {
    const result = await fs.promises.readFile('.gitignore', 'utf-8')
    console.log(result)
  } catch (err) {
    console.log(err)
  }
}
main()
