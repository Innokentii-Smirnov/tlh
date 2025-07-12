export function makeGloss(translation: string, tag: string) {
  const gloss = translation + 
    ((tag.startsWith('=') || tag.startsWith('.') || tag === '') ? '' : '-') + tag;
  return gloss;
}
