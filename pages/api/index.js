const svgSpreact = require('svg-spreact')

const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok!')
  }
  const { input, names, tidy, optimize, className } = await req.body
  if (input) {
    try {
      const sprite = await svgSpreact(input, {
        ...(tidy ? { tidy: tidy === 'false' ? false : true } : {}),
        ...(optimize ? { optimize: optimize === 'false' ? false : true } : {}),
        ...(names ? { processId: (n) => names[n] || `Icon_${n}` } : {}),
        ...(className ? { className } : {}),
      })
      res.status(200).send(sprite)
    } catch (err) {
      return res.status(400).send(`Error: ${err}`)
    }
  } else {
    return res
      .status(200)
      .send(
        '<p style="display:flex;align-items:center;justify-content:center;height:100vh;"><a style="text-decoration:none;color:inherit;font-family:sans-serif;" href="https://svgsprit.es">visit svgsprit.es</a></p>'
      )
  }
}

module.exports = allowCors(handler)
