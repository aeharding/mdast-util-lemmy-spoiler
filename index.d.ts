import type {Data, Parent, BlockContent, DefinitionContent} from 'mdast'

export {directiveFromMarkdown, directiveToMarkdown} from './lib/index.js'

/**
 * Fields shared by directives.
 */
interface DirectiveFields {
  /**
   * Directive name.
   */
  name: string
}

/**
 * Markdown directive (container form).
 */
export interface ContainerDirective extends Parent, DirectiveFields {
  /**
   * Node type of container directive.
   */
  type: 'containerDirective'

  /**
   * Children of container directive.
   */
  children: Array<BlockContent | DefinitionContent>

  /**
   * Data associated with the mdast container directive.
   */
  data?: ContainerDirectiveData | undefined
}

/**
 * Info associated with mdast container directive nodes by the ecosystem.
 */
export interface ContainerDirectiveData extends Data {}

/**
 * Union of registered mdast directive nodes.
 *
 * It is not possible to register custom mdast directive node types.
 */
export type Directives = ContainerDirective

// Add custom data tracked to turn a syntax tree into markdown.
declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    /**
     * Whole container directive.
     *
     * ```markdown
     * > | :::a
     *     ^^^^
     * > | :::
     *     ^^^
     * ```
     */
    containerDirective: 'containerDirective'
  }
}

// Add nodes to content, register `data` on paragraph.
declare module 'mdast' {
  interface BlockContentMap {
    /**
     * Directive in flow content (such as in the root document, or block
     * quotes), which contains further flow content.
     */
    containerDirective: ContainerDirective
  }

  interface RootContentMap {
    /**
     * Directive in flow content (such as in the root document, or block
     * quotes), which contains further flow content.
     */
    containerDirective: ContainerDirective
  }
}
