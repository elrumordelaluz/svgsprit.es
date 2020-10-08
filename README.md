<p align="center">
  <a href="https://elrumordelaluz.github.io/micro-svg-spreact/"><img alt="SVG Spreact" title="SVG Spreact" src="https://camo.githubusercontent.com/faf6e2edc6037845c56e7b1f5c9fd5c7fcdecdad/68747470733a2f2f63646e2e7261776769742e636f6d2f656c72756d6f7264656c616c757a2f7376672d737072656163742f32623538313138622f6c6f676f2e737667" width="250"></a>
</p>

<p align="center">
  Public endpoint to generate <code>SVG</code> Sprites using <a href="https://github.com/elrumordelaluz/svgsprit.es">svgsprit.es</a>
</p>

<p align="center">
  <img alt="SVG Spreact demo" title="SVG Spreact demo" src="https://cdn.rawgit.com/elrumordelaluz/micro-svg-spreact/fc53c585/demo.gif" width="450">
</p>

<p align="center">  
  https://svgsprit.es
</p>

## Endpoint

`POST` https://svgsprit.es/api

## Params

- `input` <small>[ required ]</small> `string` with _Icons_ to create the _Sprite_
- `tidy` <small>[ optional ]</small> `boolean` (default: `true`)
- `optimized` <small>[ optional ]</small> `boolean` (default: `true`)
- `names` <small>[ optional ]</small> `array` use name for each `id` (defaul: `Icon_${n}`)
- `className` <small>[ optional ]</small> `string` class to add on each `<use>` element

## Related

[svg-spreact](https://github.com/elrumordelaluz/svg-spreact) Main Package

[svg-spreact-cli](https://github.com/elrumordelaluz/svg-spreact-cli) CLI version
