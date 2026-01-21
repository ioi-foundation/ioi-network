import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import { SIDEBAR_DATA } from './core/constants';
import { checkContentIntegrity, flattenDocs, SyncResult } from './core/utils';
import { DocsLayout } from './layout/DocsLayout';
import { DocsSidebar } from './features/navigation/DocsSidebar';
import { SourceStatus } from './features/content/SourceStatus';
import { TableOfContents } from './features/navigation/TableOfContents';
import { NavigationTab } from './core/types';

// Shared UI imports
import { SkeletonCard, SkeletonText, FadeIn } from '@ioi/ui';

// Map repo keys to local directory paths (relative to public/)
// These align with the folders created by scripts/sync-repos.js
const LOCAL_REPO_MAP: Record<string, string> = {
  kernel: 'sources/kernel',
  swarm: 'sources/swarm', 
  ddk: 'sources/ddk',
  api: 'sources/api'
};

const CodeBlock = ({ node, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLPreElement>(null);

  const onCopy = () => {
    if (ref.current) {
      navigator.clipboard.writeText(ref.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950/50">
      <div className="absolute top-0 right-0 p-2 flex items-center gap-2">
        <span className="text-[10px] text-zinc-600 font-mono uppercase">
          {className?.replace('language-', '') || 'text'}
        </span>
        <button 
          onClick={onCopy}
          className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre ref={ref} className={`${className} !my-0 !bg-transparent !p-4 overflow-x-auto`} {...props}>
        {children}
      </pre>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.KERNEL);
  // Default to the intro page synced from the root README
  const [activeDocId, setActiveDocId] = useState<string>('intro');
  
  // Content State
  const [markdown, setMarkdown] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatuses, setSyncStatuses] = useState<Record<string, SyncResult>>({});

  const currentSection = SIDEBAR_DATA[activeTab];
  const flatDocs = useMemo(() => flattenDocs(currentSection.items), [currentSection]);
  
  // Find active doc or fallback to first
  const activeDoc = useMemo(() => 
    flatDocs.find(d => d.id === activeDocId) || flatDocs[0], 
  [flatDocs, activeDocId]);

  // 1. Load Content (Real Fetch)
  useEffect(() => {
    const fetchContent = async () => {
      if (!activeDoc) return;
      setIsLoading(true);
      setMarkdown(''); 
      
      try {
        // Fetch Markdown
        // Matches the structure created by sync script: public/docs/{id}.md
        const docRes = await fetch(`/docs/${activeDoc.id}.md`);
        let docText = '';
        
        if (docRes.ok) {
          docText = await docRes.text();
          setMarkdown(docText);
        } else {
          setMarkdown(`# ${activeDoc.label}\n\n*Documentation file not found: /docs/${activeDoc.id}.md*`);
        }

        // Fetch Source Code (if mapped)
        let srcText = '';
        if (activeDoc.source) {
          const mapPrefix = LOCAL_REPO_MAP[activeDoc.source.repo];
          if (mapPrefix) {
            const localPath = `/${mapPrefix}/${activeDoc.source.path}`;
            try {
              const srcRes = await fetch(localPath);
              if (srcRes.ok) {
                srcText = await srcRes.text();
                setSourceCode(srcText);
              }
            } catch (e) {
              console.warn("Failed to fetch local source:", e);
            }
          }
        } else {
          setSourceCode('');
        }

        // Calculate Drift
        if (docText && srcText) {
          const status = checkContentIntegrity(docText, srcText);
          setSyncStatuses(prev => ({ ...prev, [activeDoc.id]: status }));
        } else if (activeDoc.source) {
          // Source config exists but file failed to load
          setSyncStatuses(prev => ({ 
            ...prev, 
            [activeDoc.id]: { status: 'unknown', missingSymbols: [] } 
          }));
        }

      } catch (e) {
        console.error("Content loading failed", e);
        setMarkdown("# Error\nFailed to load documentation content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [activeDocId, activeDoc]);

  // 2. Background Drift Check (for Sidebar badges)
  useEffect(() => {
    const checkAllDocs = async () => {
      const updates: Record<string, SyncResult> = {};
      
      // Limit to current section to save bandwidth
      const docsToCheck = flatDocs.filter(d => d.source && d.id !== activeDocId);
      
      for (const doc of docsToCheck) {
        if (!doc.source) continue;
        const mapPrefix = LOCAL_REPO_MAP[doc.source.repo];
        if (!mapPrefix) continue;

        try {
          const [mdRes, srcRes] = await Promise.all([
            fetch(`/docs/${doc.id}.md`),
            fetch(`/${mapPrefix}/${doc.source.path}`)
          ]);
          
          if (mdRes.ok && srcRes.ok) {
            const md = await mdRes.text();
            const src = await srcRes.text();
            updates[doc.id] = checkContentIntegrity(md, src);
          }
        } catch (e) { /* ignore background errors */ }
      }
      setSyncStatuses(prev => ({ ...prev, ...updates }));
    };
    
    // Slight delay to prioritize main content
    const timer = setTimeout(checkAllDocs, 1000);
    return () => clearTimeout(timer);
  }, [activeTab]); // Re-run when switching tabs

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    const firstDoc = flattenDocs(SIDEBAR_DATA[tab].items)[0];
    if (firstDoc) setActiveDocId(firstDoc.id);
  };

  return (
    <DocsLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      sidebar={
        <DocsSidebar 
          section={currentSection} 
          activeDocId={activeDocId} 
          onSelect={setActiveDocId}
          syncStatuses={syncStatuses}
        />
      }
      toc={
        <TableOfContents markdown={markdown} />
      }
    >
      <FadeIn>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-8 font-mono">
          <span className="hover:text-zinc-300 transition-colors cursor-pointer">IOI</span>
          <span>/</span>
          <span className="text-zinc-300">{currentSection.label}</span>
          <span>/</span>
          <span className="text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/50">
            {activeDoc?.label}
          </span>
        </div>

        {/* Source Integrity Monitor */}
        {activeDoc?.source && (
          <SourceStatus 
            status={syncStatuses[activeDoc.id]?.status || 'verifying'}
            missingSymbols={syncStatuses[activeDoc.id]?.missingSymbols}
            repo={activeDoc.source.repo}
            path={activeDoc.source.path}
          />
        )}

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonText width="w-1/2" height="h-10" />
            <div className="space-y-3">
              <SkeletonText width="w-full" height="h-4" />
              <SkeletonText width="w-5/6" height="h-4" />
              <SkeletonText width="w-4/6" height="h-4" />
            </div>
            <SkeletonCard className="h-48" />
          </div>
        ) : (
          <article className="prose prose-invert max-w-none 
            prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-zinc-100
            prose-p:text-zinc-400 prose-p:leading-7
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-zinc-200 prose-strong:font-semibold
            prose-code:text-cyan-300 prose-code:font-normal prose-code:bg-cyan-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-hr:border-zinc-800
            prose-ul:my-6 prose-li:my-2
            prose-th:text-left prose-th:text-zinc-300 prose-td:text-zinc-400 prose-tr:border-zinc-800
            prose-blockquote:border-l-cyan-500 prose-blockquote:bg-zinc-900/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-zinc-400
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: CodeBlock,
                h1: ({node, ...props}) => <h1 className="text-3xl mb-8" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl mt-10 mb-4 pb-2 border-b border-zinc-800" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg mt-8 mb-3 text-zinc-200" {...props} />,
              }}
            >
              {markdown}
            </ReactMarkdown>
          </article>
        )}
      </FadeIn>
    </DocsLayout>
  );
}