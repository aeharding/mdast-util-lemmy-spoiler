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
 * @typedef {import('../index.js').Spoiler} Spoiler
 */

import {ok as assert} from 'devlop'

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
      spoiler: enterSpoiler
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
  enter.call(this, 'spoiler', token)
}

/**
 * @this {CompileContext}
 * @param {Spoiler['type']} type
 * @param {Token} token
 */
function enter(type, token) {
  this.enter({type, name: '', children: []}, token)
}

/**
 * @this {CompileContext}
 * @param {Token} token
 */
function exitName(token) {
  const node = this.stack[this.stack.length - 1]
  assert(node.type === 'spoiler')
  node.name = this.sliceSerialize(token)
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exit(token) {
  this.exit(token)
}
