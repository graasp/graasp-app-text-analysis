import { Keyword } from '@/config/appSettingTypes';

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

export const isKeywordsEquals = (
  k1: Keyword | string,
  k2: Keyword | string,
): boolean => {
  const compareStrings = (s1: string, s2: string): boolean =>
    s1.toLowerCase() === s2.toLowerCase();

  const isString = (k: Keyword | string): k is string => typeof k === 'string';
  const k1IsString = isString(k1);
  const k2IsString = isString(k2);

  // Don't use switch case here because it seems that
  // Typescript can't infer the types using case guards.
  if (k1IsString && k2IsString) {
    return compareStrings(k1, k2);
  }
  if (k1IsString && !k2IsString) {
    return compareStrings(k1, k2.word);
  }
  if (!k1IsString && k2IsString) {
    return compareStrings(k1.word, k2);
  }

  if (!k1IsString && !k2IsString) {
    return compareStrings(k1.word, k2.word);
  }

  throw new Error(
    `${typeof k1} and ${typeof k1} must be valid keywords or strings.`,
  );
};

export const includes = (
  keywords: Keyword[],
  keyword: Keyword | string,
): boolean => keywords.find((k) => isKeywordsEquals(k, keyword)) !== undefined;
