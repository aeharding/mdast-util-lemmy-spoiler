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
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').State} State
 *
 * @typedef {import('../index.js').Directives} Directives
 */

import {ok as assert} from 'devlop'
import {visitParents} from 'unist-util-visit-parents'

/**
 * Create an extension for `mdast-util-from-markdown` to enable directives in
 * markdown.
 *
 * @returns {FromMarkdownExtension}
 *   Extension for `mdast-util-from-markdown` to enable directives.
 */
export function directiveFromMarkdown() {
  return {
    enter: {
      directiveContainer: enterContainer
    },
    exit: {
      directiveContainer: exit,
      directiveContainerName: exitName
    }
  }
}

/**
 * Create an extension for `mdast-util-to-markdown` to enable directives in
 * markdown.
 *
 * @returns {ToMarkdownExtension}
 *   Extension for `mdast-util-to-markdown` to enable directives.
 */
export function directiveToMarkdown() {
  return {
    unsafe: [
      {
        before: '[^:]',
        character: ':',
        after: '[A-Za-z]',
        inConstruct: ['phrasing']
      },
      {atBreak: true, character: ':', after: ':'}
    ],
    handlers: {
      containerDirective: handleDirective
    }
  }
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function enterContainer(token) {
  enter.call(this, 'containerDirective', token)
}

/**
 * @this {CompileContext}
 * @param {Directives['type']} type
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
  assert(node.type === 'containerDirective')
  node.name = this.sliceSerialize(token)
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exit(token) {
  this.exit(token)
}

/**
 * @type {ToMarkdownHandle}
 * @param {Directives} node
 */
function handleDirective(node, _, state, info) {
  const tracker = state.createTracker(info)
  const sequence = fence(node)
  const exit = state.enter(node.type)
  let value = tracker.move(sequence + (node.name || ''))

  if (node.type === 'containerDirective') {
    const shallow = node

    if (shallow && shallow.children && shallow.children.length > 0) {
      value += tracker.move('\n')
      value += tracker.move(state.containerFlow(shallow, tracker.current()))
    }

    value += tracker.move('\n' + sequence)
  }

  exit()
  return value
}

/**
 * @param {Directives} node
 * @returns {string}
 */
function fence(node) {
  let size = 0

  if (node.type === 'containerDirective') {
    visitParents(node, function (node, parents) {
      if (node.type === 'containerDirective') {
        let index = parents.length
        let nesting = 0

        while (index--) {
          if (parents[index].type === 'containerDirective') {
            nesting++
          }
        }

        if (nesting > size) size = nesting
      }
    })
    size += 3
  }

  return ':'.repeat(size)
}
