/**
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').Paragraph} Paragraph
 *
 * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-from-markdown').Token} Token
 *
 * @typedef {import('mdast-util-to-markdown').ConstructName} ConstructName
 * @typedef {import('mdast-util-to-markdown').State} State
 *
 * @typedef {import('../index.js').Details} Details
 * @typedef {import('../index.js').Summary} Summary
 */

/**
 * Create an extension for `mdast-util-from-markdown` to enable spoilers in
 * markdown.
 *
 * @returns {FromMarkdownExtension}
 *   Extension for `mdast-util-from-markdown` to enable spoilers.
 */
export function spoilerFromMarkdown() {
  return {
    enter: {
      spoiler: enterSpoiler,
      spoilerName: enterName
    },
    exit: {
      spoiler: exit,
      spoilerName: exitName
    }
  }
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function enterSpoiler(token) {
  enter.call(this, 'details', token)
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function enterName(token) {
  enter.call(this, 'summary', token)
}

/**
 * @this {CompileContext}
 * @param {Details['type'] | Summary['type']} type
 * @param {Token} token
 */
function enter(type, token) {
  this.enter(
    {
      type,
      children: [],
      data: {
        hName: type
      }
    },
    token
  )
}

/**
 * @this {CompileContext}
 * @param {Token} token
 */
function exitName(token) {
  this.exit(token)
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exit(token) {
  this.exit(token)
}
