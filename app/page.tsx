'use client'

import { Info } from '@/components/info'
import { Settings } from '@/components/settings'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ClipboardCheckIcon,
  ClipboardIcon,
  CodeIcon,
  Codepen,
  Download,
  ImageDown,
  Loader,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import logo from './icon.svg'

export default function Home() {
  const constraintsRef = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const hasCopiedRefs =
    Boolean(copiedText) && copiedText?.includes('use xlink:href')
  const hasCopiedDefs =
    Boolean(copiedText) && !copiedText?.includes('use xlink:href')
  const [open, setOpen] = useState(false)
  const [optimize, setOptimize] = useState(true)
  const [tidy, setTidy] = useState(true)
  const [{ output, loading, error, copied }, dispatch] = useReducer(
    reducer,
    initialState
  )

  async function processInput(
    input: (string | ArrayBuffer | null | undefined)[],
    names: string[]
  ) {
    dispatch({ type: 'processing-launch' })
    const data = {
      input,
      tidy,
      optimize,
      names,
      className: inputRef.current?.value,
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const payload = await res.json()

      dispatch({ type: 'processing-success', payload })
    } catch (err) {
      dispatch({ type: 'processing-fail' })
    }
  }

  const onDrop = useCallback(
    (files: string | any[]) => {
      let svgs: (string | ArrayBuffer | null | undefined)[] = []
      let names: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')
        reader.onload = ({ target }) => {
          svgs.push(target?.result)
          names.push(file.name.replace('.svg', ''))

          if (i === files.length - 1) {
            processInput(svgs, names)
          }
        }
      }
    },
    [tidy, optimize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  useEffect(() => {
    if (output) {
      setOpen(true)
    }
  }, [output])

  function downloadDemo() {
    if (output && !loading && !error) {
      const element = document.createElement('a')
      const { refs, defs } = output
      const html = template({
        defs,
        refs,
        style: textareaRef?.current?.value,
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
      css:
        inputRef?.current?.value !== ''
          ? `.${inputRef?.current?.value} { 
  ${textareaRef?.current?.value} 
}`
          : '',
      css_starter: 'normalize',
    })
  }

  const penValue = output && !loading && !error ? prefillPen() : ''

  return (
    <motion.main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      ref={constraintsRef}
    >
      <div {...getRootProps()}>
        <Info />
        <input {...getInputProps()} />
        <Image src={logo} alt="Svgprit.es" className="logo" fill />
      </div>

      <motion.div
        drag
        dragConstraints={constraintsRef}
        className="fixed left-4 top-4"
      >
        <Settings
          optimize={optimize}
          setOptimize={setOptimize}
          tidy={tidy}
          setTidy={setTidy}
          inputRef={inputRef}
          textareaRef={textareaRef}
          disabled={output}
        />
      </motion.div>
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/80"
          >
            <Loader className="animate-spin text-white" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {output ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => dispatch({ type: 'reset' })}
                className="absolute top-4 right-4"
              >
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
      <Drawer open={open} onOpenChange={setOpen}>
        {output ? (
          <DrawerTrigger className="absolute bottom-4 right-4" asChild>
            <Button variant="ghost" size="icon">
              <CodeIcon />
            </Button>
          </DrawerTrigger>
        ) : null}
        <DrawerContent className="max-h-[calc(100vh-200px)]">
          <DrawerHeader className="flex justify-between pt-0">
            <div>
              <DrawerTitle className="text-left">SVG Sprite result</DrawerTitle>
              <DrawerDescription>
                Now you can use your icons as SVG Sprite
              </DrawerDescription>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={downloadDemo} variant="ghost" size="icon">
                      <Download />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download Demo</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={downloadSprite}
                      variant="ghost"
                      size="icon"
                    >
                      <ImageDown />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download Sprite</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <form
                      action="https://codepen.io/pen/define"
                      method="POST"
                      target="_blank"
                      className="inline-block"
                    >
                      <input type="hidden" name="data" value={penValue} />
                      <Button variant="ghost" size="icon" type="submit">
                        <Codepen />
                      </Button>
                    </form>
                  </TooltipTrigger>
                  <TooltipContent>Open result in Codepen</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DrawerHeader>
          <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2">
            <div className="relative h-48 w-full md:h-96">
              <Button
                className="absolute right-2 top-4 h-8 w-8"
                onClick={() => copyToClipboard(output?.defs)}
                size="icon"
              >
                {hasCopiedDefs ? (
                  <ClipboardCheckIcon className="h-4 w-4" />
                ) : (
                  <ClipboardIcon className="h-4 w-4" />
                )}
              </Button>
              <SyntaxHighlighter
                style={oneDark}
                className="max-h-full w-full overflow-y-auto"
                language="html"
                wrapLines
              >
                {output?.defs}
              </SyntaxHighlighter>
            </div>
            <div className="relative h-48 w-full md:h-96">
              <Button
                className="absolute right-2 top-4 h-8 w-8"
                onClick={() => copyToClipboard(output?.refs)}
                size="icon"
              >
                {hasCopiedRefs ? (
                  <ClipboardCheckIcon className="h-4 w-4" />
                ) : (
                  <ClipboardIcon className="h-4 w-4" />
                )}
              </Button>
              <SyntaxHighlighter
                style={oneDark}
                className="max-h-full overflow-y-auto"
                language="html"
              >
                {output?.refs}
              </SyntaxHighlighter>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </motion.main>
  )
}

const initialState = {
  output: null,
  loading: false,
  error: false,
  copied: false,
}

function reducer(state: any, action: { type: string; payload?: any }) {
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

const template = ({
  defs,
  refs,
  style,
}: {
  defs?: string
  refs?: string
  style?: string
}) => `
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
  title: 'Svgsprit.es',
  description: 'SVG Sprite created with svgsprit.es (https://svgsprit.es)',
  tags: ['svg', 'svg-sprite', 'svgson', 'svg-spreact'],
  editors: '1100',
}
