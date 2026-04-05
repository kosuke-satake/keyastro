import Markdoc, { type Config, type RenderableTreeNode, type Node } from '@markdoc/markdoc';
import { generateSlug } from './slugUtils';

function generateID(children: RenderableTreeNode[], attributes: Record<string, any>) {
  if (attributes.id && typeof attributes.id === 'string') {
    return attributes.id;
  }
  
  const extractText = (nodes: RenderableTreeNode[]): string => {
    return nodes.map(node => {
      if (typeof node === 'string') return node;
      // Markdoc children can be complex, but for text extraction we look for recursive structures
      if (node && typeof node === 'object' && 'children' in node && Array.isArray(node.children)) {
        return extractText(node.children as RenderableTreeNode[]);
      }
      return '';
    }).join('');
  };

  const text = extractText(children);
  return generateSlug(text);
}

export const headingNode = {
  render: 'Heading',
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 },
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const id = generateID(children, attributes);

    return new Markdoc.Tag(
      `h${node.attributes.level}`,
      { ...attributes, id },
      children
    );
  },
};

export const tableNode = {
  render: 'table',
  transform(node: Node, config: Config) {
    const children = node.transformChildren(config);
    return new Markdoc.Tag('table', { class: 'table-auto w-full' }, [
      new Markdoc.Tag('tbody', {}, children)
    ]);
  }
};

export const tableTag = {
  render: 'table',
  transform(node: Node, config: Config) {
    return new Markdoc.Tag('table', { class: 'w-full' }, node.transformChildren(config));
  }
};

export const imageNode = {
  render: 'img',
  attributes: {
    src: { type: String, required: true },
    alt: { type: String },
    title: { type: String },
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    return new Markdoc.Tag('img', {
      ...attributes,
      class: 'w-full h-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 my-8 bg-gray-50 dark:bg-gray-800',
      loading: 'lazy',
      decoding: 'async',
    });
  }
};

export const libraryImage = {
  render: 'LibraryImage',
  attributes: {
    image: { type: Object, required: true },
    alt: { type: String },
    caption: { type: String },
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    // The 'image' attribute from Keystatic comes as { discriminant: '...', value: '...' }
    // We flatten it or pass it as is. Let's pass components.
    
    return new Markdoc.Tag('LibraryImage', {
      discriminant: attributes.image?.discriminant,
      value: attributes.image?.value,
      alt: attributes.alt,
      caption: attributes.caption
    });
  }
};
