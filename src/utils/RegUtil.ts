

export function extractStrBetweenCDATA(str: string) { 
  return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>(?=\s*<)/gi, "$1");
}
