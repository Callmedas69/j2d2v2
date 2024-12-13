// Helper functions for testing

import { nogsMap } from "./nogsMap.ts";

/**
 * Creates a properly formatted nogs string with correct spacing
 * Handles special characters and maintains original spacing
 */
export function formatNogsString(input: string): string {
    // Remove extra whitespace but preserve newlines
    return input.split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Helper function to create nogs strings with proper spacing
   */
  export function makeNogs(...chars: string[]): string {
    return chars.filter(Boolean).join(" ").trim();
  }
  
  /**
   * Helper function to convert a word to its nogs representation
   * Preserves special characters and spacing
   */
  export function makeNogsWord(word: string, preserveSpacing = false): string {
    if (!word) return '';
    
    const chars = word.split('');
    const nogsChars = chars.map(char => {
      if (nogsMap[char.toLowerCase()]) {
        return nogsMap[char.toLowerCase()];
      }
      // Preserve special characters
      if (char.match(/[{}[\]"',.?!@#$%^&*():/\\-]/)) {
        return char;
      }
      // Preserve whitespace if needed
      if (preserveSpacing && char.match(/\s/)) {
        return char;
      }
      return char;
    });
    
    return nogsChars.join(' ').trim();
  }
  
  /**
   * Helper function to handle special content like JSON
   */
  export function formatSpecialContent(content: string): string {
    // Preserve JSON structure
    if (content.startsWith('{') || content.startsWith('[')) {
      return content;
    }
    // Handle code snippets
    if (content.includes('function') || content.includes('return')) {
      return content;
    }
    // Default word spacing
    return content.split(/\s+/).join(' ');
  }