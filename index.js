const { send, json } = require('micro')
const cors = require('micro-cors')()
const svgSpreact = require('svg-spreact')

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 200, 'ok!')
  }
  const { input, names, tidy, optimize, className } = await json(req)
  if (input) {
    try {
      return await svgSpreact(input, {
        ...(tidy ? { tidy: tidy === 'false' ? false : true } : {}),
        ...(optimize ? { optimize: optimize === 'false' ? false : true } : {}),
        ...(names ? { processId: n => names[n] || `Icon_${n}` } : {}),
        ...(className ? { className } : {}),
      })
    } catch (err) {
      return send(res, 400, `Error: ${err}`)
    }
  } else {
    return send(
      res,
      200,
      '<p style="display:flex;align-items:center;justify-content:center;height:100vh;"><a style="text-decoration:none;color:inherit;font-family:sans-serif;" href="https://elrumordelaluz.github.io/micro-svg-spreact/">visit svg-spreact</a></p>'
    )
  }
}

module.exports = cors(handler)
