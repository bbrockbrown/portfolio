// A tiny subset of Strudel's mini-notation: enough to show the patch as code and
// know which 16th-note steps each token plays on. Supports words, `~` rests,
// `[...]` groups, `*n` repeats, and `,` to stack layers over the same cycle.

export interface MiniToken {
  text: string;
  /** Character range in the source, so the original string can be re-rendered around it. */
  start: number;
  end: number;
  /** Steps (0..steps-1) this token fires on; empty for rests. */
  steps: number[];
}

type Node =
  | { kind: 'word'; token: MiniToken; times: number }
  | { kind: 'group'; children: Node[]; times: number };

export function parseMini(src: string, steps = 16): MiniToken[] {
  const tokens: MiniToken[] = [];
  let i = 0;

  const fail = (msg: string): never => {
    throw new Error(`mini-notation: ${msg} at ${i} in "${src}"`);
  };
  const skipSpaces = () => {
    while (src[i] === ' ') i++;
  };
  const repeat = () => {
    if (src[i] !== '*') return 1;
    i++;
    const m = /^\d+/.exec(src.slice(i)) ?? fail('expected a number after *');
    i += m[0].length;
    return Number(m[0]);
  };
  const sequence = (close?: string): Node[] => {
    const nodes: Node[] = [];
    for (;;) {
      skipSpaces();
      const c = src[i];
      if (c === undefined || c === ',' || c === close) return nodes;
      if (c === '[') {
        i++;
        const children = sequence(']');
        if (src[i] !== ']') fail('unclosed [');
        i++;
        nodes.push({ kind: 'group', children, times: repeat() });
      } else {
        const m = /^[a-z0-9~#]+/i.exec(src.slice(i)) ?? fail(`unexpected "${c}"`);
        const token: MiniToken = { text: m[0], start: i, end: i + m[0].length, steps: [] };
        tokens.push(token);
        i += m[0].length;
        nodes.push({ kind: 'word', token, times: repeat() });
      }
    }
  };
  // Each node gets an equal slice of its parent's span; `*n` splits that slice n ways.
  const place = (nodes: Node[], t0: number, span: number) => {
    const slot = span / nodes.length;
    nodes.forEach((node, k) => {
      const each = slot / node.times;
      for (let r = 0; r < node.times; r++) {
        const t = t0 + k * slot + r * each;
        if (node.kind === 'group') place(node.children, t, each);
        else if (node.token.text !== '~') node.token.steps.push(Math.round(t));
      }
    });
  };

  for (;;) {
    place(sequence(), 0, steps);
    if (src[i] !== ',') break;
    i++;
  }
  if (i < src.length) fail(`unexpected "${src[i]}"`);
  return tokens;
}

const NOTE_NAMES = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];

/** MIDI note → Strudel note name (36 → "c2"). */
export const noteName = (midi: number) => `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
