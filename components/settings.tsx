import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { AlignRightIcon, Github } from 'lucide-react'
import { RefObject } from 'react'
import { Button } from './ui/button'

export function Settings({
  optimize,
  setOptimize,
  tidy,
  setTidy,
  inputRef,
  textareaRef,
  disabled,
}: {
  optimize: boolean | undefined
  setOptimize: (checked: boolean) => void
  tidy: boolean | undefined
  disabled?: boolean
  setTidy: (checked: boolean) => void
  inputRef?: RefObject<HTMLInputElement>
  textareaRef?: RefObject<HTMLTextAreaElement>
}) {
  return (
    <Card className="min-w-80 shadow-2xl">
      <Collapsible defaultOpen>
        <CardHeader className="mt-0 flex-row items-start justify-between gap-4 space-y-0">
          <Button size="icon" variant="ghost" asChild>
            <a
              href="https://github.com/elrumordelaluz/svgsprit.es"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <div className="text-center">
            <h1 className="font-bold">svgsprit.es</h1>
            <p className="text-xs">SVG Sprites Generator</p>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              <AlignRightIcon className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between space-x-4">
              <Label htmlFor="tidy" className="flex flex-col space-y-1">
                <span>Tidy</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Pretty output code
                </span>
              </Label>
              <Switch id="tidy" checked={tidy} onCheckedChange={setTidy} />
            </div>
            <div className="flex items-center justify-between space-x-4">
              <Label htmlFor="optimize" className="flex flex-col space-y-1">
                <span>Optimize</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Optimize output using{' '}
                  <a
                    href="https://github.com/svg/svgo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    svgo
                  </a>
                </span>
              </Label>
              <Switch
                id="optimize"
                checked={optimize}
                onCheckedChange={setOptimize}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="classname">Class Name</Label>
              <Input
                type="classname"
                id="classname"
                placeholder="icon-class"
                ref={inputRef}
                defaultValue="icon"
                disabled={disabled}
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="styles">Custom styles</Label>
              <Textarea
                placeholder="width:25px;"
                id="styles"
                ref={textareaRef}
                className="min-h-24"
                defaultValue={`width: 50px; 
height: 50px;
margin: .5em;`}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
