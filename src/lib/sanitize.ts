// ===========================================
// CYBER.DEV Portfolio — DOMPurify Sanitization
// Prevents XSS in Markdown/HTML content
// ===========================================

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe Markdown-rendered HTML tags only.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      // Text formatting
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "strong", "b", "em", "i", "u", "s", "del",
      "mark", "small", "sub", "sup",
      // Lists
      "ul", "ol", "li",
      // Links & media
      "a", "img",
      // Code
      "code", "pre", "kbd", "samp",
      // Tables
      "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      // Block elements
      "blockquote", "div", "span",
      // Details/Summary
      "details", "summary",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "target", "rel",
      "class", "id",
      "width", "height",
      "colspan", "rowspan",
      "loading", // lazy loading
    ],
    // Force safe link attributes
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["script", "style", "iframe", "form", "input", "textarea", "select", "button", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
  });
}

/**
 * Sanitize plain text input (strip all HTML)
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
