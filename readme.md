# mdast-util-lemmy-spoiler

## What is this?

This package contains two extensions that add support for lemmy spoiler
syntax in markdown to mdast.
These extensions plug into
`mdast-util-from-markdown` (to support parsing
spoilers in markdown into a syntax tree) and
`mdast-util-to-markdown` (to support serializing
spoilers in syntax trees to markdown).

## Install

This package is ESM only.
In Node.js (version 16+), install with npm:

```sh
npm install mdast-util-lemmy-spoiler
```

In Deno with `esm.sh`:

```js
import {spoilerFromMarkdown} from 'https://esm.sh/mdast-util-lemmy-spoiler@1'
```

In browsers with `esm.sh`:

```html
<script type="module">
  import {spoilerFromMarkdown} from 'https://esm.sh/mdast-util-lemmy-spoiler@3?bundle'
</script>
```
