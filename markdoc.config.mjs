import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}\p{M}\-_]/gu, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function extractText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map(extractText).join('');
  if (typeof content === 'object' && content !== null && 'children' in content) {
    return extractText(content.children);
  }
  return '';
}

function createTag(name, attributes = {}, children = []) {
  return {
    $$mdtype: 'Tag',
    name,
    attributes,
    children
  };
}

// Reusable schema for image attributes
const imageAttrs = {
  image: { type: String, required: true }, // It's a string (slug) now
  alt: { type: String },
  caption: { type: String },
};

export default defineMarkdocConfig({
  tags: {
    blogImage: {
      render: component('./src/components/content/LibraryImage.astro'),
      attributes: imageAttrs,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        return createTag(this.render, {
          discriminant: 'blog',
          value: attributes.image,
          alt: attributes.alt,
          caption: attributes.caption
        });
      }
    },
    eventImage: {
      render: component('./src/components/content/LibraryImage.astro'),
      attributes: imageAttrs,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        return createTag(this.render, {
          discriminant: 'events',
          value: attributes.image,
          alt: attributes.alt,
          caption: attributes.caption
        });
      }
    },
    leaderImage: {
      render: component('./src/components/content/LibraryImage.astro'),
      attributes: imageAttrs,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        return createTag(this.render, {
          discriminant: 'leaders',
          value: attributes.image,
          alt: attributes.alt,
          caption: attributes.caption
        });
      }
    },
    otherImage: {
      render: component('./src/components/content/LibraryImage.astro'),
      attributes: imageAttrs,
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        return createTag(this.render, {
          discriminant: 'others',
          value: attributes.image,
          alt: attributes.alt,
          caption: attributes.caption
        });
      }
    },
  },
  nodes: {
    heading: {
      render: component('./src/components/content/Heading.astro'),
      attributes: {
        id: { type: String },
        level: { type: Number, required: true, default: 1 },
      },
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);
        
        const text = extractText(children);
          
        const id = attributes.id || generateSlug(text);

        return createTag(this.render, { ...attributes, id }, children);
      },
    },
    table: {
      render: 'table',
      attributes: {
        class: { type: String, default: 'table-auto w-full' }
      },
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);
        return createTag('table', { ...attributes, class: 'table-auto w-full' }, [
          createTag('tbody', {}, children)
        ]);
      }
    },
    image: {
      render: 'img',
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
        title: { type: String },
      },
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        return createTag('img', {
          ...attributes,
          class: 'w-full h-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 my-8 bg-gray-50 dark:bg-gray-800',
          loading: 'lazy',
          decoding: 'async',
        });
      }
    }
  }
});
