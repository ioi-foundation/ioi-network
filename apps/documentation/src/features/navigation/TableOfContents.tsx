// File: src/features/navigation/TableOfContents.tsx
import React, { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents = ({ markdown }: { markdown: string }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // 1. Parse Headings from Markdown
  useEffect(() => {
    const lines = markdown.split('\n');
    const extracted: Heading[] = [];
    
    // Slugify helper
    const slugify = (text: string) => 
      text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    lines.forEach(line => {
      // Match # Heading, ## Heading, etc.
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        extracted.push({
          level: match[1].length,
          text: match[2],
          id: slugify(match[2]) // Note: Ensure ReactMarkdown is generating matching IDs
        });
      }
    });

    setHeadings(extracted);
  }, [markdown]);

  // 2. Scroll Spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0% -80% 0%' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 pl-8 border-l border-zinc-800 fixed right-8 top-24 h-[calc(100vh-6rem)] overflow-y-auto">
      <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-4">
        On this page
      </h5>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                setActiveId(heading.id);
              }}
              className={`
                block text-xs transition-colors truncate
                ${activeId === heading.id 
                  ? 'text-cyan-400 font-medium' 
                  : 'text-zinc-500 hover:text-zinc-300'}
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};