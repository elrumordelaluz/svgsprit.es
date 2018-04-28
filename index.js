const { send, json } = require('micro')
const cors = require('micro-cors')()
const svgSpreact = require('svg-spreact')
const parse = require('urlencoded-body-parser')

const handler = async (req, res) => {
  const { input, ...rest } = await parse(req)
  if (input) {
    try {
      return await svgSpreact(input, rest)
    } catch (err) {
      return send(res, 400, `Error: ${err}`)
    }
  } else {
    return send(res, 400, '"input" field is required')
  }
}

module.exports = cors(handler)
