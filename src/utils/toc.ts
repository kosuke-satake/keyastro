import Markdoc, { type Node } from '@markdoc/markdoc';
import { generateSlug } from './slugUtils';

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export function extractHeadings(content: string): Heading[] {
  const ast = Markdoc.parse(content);
  const headings: Heading[] = [];

  function visit(node: Node) {
    if (node.type === 'heading') {
      const depth = node.attributes.level;
      
      const extractText = (n: Node): string => {
        if (n.type === 'text') {
          return n.attributes.content || '';
        }
        if (n.children) {
          return n.children.map(extractText).join('');
        }
        return '';
      };

      const text = node.children.map(extractText).join('');
      const slug = generateSlug(text);

      headings.push({ depth, slug, text });
    }

    if (node.children) {
      node.children.forEach(visit);
    }
  }

  visit(ast);
  return headings;
}