// translator.ts

import { nogsMap, nogsSwearMap} from "./nogsMap.ts"

export interface FilterOptions {
  toNogs?: boolean;
  swearFilter?: boolean;
  customFilter?: {
    pattern: RegExp;
    replacement: string;
  };
}

const PATTERNS = [
  /(https?:\/\/)?([a-z0-9]+\.)+[a-z]{2,}(\/\S*)?/gi,
  /\p{Extended_Pictographic}+/gu,
  /([a-z0-9-]+\.)+[a-z]{2,}/gi,
  /@[a-zA-Z0-9][a-zA-Z0-9_.-]*/g,
  /\/[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/g,
];

export function translate(input: string, options?: FilterOptions): string {
  if (!input) return "";
  const toNogs = options?.toNogs ?? !isNogs(input);
  
  if (toNogs) {
    const cleanedInput = formatAndCleanInput(input, options);
    return encodeNogs(cleanedInput);
  } else {
    const translated = decodeNogs(input);
    return formatAndCleanInput(translated, options);
  }
}

export function isNogs(input: string): boolean {
  if (!input) return false;
  const words = input.split(/\s+/).filter(word => word.length > 0);
  if (words.length === 0) return false;
  const nogsSymbols = Object.values(nogsMap);
  const nogsWords = words.filter(word => nogsSymbols.includes(word));
  return nogsWords.length > words.length / 2;
}

function formatAndCleanInput(input: string, options?: FilterOptions): string {
  if (!input || !options) return input;
  
  let output = input;
  
  if (options.swearFilter) {
    const swearPattern = new RegExp(Object.keys(nogsSwearMap).join("|"), "gi");
    output = output.replace(swearPattern, match => 
      nogsSwearMap[match.toLowerCase()] || match
    );
  }
  
  if (options.customFilter) {
    output = output.replace(
      options.customFilter.pattern,
      options.customFilter.replacement
    );
  }
  
  return output;
}

function isWhitespace(char: string): boolean {
  const nogsSymbols = ["◧", "◨", "◪", "◩", "▢", "📰", "◘", "⧉"];
  return !nogsSymbols.includes(char) && /\s/.test(char);
}

function encodeNogs(input: string): string {
  let output = "";
  let i = 0;
  let prevWasEmoji = false;

  while (i < input.length) {
    // Handle emojis first
    const emojiMatch = input.slice(i).match(/^\p{Extended_Pictographic}+/u);
    if (emojiMatch?.[0]) {
      output += (output && !prevWasEmoji && !output.endsWith(" ") ? " " : "") + emojiMatch[0];
      i += emojiMatch[0].length;
      prevWasEmoji = true;
      continue;
    }
    
    // Handle other special patterns
    let matched = false;
    for (const pattern of PATTERNS) {
      if (pattern.source.includes('Extended_Pictographic')) continue;
      const match = input.slice(i).match(pattern);
      if (match?.[0] && input.slice(i).indexOf(match[0]) === 0) {
        output += (output && !output.endsWith(" ") ? " " : "") + match[0];
        i += match[0].length;
        matched = true;
        prevWasEmoji = false;
        break;
      }
    }
    
    if (matched) continue;
    
    const char = input[i];
    if (char === "\n" || char === "\r") {
      output += char;
      prevWasEmoji = false;
    } else if (nogsMap[char.toLowerCase()]) {
      const lastChar = output[output.length - 1];
      const needsSpace = output && !isWhitespace(lastChar) && !output.endsWith(" ");
      output += needsSpace ? " " : "";
      output += nogsMap[char.toLowerCase()];
      prevWasEmoji = false;
    } else if (isWhitespace(char)) {
      if (!output.endsWith(" ")) {
        output += " ";
      }
      prevWasEmoji = false;
    }
    i++;
  }
  
  return output.trim();
}

function decodeNogs(input: string): string {
  if (!input) return "";

  const lines = input.split(/(\r\n|\r|\n)/);
  const reverseNogsMap = Object.fromEntries(
    Object.entries(nogsMap).map(([k, v]) => [v, k])
  );
  
  let result = "";
  
  for (const line of lines) {
    // Preserve line breaks
    if (line.match(/\r\n|\r|\n/)) {
      result += line;
      continue;
    }
    
    // Handle empty lines
    if (!line.trim()) {
      result += line;
      continue;
    }
    
    // Process nogs symbols
    const words = line.split(/\s+/).filter(w => w);
    let lineResult = "";
    let prevWasSpecial = false;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let matched = false;
      
      // Check for special patterns
      for (const pattern of PATTERNS) {
        if (pattern.test(word)) {
          if (lineResult && !prevWasSpecial) {
            lineResult += " ";
          }
          lineResult += word;
          if (i < words.length - 1) {
            lineResult += " ";
          }
          matched = true;
          prevWasSpecial = true;
          break;
        }
      }
      
      if (!matched) {
        if (reverseNogsMap[word]) {
          lineResult += reverseNogsMap[word];
          prevWasSpecial = false;
        } else {
          if (lineResult && !prevWasSpecial) {
            lineResult += " ";
          }
          lineResult += word;
          if (i < words.length - 1) {
            lineResult += " ";
          }
          prevWasSpecial = true;
        }
      }
    }
    
    result += lineResult;
  }
  
  return result.trim();
}