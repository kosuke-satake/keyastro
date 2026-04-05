import { getEntry } from 'astro:content';

type MediaDiscriminant = 'blog' | 'events' | 'leaders' | 'others' | 'none';

// Relaxed type to match Zod output more easily
type MediaImageRef = 
  | string 
  | { discriminant: string; value?: string | unknown } 
  | undefined 
  | null;

/**
 * Resolves a media reference to its file path.
 * @param imageRef The reference from the content collection (slug string or conditional object)
 * @param defaultCollection Optional default collection to search if imageRef is a simple slug (e.g. 'mediaLeaders')
 * @returns The public URL path to the image, or undefined if not found.
 */
export async function getMediaImage(
  imageRef: MediaImageRef, 
  defaultCollection: 'mediaBlog' | 'mediaEvents' | 'mediaLeaders' | 'mediaOthers' = 'mediaBlog'
): Promise<string | undefined> {
  if (!imageRef) return undefined;

  // Case 1: Legacy path string
  if (typeof imageRef === 'string' && imageRef.startsWith('/')) {
    return imageRef;
  }

  let collection: 'mediaBlog' | 'mediaEvents' | 'mediaLeaders' | 'mediaOthers';
  let slug: string;

  // Case 2: Conditional field object { discriminant, value }
  if (typeof imageRef === 'object' && 'discriminant' in imageRef) {
    if (imageRef.discriminant === 'none') return undefined;

    switch (imageRef.discriminant) {
      case 'blog': collection = 'mediaBlog'; break;
      case 'events': collection = 'mediaEvents'; break;
      case 'leaders': collection = 'mediaLeaders'; break;
      case 'others': collection = 'mediaOthers'; break;
      default: return undefined;
    }
    
    if (typeof imageRef.value !== 'string') return undefined;
    slug = imageRef.value;
  } 
  // Case 3: Simple slug string (relationship field)
  else if (typeof imageRef === 'string') {
    collection = defaultCollection;
    slug = imageRef;
  } else {
    console.log('[Media] Invalid imageRef format:', imageRef);
    return undefined;
  }

  // console.log(`[Media] Resolving: ${collection} / ${slug}`);

  try {
    // @ts-ignore - Dynamic collection access
    const mediaEntry = await getEntry(collection, slug);
    if (mediaEntry) {
      // console.log(`[Media] Resolved to: ${mediaEntry.data.file}`);
      return mediaEntry.data.file;
    } else {
      console.warn(`[Media] Entry not found: ${collection}/${slug}`);
    }
  } catch (error) {
    console.warn(`[Media] Failed to resolve media: ${collection}/${slug}`, error);
  }

  return undefined;
}

/**
 * Helper to get alt text from a media entry
 */
export async function getMediaAlt(imageRef: MediaImageRef, defaultCollection: 'mediaBlog' | 'mediaEvents' | 'mediaLeaders' | 'mediaOthers' = 'mediaBlog'): Promise<string | undefined> {
  if (!imageRef) return undefined;
  if (typeof imageRef === 'string' && imageRef.startsWith('/')) return undefined;

  let collection: any;
  let slug: string;

  if (typeof imageRef === 'object' && 'discriminant' in imageRef) {
     if (imageRef.discriminant === 'none') return undefined;

     switch (imageRef.discriminant) {
      case 'blog': collection = 'mediaBlog'; break;
      case 'events': collection = 'mediaEvents'; break;
      case 'leaders': collection = 'mediaLeaders'; break;
      case 'others': collection = 'mediaOthers'; break;
      default: return undefined;
    }
    if (typeof imageRef.value !== 'string') return undefined;
    slug = imageRef.value;
  } else if (typeof imageRef === 'string') {
    collection = defaultCollection;
    slug = imageRef;
  } else {
    return undefined;
  }
  
  const mediaEntry = await getEntry(collection, slug);
  return mediaEntry?.data.alt;
}
