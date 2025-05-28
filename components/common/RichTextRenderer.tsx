import React from 'react';

interface RichTextRendererProps {
  text: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: 'ul' | 'ol' | null = null;
  let listItems: React.ReactNode[] = [];
  let inParagraph = false;
  let paragraphContent: React.ReactNode[] = [];


  const flushParagraph = (keySuffix: string) => {
    if (paragraphContent.length > 0) {
      elements.push(<p key={`p-${elements.length}-${keySuffix}`} className="my-2">{paragraphContent}</p>);
      paragraphContent = [];
    }
    inParagraph = false;
  };
  
  const flushList = (keySuffix: string) => {
    if (listItems.length > 0 && currentList) {
      flushParagraph(`pre-list-${keySuffix}`); // Ensure any preceding paragraph is flushed
      if (currentList === 'ul') elements.push(<ul key={`ul-${elements.length}-${keySuffix}`} className="list-disc list-outside pl-5 my-2 space-y-1">{listItems}</ul>);
      if (currentList === 'ol') elements.push(<ol key={`ol-${elements.length}-${keySuffix}`} className="list-decimal list-outside pl-5 my-2 space-y-1">{listItems}</ol>);
      listItems = [];
    }
    currentList = null;
  };

  // Helper function for bold/italic, to be used by processInlineFormatting
  const applyBoldAndItalic = (textSegment: string, keyPrefix: string): React.ReactNode[] => {
    if (!textSegment) return ['']; // Return empty string in array if segment is empty
    const nodes: React.ReactNode[] = [];
    let lastIdx = 0;
    // Regex: **text** or *text*. Avoids single * or ** if not paired.
    const regex = /(\*\*(?!\s)(.+?[^\s])\*\*)|(\*(?!\s)(.+?[^\s])\*)/g;
    let match;
    let nodeKey = 0;

    while((match = regex.exec(textSegment)) !== null) {
        if (match.index > lastIdx) {
            nodes.push(textSegment.substring(lastIdx, match.index));
        }
        if (match[1]) { // Bold **text**
            nodes.push(<strong key={`${keyPrefix}-strong-${nodeKey++}`}>{match[2]}</strong>);
        } else if (match[3]) { // Italic *text*
            nodes.push(<em key={`${keyPrefix}-em-${nodeKey++}`}>{match[4]}</em>);
        }
        lastIdx = match.index + match[0].length;
    }
    if (lastIdx < textSegment.length) {
        nodes.push(textSegment.substring(lastIdx));
    }
    return nodes.length > 0 ? nodes : [textSegment]; // Return array of nodes, or original string in array
  };
  
  const processInlineFormatting = (line: string, keyPrefix: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remainingLine = line;
    let partKey = 0;

    const combinedRegex = /(\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\))|(https?:\/\/[^\s"<>]+)/g;

    let match;
    let lastIndex = 0;
    while ((match = combinedRegex.exec(remainingLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(...applyBoldAndItalic(remainingLine.substring(lastIndex, match.index), `${keyPrefix}-text-${partKey}`));
      }
      partKey++;

      const url = match[3] || match[4]; 
      const rawLinkText = match[2] || url; 

      parts.push(
        <a
          key={`${keyPrefix}-link-${partKey++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ai-response-link-button"
        >
          {applyBoldAndItalic(rawLinkText, `${keyPrefix}-linktext-${partKey}`)}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < remainingLine.length) {
      parts.push(...applyBoldAndItalic(remainingLine.substring(lastIndex), `${keyPrefix}-text-${partKey}`));
    }
    
    return parts;
  };


  lines.forEach((line, index) => {
    const key = `line-${index}`;
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('### ')) {
      flushList(key);
      flushParagraph(key);
      elements.push(<h3 key={key} className="text-lg font-semibold mt-3 mb-1">{processInlineFormatting(trimmedLine.substring(4), key)}</h3>);
      return;
    }
    if (trimmedLine.startsWith('## ')) {
      flushList(key);
      flushParagraph(key);
      elements.push(<h2 key={key} className="text-xl font-semibold mt-4 mb-2">{processInlineFormatting(trimmedLine.substring(3), key)}</h2>);
      return;
    }
    if (trimmedLine.startsWith('# ')) {
      flushList(key);
      flushParagraph(key);
      elements.push(<h1 key={key} className="text-2xl font-bold mt-5 mb-3">{processInlineFormatting(trimmedLine.substring(2), key)}</h1>);
      return;
    }

    const ulMatch = trimmedLine.match(/^(\*|-)\s+(.*)/);
    if (ulMatch) {
      flushParagraph(key); // Flush paragraph before starting/continuing a list
      if (currentList !== 'ul') {
        flushList(key); // Flush if changing list type or starting new
        currentList = 'ul';
      }
      listItems.push(<li key={`${key}-li`}>{processInlineFormatting(ulMatch[2], key)}</li>);
      return;
    }

    const olMatch = trimmedLine.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      flushParagraph(key);
      if (currentList !== 'ol') {
        flushList(key);
        currentList = 'ol';
      }
      listItems.push(<li key={`${key}-li`}>{processInlineFormatting(olMatch[2], key)}</li>);
      return;
    }
    
    // If line is not a list item, heading, or empty, it's part of a paragraph or a standalone line.
    flushList(key); // End any list if current line is not a list item

    if (trimmedLine === '') {
      flushParagraph(key); // Empty line flushes current paragraph
    } else {
      if (!inParagraph) {
        inParagraph = true;
        // New paragraph starts, add its content.
        // If paragraphContent is not empty here, it's a logic error or a new paragraph directly after another.
      }
      // Add processed line to current paragraph content
      // If paragraphContent is not empty, add a space before the new content unless it's the first piece.
      if (paragraphContent.length > 0) {
        paragraphContent.push(' '); // Add space between "sentences" or lines merged into one paragraph.
      }
      paragraphContent.push(...processInlineFormatting(trimmedLine, key));
    }
  });

  flushList(`final`); // Flush any remaining list items
  flushParagraph(`final`); // Flush any remaining paragraph content

  return <>{elements}</>;
};

export default RichTextRenderer;
