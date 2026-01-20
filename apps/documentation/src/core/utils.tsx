import { DocItem } from './types';

export interface SyncResult {
  status: 'synced' | 'drift' | 'verifying' | 'unknown';
  missingSymbols: string[];
}

export const checkContentIntegrity = (doc: string, source: string): SyncResult => {
  if (!doc || !source) return { status: 'unknown', missingSymbols: [] };

  const rustBlocks: string[] = doc.match(/```rust([\s\S]*?)```/g) || [];
  const missing: string[] = [];
  
  rustBlocks.forEach(block => {
    const regex = /(?:enum|struct|fn)\s+(\w+)/g;
    let match;
    while ((match = regex.exec(block)) !== null) {
        const name = match[1];
        if (!source.includes(name)) {
            missing.push(name);
        }
    }
  });

  if (missing.length > 0) return { status: 'drift', missingSymbols: [...new Set(missing)] };
  if (rustBlocks.length > 0) return { status: 'synced', missingSymbols: [] };
  return { status: 'unknown', missingSymbols: [] };
};

export const flattenDocs = (items: DocItem[]): DocItem[] => {
  return items.reduce((acc, item) => {
    if (item.type === 'doc') acc.push(item);
    if (item.items) acc.push(...flattenDocs(item.items));
    return acc;
  }, [] as DocItem[]);
};

export const findNodePath = (items: DocItem[], id: string): DocItem[] | null => {
  for (const item of items) {
    if (item.id === id) return [item];
    if (item.items) {
      const childPath = findNodePath(item.items, id);
      if (childPath) return [item, ...childPath];
    }
  }
  return null;
};