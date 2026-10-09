// remark-reading-time.mjs
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    
    // 將計算結果寫入 frontmatter 資料中
    data.astro ??= {};
    data.astro.frontmatter ??= {};
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}