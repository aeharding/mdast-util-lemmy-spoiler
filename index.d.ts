import type {Data, Parent, BlockContent, DefinitionContent} from 'mdast'

export {spoilerFromMarkdown} from './lib/index.js'

/**
 * Fields shared by spoilers.
 */
interface SpoilerFields {
  /**
   * Spoiler name.
   */
  name: string
}

/**
 * Markdown spoiler.
 */
export interface Spoiler extends Parent, SpoilerFields {
  /**
   * Node type of container spoiler.
   */
  type: 'spoiler'

  /**
   * Children of container spoiler.
   */
  children: Array<BlockContent | DefinitionContent>

  /**
   * Data associated with the mdast container spoiler.
   */
  data?: SpoilerData | undefined
}

/**
 * Info associated with mdast container spoiler nodes by the ecosystem.
 */
export interface SpoilerData extends Data {}

// Add custom data tracked to turn a syntax tree into markdown.
declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    /**
     * Whole container spoiler.
     *
     * ```markdown
     * > | :::a
     *     ^^^^
     * > | :::
     *     ^^^
     * ```
     */
    spoiler: 'spoiler'
  }
}

// Add nodes to content, register `data` on paragraph.
declare module 'mdast' {
  interface BlockContentMap {
    /**
     * Spoiler in flow content (such as in the root document, or block
     * quotes), which contains further flow content.
     */
    spoiler: Spoiler
  }

  interface RootContentMap {
    /**
     * Spoiler in flow content (such as in the root document, or block
     * quotes), which contains further flow content.
     */
    spoiler: Spoiler
  }
}
