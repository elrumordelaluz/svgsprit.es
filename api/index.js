const svgSpreact = require('svg-spreact')

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.send('ok!')
  }
  const { input, names, tidy, optimize, className } = await req.body
  if (input) {
    try {
      return await svgSpreact(input, {
        ...(tidy ? { tidy: tidy === 'false' ? false : true } : {}),
        ...(optimize ? { optimize: optimize === 'false' ? false : true } : {}),
        ...(names ? { processId: (n) => names[n] || `Icon_${n}` } : {}),
        ...(className ? { className } : {}),
      })
    } catch (err) {
      return res.send(`Error: ${err}`)
    }
  } else {
    return res.send(
      '<p style="display:flex;align-items:center;justify-content:center;height:100vh;"><a style="text-decoration:none;color:inherit;font-family:sans-serif;" href="https://elrumordelaluz.github.io/micro-svg-spreact/">visit svg-spreact</a></p>'
    )
  }
}
