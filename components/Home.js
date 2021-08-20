import React, {
  useCallback,
  useReducer,
  useRef,
  useEffect,
  useState,
} from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import Clipboard from 'clipboard'
import githubLogo from './github.svg'
import codepenLogo from './codepen.svg'
import logo from './logo.svg'

const url =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : 'https://svg-spreact.vercel.app/api'

const template = ({ defs, refs, style }) => `
  <!doctype>
  <html lang="en">
  <head>
    <title>SVG Sprite</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="UTF-8" />
    <style>
      html { box-sizing: border-box }
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto",
          "Oxygen","Ubuntu","Cantarell","Fira Sans",
          "Droid Sans","Helvetical Neue",sans-serif;
        font-size: 1.125rem;
        text-align: center
      }
      h1{
        font-weight: 100;
        margin-bottom: 1em
      }
      small { font-size: .34em }
      ${style}
    </style>
  </head>
    
  <body>
    <!-- SVG Sprite -->
    ${defs}
    <h1>
      SVG Sprite Demo
      <br/>
      <small>
        created with <a href="https://svgsprit.es/">svgsprit.es</a>
      </small>
    </h1>
    ${refs}
  </body>
`

const penSettings = {
  title: 'SVG Spreact',
  description: 'SVG Sprite created with svgsprit.es (https://svgsprit.es)',
  tags: ['svg', 'svg-sprite', 'svgson', 'svg-spreact'],
  editors: '1100',
}

const initialState = {
  output: null,
  loading: false,
  error: false,
  copied: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'processing-launch':
      return { ...state, loading: true, copied: false, error: false }
    case 'processing-success':
      return { ...state, output: action.payload, loading: false }
    case 'processing-fail':
      return {
        ...state,
        loading: false,
        output: null,
        error: true,
      }
    case 'copy':
      return { ...state, copied: true }
    case 'reset':
      return initialState
    default:
      throw new Error()
  }
}

function App() {
  const [{ output, loading, error, copied }, dispatch] = useReducer(
    reducer,
    initialState
  )
  const [optimize, setOptimize] = useState(true)
  const [tidy, setTidy] = useState(true)

  const cname = useRef(null)
  const style = useRef(null)

  useEffect(() => {
    let clipboard = new Clipboard('.copyButton')
    clipboard.on('success', (e) => {
      dispatch({ type: 'copy' })
      e.clearSelection()
    })
  }, [])

  const onDrop = useCallback(
    (files) => {
      let svgs = []
      let names = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = ({ target }) => {
          svgs.push(target.result)
          names.push(file.name.replace('.svg', ''))

          if (i === files.length - 1) {
            processInput(svgs, names)
          }
        }
      }
    },
    [tidy, optimize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  async function processInput(input, names) {
    dispatch({ type: 'processing-launch' })
    const data = {
      input,
      tidy,
      optimize,
      names,
      className: cname.current?.value,
    }

    try {
      const res = await axios({
        url,
        method: 'post',
        data,
      })
      dispatch({ type: 'processing-success', payload: res.data })
    } catch (err) {
      dispatch({ type: 'processing-fail' })
    }
  }

  function downloadDemo() {
    if (output && !loading && !error) {
      const element = document.createElement('a')
      const { refs, defs } = output
      const html = template({
        defs,
        refs,
        style: style.current.value,
      })
      const file = new Blob([html], {
        type: 'text/html',
      })
      const fileURL = window.URL.createObjectURL(file)
      element.setAttribute('href', fileURL)
      element.setAttribute('download', `demo.html`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      window.URL.revokeObjectURL(fileURL)
    }
  }

  function downloadSprite() {
    if (output && !loading && !error) {
      const element = document.createElement('a')
      const { defs } = output
      const file = new Blob([defs], {
        type: 'image/svg+xml',
      })
      const fileURL = URL.createObjectURL(file)
      element.href = fileURL
      element.download = `sprite.svg`
      element.click()
      window.URL.revokeObjectURL(fileURL)
    }
  }

  function prefillPen() {
    const { defs, refs } = output
    return JSON.stringify({
      ...penSettings,
      html: `<!-- SVG Sprite -->
${defs}
<!-- SVG References -->
${refs}`,
      css: style.current?.value,
      css_starter: 'normalize',
    })
  }

  const penValue = output && !loading && !error ? prefillPen() : ''
  return (
    <>
      <div
        {...getRootProps()}
        className={`wrapper ${loading ? 'loading' : ''}`}
      >
        <input {...getInputProps()} />

        <p className="message">Drop SVG files to create the Sprite</p>
        {error && (
          <span className="error">
            An error was verified during your last svg processed
          </span>
        )}

        <Image src={logo} alt="Svgprit.es" className="logo" layout="fill" />
      </div>

      <div
        key="output"
        className={`output ${output && !loading ? 'show' : ''}`}
      >
        <pre className="code">
          <div className="controls">
            <button className="button copyButton" data-clipboard-target="#defs">
              {copied ? 'Sprite Copied' : 'Copy Sprite'}
            </button>
            <button className="button copyButton" data-clipboard-target="#refs">
              {copied ? 'Refs Copied' : 'Copy Refs'}
            </button>
            <button className="button" onClick={downloadDemo}>
              Download Demo
            </button>
            <button className="button" onClick={downloadSprite}>
              Download Sprite
            </button>

            <form
              action="https://codepen.io/pen/define"
              method="POST"
              target="_blank"
              className="codepen_form"
            >
              <input type="hidden" name="data" value={penValue} />
              <button className="codepen_btn">
                <Image src={codepenLogo} alt="Codepen" />
                {/* <img
                  src={codepenLogo}
                  className="codepen_logo"
                  alt="codepen logo"
                /> */}
              </button>
            </form>
            <button
              className="button"
              onClick={() => dispatch({ type: 'reset' })}
            >
              ✕
            </button>
          </div>
          <code id="defs">{output && output.defs}</code>
          <code id="refs">{output && output.refs}</code>
        </pre>
      </div>
      <a
        key="github"
        href="https://github.com/elrumordelaluz/svgsprit.es"
        className="github github_logo"
      >
        <Image src={githubLogo} alt="GitHub" />
      </a>
      <p className={`settings${loading ? ' loading' : ''}`}>
        <label>
          tidy{' '}
          <input
            type="checkbox"
            checked={tidy}
            onChange={() => setTidy((t) => !t)}
          />
        </label>
        <label>
          optimize{' '}
          <input
            type="checkbox"
            checked={optimize}
            onChange={() => setOptimize((o) => !o)}
          />
        </label>
        <label>
          class <input ref={cname} type="text" defaultValue="icon" />
        </label>
        <label>
          style{' '}
          <textarea
            ref={style}
            rows="5"
            defaultValue={`.icon { 
  width: 50px; 
  height: 50px;
  margin: .5em;
}`}
          />
        </label>
      </p>
    </>
  )
}

export default App
