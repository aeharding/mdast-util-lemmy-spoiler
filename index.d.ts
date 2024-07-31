import type {Data, Parent} from 'mdast'

export {spoilerFromMarkdown} from './lib/index.js'

export interface Details extends Parent {
  /**
   * Node type of container spoiler.
   */
  type: 'details'
}

export interface Summary extends Parent {
  /**
   * Node type of container spoiler.
   */
  type: 'summary'
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
    details: 'details'
    summary: 'summary'
  }
}

// Add nodes to content, register `data` on paragraph.
declare module 'mdast' {
  interface BlockContentMap {
    /**
     * Spoiler in flow content (such as in the root document, or block
     * quotes), which contains further flow content.
     */
    details: Details
    summary: Summary
  }

  interface RootContentMap {
    /**
     * Spoiler in flow content (such as in the root document, or block
     * quotes), which contains further flow content.
     */
    details: Details
    summary: Summary
  }
}
