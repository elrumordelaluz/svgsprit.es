<p align="center">
  <a href="https://svgsprit.es"><img alt="svgsprit.es" title="svgsprit.es" src="https://raw.githubusercontent.com/elrumordelaluz/svgsprit.es/master/logo.svg" width="250"></a>
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

`POST` https://svgsprit.es/api/generate

## Params

- `input` <small>[ required ]</small> `string` with _Icons_ to create the _Sprite_
- `tidy` <small>[ optional ]</small> `boolean` (default: `true`)
- `optimized` <small>[ optional ]</small> `boolean` (default: `true`)
- `names` <small>[ optional ]</small> `array` use name for each `id` (defaul: `Icon_${n}`)
- `className` <small>[ optional ]</small> `string` class to add on each `<use>` element

## Related

[svg-spreact](https://github.com/elrumordelaluz/svg-spreact) Main Package

[svg-spreact-cli](https://github.com/elrumordelaluz/svg-spreact-cli) CLI version
