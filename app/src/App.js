import React, { Component, Fragment, createRef } from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import qs from 'qs'
import './styles.css'
import githubLogo from './github.svg'
import codepenLogo from './codepen.svg'
import Clipboard from 'clipboard'

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://micro-svg-spreact.now.sh/'

const template = ({ defs, refs, style }) => `
  <!doctype>
  <html lang="en">
  <head>
    <title>SVG Sprite</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="UTF-8" />
    <style>
      html {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto",
          "Oxygen","Ubuntu","Cantarell","Fira Sans",
          "Droid Sans","Helvetical Neue",sans-serif;
        font-size: 1.125rem;
        text-align: center;
      }
      h1 {
        font-weight: 100;
        margin-bottom: 1em;
      }
      ${style}
    </style>
  </head>
    
  <body>
    <!-- SVG Sprite -->
    ${defs}
    <h1>SVG Sprite Demo</h1>
    ${refs}
  </body>
`

const penSettings = {
  title: 'SVG Sprite',
  description: 'Created with svg-spreact',
  tags: ['svg', 'svg-sprite', 'svgson', 'svg-spreact'],
  editors: '1100',
}

class App extends Component {
  state = {
    output: null,
    loading: false,
    copied: false,
    error: false,
    optimize: true,
    tidy: true,
  }

  cname = createRef()
  style = createRef()

  componentDidMount() {
    this.clipboard = new Clipboard('.copyButton')
    this.clipboard.on('success', e => {
      this.setState({ copied: true })
      e.clearSelection()
    })
  }

  onDrop = files => {
    let svgs = []
    const names = files.map(file => file.name.replace('.svg', ''))
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = ({ target }) => {
        svgs.push(target.result)
        if (i === files.length - 1) {
          this.processInput(svgs.join(), names)
        }
      }
    }
  }

  processInput = (input, names) => {
    const { optimize, tidy } = this.state
    this.setState({ loading: true, copied: false, error: false })
    const data = qs.stringify({
      input,
      tidy,
      optimize,
      names,
      className: this.cname.current.value,
    })
    axios({
      url,
      method: 'post',
      data,
    })
      .then(res => this.setState({ output: res.data, loading: false }))
      .catch(e => {
        this.setState({
          loading: false,
          output: null,
          error: true,
        })
      })
  }

  resetOutput = () => this.setState({ output: null, copied: false })

  handleOptimized = () => {
    this.setState(prevState => ({
      optimize: !prevState.optimize,
    }))
  }

  handleTidy = () => {
    this.setState(prevState => ({
      tidy: !prevState.tidy,
    }))
  }

  downloadDemo = () => {
    const { output, loading, error } = this.state
    if (output && !loading && !error) {
      const element = document.createElement('a')
      const { refs, defs } = output
      const html = template({ defs, refs, style: this.style.current.value })
      const file = new Blob([html], {
        type: 'text/html',
      })
      const fileURL = URL.createObjectURL(file)
      element.href = fileURL
      element.download = `demo.html`
      element.click()
      window.URL.revokeObjectURL(fileURL)
    }
  }

  downloadSprite = () => {
    const { output, loading, error } = this.state
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

  prefillPen = () => {
    const { output: { defs, refs } } = this.state
    return JSON.stringify({
      ...penSettings,
      html: `<!-- SVG Sprite -->
${defs}
<!-- SVG References -->
${refs}`,
      css: this.style.current.value,
      css_starter: 'normalize',
    })
  }

  render() {
    const { output, loading, copied, error, optimize, tidy } = this.state
    const penValue = output && !loading && !error ? this.prefillPen() : ''

    return (
      <Fragment>
        <Dropzone
          key="dropzone"
          accept="image/svg+xml"
          disabled={loading}
          multiple={true}
          onDropAccepted={this.onDrop}
          className={`wrapper ${loading ? 'loading' : ''}`}
          activeClassName="wrapper__active"
          rejectClassName="wrapper__reject">
          <p className="message">Drop SVG files to create the Sprite</p>
          {error && (
            <span className="error">
              An error was verified during your last svg processed
            </span>
          )}
          <img
            src="https://camo.githubusercontent.com/faf6e2edc6037845c56e7b1f5c9fd5c7fcdecdad/68747470733a2f2f63646e2e7261776769742e636f6d2f656c72756d6f7264656c616c757a2f7376672d737072656163742f32623538313138622f6c6f676f2e737667"
            className="logo"
            alt="logo"
          />
        </Dropzone>
        <div
          key="output"
          className={`output ${output && !loading ? 'show' : ''}`}>
          <pre className="code">
            <div className="controls">
              <button
                className="button copyButton"
                data-clipboard-target="#defs">
                {copied ? 'Sprite Copied' : 'Copy Sprite'}
              </button>
              <button
                className="button copyButton"
                data-clipboard-target="#refs">
                {copied ? 'Refs Copied' : 'Copy Refs'}
              </button>
              <button className="button" onClick={this.downloadDemo}>
                Download Demo
              </button>
              <button className="button" onClick={this.downloadSprite}>
                Download Sprite
              </button>

              <form
                action="https://codepen.io/pen/define"
                method="POST"
                target="_blank"
                className="codepen_form">
                <input type="hidden" name="data" value={penValue} />
                <button className="codepen_btn">
                  <img
                    src={codepenLogo}
                    className="codepen_logo"
                    alt="codepen logo"
                  />
                </button>
              </form>
              <button className="button" onClick={this.resetOutput}>
                ✕
              </button>
            </div>
            <code id="defs">{output && output.defs}</code>
            <code id="refs">{output && output.refs}</code>
          </pre>
        </div>
        <a
          key="github"
          href="https://github.com/elrumordelaluz/micro-svg-spreact"
          className="github">
          <img src={githubLogo} className="github_logo" alt="github logo" />
        </a>
        <p className="settings">
          <label>
            tidy{' '}
            <input type="checkbox" checked={tidy} onChange={this.handleTidy} />
          </label>
          <label>
            optimize{' '}
            <input
              type="checkbox"
              checked={optimize}
              onChange={this.handleOptimized}
            />
          </label>
          <label>
            class <input ref={this.cname} type="text" defaultValue="icon" />
          </label>
          <label>
            style{' '}
            <textarea
              ref={this.style}
              rows="5"
              defaultValue={`.icon { 
  width: 50px; 
  height: 50px;
  margin: .5em;
}`}
            />
          </label>
        </p>
      </Fragment>
    )
  }
}

export default App
