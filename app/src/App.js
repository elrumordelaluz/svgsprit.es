import React, { Component, Fragment } from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import qs from 'qs'
import './styles.css'
import githubLogo from './github.svg'
import Clipboard from 'clipboard'

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://micro-svg-spreact.now.sh/'

const initialFileName = 'svg'

class App extends Component {
  state = {
    output: null,
    loading: false,
    copied: false,
    error: false,
    optimize: true,
    tidy: true,
  }

  componentDidMount() {
    this.clipboard = new Clipboard('.copyButton')
    this.clipboard.on('success', e => {
      this.setState({ copied: true })
      e.clearSelection()
    })
    this.outputName = initialFileName
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
    const data = qs.stringify({ input, tidy, optimize, names })
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

  download = () => {
    const { output, loading, error } = this.state
    if (output && !loading && !error) {
      const element = document.createElement('a')
      const file = new Blob([output], {
        type: 'image/svg+xml',
      })
      const fileURL = URL.createObjectURL(file)
      element.href = fileURL
      element.download = `${this.outputName}__outlined.svg`
      element.click()
      // window.open(fileURL)
      window.URL.revokeObjectURL(fileURL)
    }
  }

  render() {
    const { output, loading, copied, error, optimize, tidy } = this.state
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
                data-clipboard-target="#foo">
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button className="button" onClick={this.download}>
                Download
              </button>
              <button className="button" onClick={this.resetOutput}>
                ✕
              </button>
            </div>
            <code id="foo">
              {output && output.defs}
              {output && output.refs}
            </code>
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
        </p>
      </Fragment>
    )
  }
}

export default App
