import svgSpreact from "svg-spreact"

export async function POST(req: Request) {
  const { input, names, tidy, optimize, className } = await req.json()

  if (input) {
    try {
      const sprite = await svgSpreact(input, {
        ...(tidy ? { tidy: tidy === "false" ? false : true } : {}),
        ...(optimize ? { optimize: optimize === "false" ? false : true } : {}),
        ...(names ? { processId: (n: number) => names[n] || `Icon_${n}` } : {}),
        ...(className ? { className } : {}),
      })

      return new Response(JSON.stringify(sprite), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      })
    } catch (err) {
      return new Response(`Error: ${err}`, {
        status: 400,
      })
    }
  } else {
    return new Response(
      '<p style="display:flex;align-items:center;justify-content:center;height:100vh;"><a style="text-decoration:none;color:inherit;font-family:sans-serif;" href="https://svgsprit.es">visit svgsprit.es</a></p>',
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  }
}
