import type { LegalBlock } from './api';

/** Simple editor format: paragraphs, `## heading`, `- bullet`, `@company`. */
export function blocksToText(blocks: LegalBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === 'p') return block.text.trim();
      if (block.type === 'h3') return `## ${block.text.trim()}`;
      if (block.type === 'ul') return block.items.map((item) => `- ${item.trim()}`).join('\n');
      return '@company';
    })
    .filter(Boolean)
    .join('\n\n');
}

export function textToBlocks(raw: string): LegalBlock[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const blocks: LegalBlock[] = [];
  let para: string[] = [];
  let items: string[] = [];

  const flushPara = () => {
    const text = para.join(' ').replace(/\s+/g, ' ').trim();
    if (text) blocks.push({ type: 'p', text });
    para = [];
  };
  const flushList = () => {
    if (items.length) blocks.push({ type: 'ul', items });
    items = [];
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flushPara();
      flushList();
      continue;
    }
    if (t === '@company' || t === '{{contact}}') {
      flushPara();
      flushList();
      blocks.push({ type: 'contact' });
      continue;
    }
    if (t.startsWith('## ')) {
      flushPara();
      flushList();
      const heading = t.slice(3).trim();
      if (heading) blocks.push({ type: 'h3', text: heading });
      continue;
    }
    if (/^[-*•]\s+/.test(t)) {
      flushPara();
      items.push(t.replace(/^[-*•]\s+/, '').trim());
      continue;
    }
    flushList();
    para.push(t);
  }
  flushPara();
  flushList();
  return blocks.length ? blocks : [{ type: 'p', text: 'Add your copy here.' }];
}

const TOKEN =
  /(https?:\/\/[^\s]+|www\.[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

export function splitLinkedText(text: string): Array<{ type: 'text' | 'link'; value: string; href?: string }> {
  const parts: Array<{ type: 'text' | 'link'; value: string; href?: string }> = [];
  let last = 0;
  const src = text;
  for (const match of src.matchAll(TOKEN)) {
    const value = match[0];
    const start = match.index ?? 0;
    if (start > last) parts.push({ type: 'text', value: src.slice(last, start) });
    const href = value.includes('@')
      ? `mailto:${value}`
      : value.startsWith('http')
        ? value
        : `https://${value}`;
    parts.push({ type: 'link', value, href });
    last = start + value.length;
  }
  if (last < src.length) parts.push({ type: 'text', value: src.slice(last) });
  return parts.length ? parts : [{ type: 'text', value: text }];
}
