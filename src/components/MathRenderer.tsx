import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', block = false }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Check if the content is purely or primarily a LaTeX formula without Bengali text
    const hasBengali = /[\u0980-\u09FF]/.test(content);
    const hasMathSymbols = /[\\{}^_]/.test(content) || /log_|sqrt|frac|le|ge/.test(content);

    // If pure math without Bengali and has math symbols, render whole string as math
    if (!hasBengali && hasMathSymbols && !content.includes('$')) {
      try {
        return katex.renderToString(content, {
          displayMode: block,
          throwOnError: false,
        });
      } catch {
        // Fallback to text
        return content;
      }
    }

    // Replace $...$ delimited math
    let text = content;
    const parts = text.split(/(\$[^$]+\$)/g);

    return parts
      .map((part) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1);
          try {
            return katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
            });
          } catch {
            return part;
          }
        }

        // Check for inline LaTeX commands without $ delimiters (e.g. \log_{a}7, \frac{5}{2})
        // Regex to capture LaTeX tokens like \command{...} or \command
        const mathTokenRegex = /(\\(?:log|frac|sqrt|le|ge|cdot|times|emptyset)(?:_[a-zA-Z0-9]+|\^[a-zA-Z0-9]+|\{[^}]*\})*|[a-zA-Z0-9]\^[0-9]+|[a-zA-Z0-9]_[0-9]+|P\([A-Z]\))/g;

        return part.replace(mathTokenRegex, (match) => {
          try {
            return katex.renderToString(match, {
              displayMode: false,
              throwOnError: false,
            });
          } catch {
            return match;
          }
        });
      })
      .join('');
  }, [content, block]);

  return (
    <span
      className={`inline-math-container ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
