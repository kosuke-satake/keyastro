export function getReadingTime(text: string): string {
  const wordsPerMinute = 200;
  // Remove HTML tags for accurate word count
  const cleanText = text.replace(/<[^>]*>?/gm, '');
  const numberOfWords = cleanText.split(/\s+/).length;
  const minutes = Math.ceil(numberOfWords / wordsPerMinute);
  return `${minutes} min read`;
}

export function getReadingTimeJa(text: string): string {
  const charsPerMinute = 500; // Japanese characters per minute
  const cleanText = text.replace(/<[^>]*>?/gm, '');
  const numberOfChars = cleanText.length;
  const minutes = Math.ceil(numberOfChars / charsPerMinute);
  return `${minutes}分で読めます`;
}
