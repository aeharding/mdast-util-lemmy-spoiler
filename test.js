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
      fromMarkdown('::: spoiler hi\nd', {
        extensions: [spoiler()],
        mdastExtensions: [spoilerFromMarkdown()]
      }).children[0],
      {
        type: 'spoiler',
        name: 'hi',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'd',
                position: {
                  start: {line: 2, column: 1, offset: 15},
                  end: {line: 2, column: 2, offset: 16}
                }
              }
            ],
            position: {
              start: {line: 2, column: 1, offset: 15},
              end: {line: 2, column: 2, offset: 16}
            }
          }
        ],
        position: {
          start: {line: 1, column: 1, offset: 0},
          end: {line: 2, column: 2, offset: 16}
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
          type: 'spoiler',
          name: 'first spoiler',
          children: [
            {
              type: 'spoiler',
              name: 'second spoiler',
              children: []
            }
          ]
        }
      ]
    })
  })
})
