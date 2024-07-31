import assert from 'node:assert/strict'
import test from 'node:test'
import {spoiler} from 'micromark-extension-lemmy-spoiler'
import {spoilerFromMarkdown} from 'mdast-util-lemmy-spoiler'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {removePosition} from 'unist-util-remove-position'

test('core', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('mdast-util-lemmy-spoiler')).sort(),
      ['spoilerFromMarkdown']
    )
  })
})

test('spoilerFromMarkdown()', async function (t) {
  await t.test('should support spoilers', async function () {
    assert.deepEqual(
      fromMarkdown('::: spoiler hi **there**\nd', {
        extensions: [spoiler()],
        mdastExtensions: [spoilerFromMarkdown()]
      }).children[0],
      {
        type: 'details',
        children: [
          {
            type: 'summary',
            children: [
              {
                type: 'text',
                value: 'hi ',
                position: {
                  start: {line: 1, column: 13, offset: 12},
                  end: {line: 1, column: 16, offset: 15}
                }
              },
              {
                type: 'strong',
                children: [
                  {
                    type: 'text',
                    value: 'there',
                    position: {
                      start: {line: 1, column: 18, offset: 17},
                      end: {line: 1, column: 23, offset: 22}
                    }
                  }
                ],
                position: {
                  start: {line: 1, column: 16, offset: 15},
                  end: {line: 1, column: 25, offset: 24}
                }
              }
            ],
            data: {hName: 'summary'},
            position: {
              start: {line: 1, column: 13, offset: 12},
              end: {line: 1, column: 25, offset: 24}
            }
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'd',
                position: {
                  start: {line: 2, column: 1, offset: 25},
                  end: {line: 2, column: 2, offset: 26}
                }
              }
            ],
            position: {
              start: {line: 2, column: 1, offset: 25},
              end: {line: 2, column: 2, offset: 26}
            }
          }
        ],
        data: {hName: 'details'},
        position: {
          start: {line: 1, column: 1, offset: 0},
          end: {line: 2, column: 2, offset: 26}
        }
      }
    )
  })

  await t.test('should support spoilers in spoilers', async function () {
    const tree = fromMarkdown(
      '::::spoiler first spoiler\n:::spoiler second spoiler\n:::\n::::',
      {
        extensions: [spoiler()],
        mdastExtensions: [spoilerFromMarkdown()]
      }
    )

    removePosition(tree, {force: true})

    assert.deepEqual(tree, {
      type: 'root',
      children: [
        {
          type: 'details',
          children: [
            {
              type: 'summary',
              children: [{type: 'text', value: 'first spoiler'}],
              data: {hName: 'summary'}
            },
            {
              type: 'details',
              children: [
                {
                  type: 'summary',
                  children: [{type: 'text', value: 'second spoiler'}],
                  data: {hName: 'summary'}
                }
              ],
              data: {hName: 'details'}
            }
          ],
          data: {hName: 'details'}
        }
      ]
    })
  })
})
