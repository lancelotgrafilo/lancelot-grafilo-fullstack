// Control characters except tab, newline, and carriage return
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_TAGS = /<[^>]*>/g;

export function cleanText(value, { multiline = false } = {}) {
  // Non-strings pass through unchanged so validation can reject them
  if (typeof value !== 'string') return value;

  let text = value
    .normalize('NFC')
    .replace(CONTROL_CHARS, '')
    .replace(HTML_TAGS, '');

  if (multiline) {
    text = text.replace(/\r\n/g, '\n');
  } else {
    // Single-line fields: collapse line breaks and tabs into a space
    text = text.replace(/[\r\n\t]+/g, ' ');
  }

  return text.trim();
}