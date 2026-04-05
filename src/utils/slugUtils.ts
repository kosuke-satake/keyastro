
/**
 * Generates a URL-friendly slug from a string.
 * Used for heading IDs and other anchors.
 * Supports international characters (including Japanese).
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\p{L}\p{N}\p{M}\-_]/gu, '') // Keep letters, numbers, marks, dashes, underscores. Remove others.
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}
