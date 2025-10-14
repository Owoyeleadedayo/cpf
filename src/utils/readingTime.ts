export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const text = content.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words.length / wordsPerMinute));
}
