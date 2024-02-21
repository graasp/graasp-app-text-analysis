export const isKeywordPresent = (text: string, keyword: string): boolean => {
  const regex = new RegExp(`\\b${keyword}\\b`, 'i');
  return regex.test(text);
};

export const replaceWordCaseInsensitive = (
  text: string,
  wordToReplace: string,
  replacement: string,
): string => {
  const regex = new RegExp(wordToReplace, 'gi');
  return text.replace(regex, replacement);
};
